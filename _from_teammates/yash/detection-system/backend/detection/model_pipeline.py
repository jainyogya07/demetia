"""
Model Training, ONNX Edge Export, and TreeSHAP Decomposition Pipeline
"""

from __future__ import annotations
import os
import time
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from lightgbm import LGBMRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
import shap

from .synthetic_generator import FEATURE_COLUMNS, generate_synthetic_cohort
from .schema import DomainSubIndex, RiskFlag

MODEL_DIR = Path(__file__).resolve().parent / "artifacts"
ONNX_MODEL_PATH = MODEL_DIR / "detection_model.onnx"
LIGHTGBM_MODEL_PATH = MODEL_DIR / "lgbm_model.txt"

# Clinical domain mappings
DOMAIN_MAPPINGS = {
    "Executive Function": [
        "stroke_curvature_index",
        "stroke_hesitation_count",
        "faq_financial_handling",
        "faq_remembering_appointments",
    ],
    "Daily Independence": [
        "faq_cooking_stove_safety",
        "faq_medication_compliance",
        "faq_orientation_time_space",
        "faq_transport_navigation",
        "faq_telephone_communication",
        "faq_personal_grooming",
        "faq_meal_preparation",
        "faq_home_safety_awareness",
    ],
    "Motor Speed": [
        "tap_latency_mean_ms",
        "tap_latency_std_ms",
        "sampling_interval_jitter_ms",
        "finger_lift_velocity_px_ms",
    ],
}


