"""
Unified Cognitive-Motor Detection & Telemetry Analysis Engine
Combines demographic bias calibration, LightGBM/ONNX inference,
TreeSHAP explainability, and safety alert generation.
"""

from __future__ import annotations
import datetime
import time
from typing import Any

from .schema import DetectionInput, DetectionReport
from .calibrator import DemographicCalibrator
from .model_pipeline import DetectionModelPipeline, FEATURE_COLUMNS
from .onnx_runner import OnnxEdgeDetector


class DetectionEngine:
    def __init__(self) -> None:
        self.calibrator = DemographicCalibrator()
        self.pipeline = DetectionModelPipeline()
        self.onnx_runner = OnnxEdgeDetector()

    def _extract_feature_dict(self, payload: DetectionInput) -> dict[str, float]:
        """Flattens motor, functional FAQ, and demographics into a single feature dictionary."""
        d: dict[str, float] = {}

        # Motor
        m = payload.motor
        d["tap_latency_mean_ms"] = float(m.tap_latency_mean_ms)
        d["tap_latency_std_ms"] = float(m.tap_latency_std_ms)
        d["sampling_interval_jitter_ms"] = float(m.sampling_interval_jitter_ms)
        d["finger_lift_velocity_px_ms"] = float(m.finger_lift_velocity_px_ms)
        d["stroke_curvature_index"] = float(m.stroke_curvature_index)
        d["stroke_hesitation_count"] = float(m.stroke_hesitation_count)

        # Caregiver 10-item FAQ
        f = payload.functional
        d["faq_medication_compliance"] = float(f.faq_medication_compliance)
        d["faq_cooking_stove_safety"] = float(f.faq_cooking_stove_safety)
        d["faq_financial_handling"] = float(f.faq_financial_handling)
        d["faq_orientation_time_space"] = float(f.faq_orientation_time_space)
        d["faq_transport_navigation"] = float(f.faq_transport_navigation)
        d["faq_telephone_communication"] = float(f.faq_telephone_communication)
        d["faq_remembering_appointments"] = float(f.faq_remembering_appointments)
        d["faq_personal_grooming"] = float(f.faq_personal_grooming)
        d["faq_meal_preparation"] = float(f.faq_meal_preparation)
        d["faq_home_safety_awareness"] = float(f.faq_home_safety_awareness)

        # Demographics
        dg = payload.demographics
        d["age"] = float(dg.age)
        d["education_years"] = float(dg.education_years)

        return d

    def evaluate(
        self,
        payload: DetectionInput,
        use_onnx: bool = True,
    ) -> DetectionReport:
        """
        Executes full evaluation:
        1. Formats input features
        2. Executes model inference (ONNX or LightGBM)
        3. Applies demographic calibration offset
        4. Calculates TreeSHAP decomposition into domain sub-indices
        5. Evaluates critical risk triggers
        6. Produces structured clinical report
        """
        t0 = time.perf_counter()
        feature_dict = self._extract_feature_dict(payload)
        feature_vector = [feature_dict[col] for col in FEATURE_COLUMNS]

        # 1. Prediction (ONNX or LightGBM)
        runtime_mode = "LightGBM"
        if use_onnx:
            try:
                raw_pred = self.onnx_runner.predict(feature_vector)
                runtime_mode = "ONNX Edge Runtime (<2ms)"
            except Exception:
                raw_pred = self.pipeline.predict_raw(feature_vector)
                runtime_mode = "LightGBM Fallback"
        else:
            raw_pred = self.pipeline.predict_raw(feature_vector)

        # 2. Demographic Normalization Layer
        calibrated = self.calibrator.calibrate(
            raw_score=raw_pred,
            age=payload.demographics.age,
            education_years=payload.demographics.education_years,
        )

        # 3. Local TreeSHAP Explainability & Domain Sub-Indices
        domain_sub_indices, critical_flags, top_features = self.pipeline.explain(feature_dict)

        elapsed_ms = (time.perf_counter() - t0) * 1000.0

        return DetectionReport(
            patient_id=payload.patient_id,
            timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            demographics={
                "age": payload.demographics.age,
                "education_years": payload.demographics.education_years,
                "education_status": "No Formal Schooling / Illiterate" if payload.demographics.education_years <= 0.5 else f"{payload.demographics.education_years:.0f} Years",
            },
            raw_risk_score=calibrated.raw_score,
            demographic_adjustment=calibrated.adjustment_offset,
            calibrated_risk_score=calibrated.calibrated_score,
            severity_band=calibrated.severity_band,
            domain_sub_indices=domain_sub_indices,
            critical_flags=critical_flags,
            top_feature_attributions=top_features,
            model_runtime=f"{runtime_mode} in {elapsed_ms:.1f}ms",
        )