class DetectionModelPipeline:
    def __init__(self) -> None:
        self.model: LGBMRegressor | None = None
        self.explainer: shap.TreeExplainer | None = None
        self.expected_value: float = 0.35

    def train(
        self,
        n_samples: int = 2500,
        random_seed: int = 42,
    ) -> dict[str, Any]:
        """Trains LightGBM model on synthetic clinical telemetry and returns validation metrics."""
        MODEL_DIR.mkdir(parents=True, exist_ok=True)
        X, y = generate_synthetic_cohort(n_samples=n_samples, random_seed=random_seed)

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.20, random_state=random_seed
        )

        # Constrained tree architecture: edge friendly, tiny footprint (<5MB), prevents overfitting
        self.model = LGBMRegressor(
            n_estimators=75,
            max_depth=5,
            num_leaves=24,
            learning_rate=0.06,
            min_child_samples=25,
            subsample=0.85,
            colsample_bytree=0.85,
            random_state=random_seed,
            n_jobs=-1,
            verbose=-1,
        )
        self.model.fit(X_train, y_train)

        # Evaluate
        preds = self.model.predict(X_test)
        r2 = float(r2_score(y_test, preds))
        mae = float(mean_absolute_error(y_test, preds))

        # Save native LightGBM booster
        self.model.booster_.save_model(str(LIGHTGBM_MODEL_PATH))

        # Initialize TreeSHAP
        self.explainer = shap.TreeExplainer(self.model)
        ev = self.explainer.expected_value
        self.expected_value = float(ev[0] if isinstance(ev, (list, np.ndarray)) else ev)

        # Export to ONNX
        onnx_info = self.export_onnx()

        return {
            "r2_score": round(r2, 4),
            "mae": round(mae, 4),
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "onnx": onnx_info,
        }

    def export_onnx(self) -> dict[str, Any]:
        """Converts the trained LightGBM model to ONNX for edge / offline execution."""
        if self.model is None:
            raise RuntimeError("Model must be trained before export.")

        import onnxmltools
        from onnxmltools.convert.common.data_types import FloatTensorType

        initial_types = [("float_input", FloatTensorType([None, len(FEATURE_COLUMNS)]))]
        onnx_model = onnxmltools.convert_lightgbm(
            self.model,
            initial_types=initial_types,
            target_opset=15,
        )

        with open(ONNX_MODEL_PATH, "wb") as f:
            f.write(onnx_model.SerializeToString())

        size_kb = os.path.getsize(ONNX_MODEL_PATH) / 1024.0
        return {
            "path": str(ONNX_MODEL_PATH),
            "size_kb": round(size_kb, 2),
            "edge_ready": size_kb < 15000.0,  # Strict < 15 MB check
        }

    def ensure_loaded(self) -> None:
        """Loads trained model and SHAP explainer if not already in memory."""
        if self.model is not None and self.explainer is not None:
            return

        if LIGHTGBM_MODEL_PATH.exists():
            import lightgbm as lgb
            booster = lgb.Booster(model_file=str(LIGHTGBM_MODEL_PATH))
            self.model = LGBMRegressor()
            self.model._Booster = booster
            self.model.fitted_ = True
            self.explainer = shap.TreeExplainer(self.model)
            ev = self.explainer.expected_value
            self.expected_value = float(ev[0] if isinstance(ev, (list, np.ndarray)) else ev)
        else:
            # Auto-train if first run
            self.train()

    def predict_raw(self, feature_vector: list[float]) -> float:
        """Raw model inference score in [0.0, 1.0]."""
        self.ensure_loaded()
        arr = np.array(feature_vector, dtype=np.float32).reshape(1, -1)
        pred = float(self.model.predict(arr)[0])
        return max(0.0, min(1.0, pred))

    def explain(self, feature_dict: dict[str, float]) -> tuple[dict[str, DomainSubIndex], list[RiskFlag], list[dict[str, Any]]]:
        """Calculates TreeSHAP additive feature attributions and aggregates into clinical domains."""
        self.ensure_loaded()
        vec = [feature_dict[col] for col in FEATURE_COLUMNS]
        arr = np.array(vec, dtype=np.float32).reshape(1, -1)

        # SHAP calculation
        shap_values = self.explainer.shap_values(arr)
        if isinstance(shap_values, list):
            shap_values = shap_values[0]
        attributions = shap_values[0]

        feature_shap_map = {col: float(attributions[i]) for i, col in enumerate(FEATURE_COLUMNS)}

        # 1. Aggregate domain sub-indices
        domain_results: dict[str, DomainSubIndex] = {}
        for domain, cols in DOMAIN_MAPPINGS.items():
            sub_attributions = [feature_shap_map[c] for c in cols]
            net_attribution = float(np.sum(sub_attributions))

            # Domain normalized strain index
            # Combines positive attributions + normalized feature deviations
            domain_strain = max(0.0, min(1.0, (net_attribution + 0.15) / 0.40))

            if domain_strain < 0.28:
                lvl = "LOW"
                summary = "Function within normative healthy baseline."
            elif domain_strain < 0.52:
                lvl = "MILD"
                summary = "Subtle compensations or slowing detected."
            elif domain_strain < 0.75:
                lvl = "MODERATE"
                summary = "Deficits evident; assisted supervision recommended."
            else:
                lvl = "HIGH"
                summary = "Pronounced impairment requiring direct intervention."

            domain_results[domain] = DomainSubIndex(
                domain_name=domain,
                risk_level=lvl,
                normalized_score=round(domain_strain, 3),
                additive_attribution=round(net_attribution, 4),
                clinical_summary=summary,
            )

        # 2. Critical Safety & Functional Deficit Flags
        flags: list[RiskFlag] = []

        # Stove safety check
        if feature_dict.get("faq_cooking_stove_safety", 0) >= 2 or feature_shap_map.get("faq_cooking_stove_safety", 0) > 0.045:
            flags.append(
                RiskFlag(
                    code="STOVE_FIRE_HAZARD",
                    severity="CRITICAL",
                    feature_name="faq_cooking_stove_safety",
                    message="Frequent stove or thermal appliance unattendance reported.",
                    recommended_action="Enable automated stove shut-off device and supervise meal prep.",
                )
            )

        # Medication non-adherence check
        if feature_dict.get("faq_medication_compliance", 0) >= 2 or feature_shap_map.get("faq_medication_compliance", 0) > 0.04:
            flags.append(
                RiskFlag(
                    code="MEDICATION_NONADHERENCE",
                    severity="CRITICAL",
                    feature_name="faq_medication_compliance",
                    message="Missed or duplicate prescription doses observed.",
                    recommended_action="Deploy synchronized audio pill dispenser / caregiver-locked box.",
                )
            )

        # Spatial disorientation / wandering
        if feature_dict.get("faq_orientation_time_space", 0) >= 2 or feature_shap_map.get("faq_orientation_time_space", 0) > 0.04:
            flags.append(
                RiskFlag(
                    code="DISORIENTATION_WANDERING_RISK",
                    severity="CRITICAL",
                    feature_name="faq_orientation_time_space",
                    message="Confusion navigating familiar routes or time disorientation.",
                    recommended_action="Activate GPS geofencing perimeter and door opening alarms.",
                )
            )

        # Motor slowing / tremor anomaly
        if feature_dict.get("tap_latency_mean_ms", 0) > 420.0 or feature_dict.get("sampling_interval_jitter_ms", 0) > 6.5:
            flags.append(
                RiskFlag(
                    code="MOTOR_BRADYKINESIA_TREMOR",
                    severity="WARNING",
                    feature_name="tap_latency_mean_ms",
                    message="Significant micro-motor latency or touch tremor detected in UI interaction.",
                    recommended_action="Screen for extrapyramidal/parkinsonian motor features in neurological exam.",
                )
            )

        # Visual-spatial / stroke hesitation
        if feature_dict.get("stroke_hesitation_count", 0) >= 6 or feature_dict.get("stroke_curvature_index", 0) > 2.1:
            flags.append(
                RiskFlag(
                    code="VISUOSPATIAL_PLANNING_HESITATION",
                    severity="WARNING",
                    feature_name="stroke_hesitation_count",
                    message="Frequent motor trajectory stalls during drawing & tracing tests.",
                    recommended_action="Engage patient in targeted visuospatial memory tracing exercises.",
                )
            )

        # 3. Top contributing features (sorted by absolute SHAP attribution)
        top_features = sorted(
            [
                {
                    "feature": k,
                    "value": round(float(feature_dict[k]), 2),
                    "attribution": round(v, 4),
                    "impact": "Increases Risk" if v > 0 else "Decreases Risk",
                }
                for k, v in feature_shap_map.items()
            ],
            key=lambda item: abs(item["attribution"]),
            reverse=True,
        )

        return domain_results, flags, top_features[:6]
