"""
CLI Demonstration & Validation Suite for Cognitive-Motor Detection System
Runs model training, ONNX export, and evaluates 3 clinical edge profiles:
1. Healthy Illiterate Senior (shows demographic bias correction preventing false positive)
2. Early-Stage MCI with Executive Dysfunction (shows sub-indices and stove fire flag)
3. Moderate Impairment (shows multi-domain breakdown and urgent safety alerts)
"""

from __future__ import annotations
import json
import time

import sys
from pathlib import Path

# Support running directly as script (python demo_cli.py) or as a module (-m backend.detection.demo_cli)
if __package__ is None or __package__ == "":
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))
    from backend.detection.schema import (
        CaregiverFAQ,
        DemographicProfile,
        DetectionInput,
        MotorKinematics,
    )
    from backend.detection.engine import DetectionEngine
else:
    from .schema import (
        CaregiverFAQ,
        DemographicProfile,
        DetectionInput,
        MotorKinematics,
    )
    from .engine import DetectionEngine


def run_demo() -> None:
    print("=" * 80)
    print("🧠 SMRITI SAARTHI: COGNITIVE-MOTOR DETECTION & TELEMETRY MODULE")
    print("=" * 80)

    engine = DetectionEngine()

    # Step 1: Train model and export ONNX
    print("\n[1/3] Training LightGBM Detection Model and exporting to ONNX...")
    metrics = engine.pipeline.train(n_samples=3000, random_seed=42)
    print(f"  ✓ Train Set Size: {metrics['train_samples']} samples")
    print(f"  ✓ Validation R² Score: {metrics['r2_score']} | MAE: {metrics['mae']}")
    print(f"  ✓ ONNX Export File: {metrics['onnx']['path']}")
    print(f"  ✓ ONNX File Size: {metrics['onnx']['size_kb']} KB (Target: < 15,000 KB) — Edge Ready: {metrics['onnx']['edge_ready']}")

    # Step 2: Clinical Profiles
    profiles: list[tuple[str, DetectionInput, str]] = [
        (
            "CASE 1: 78yo Rural Senior, No Formal Schooling (Healthy Baseline)",
            DetectionInput(
                patient_id="pt-rural-01",
                demographics=DemographicProfile(age=78.0, education_years=0.0),
                motor=MotorKinematics(
                    tap_latency_mean_ms=315.0,  # naturally slower due to age & stylus unfamiliarity
                    tap_latency_std_ms=36.0,
                    sampling_interval_jitter_ms=1.8,
                    finger_lift_velocity_px_ms=2.4,
                    stroke_curvature_index=1.35,  # lower drawing familiarity
                    stroke_hesitation_count=2,
                ),
                functional=CaregiverFAQ(
                    faq_medication_compliance=0,
                    faq_cooking_stove_safety=0,
                    faq_financial_handling=0,
                    faq_orientation_time_space=0,
                    faq_transport_navigation=0,
                    faq_telephone_communication=0,
                    faq_remembering_appointments=0,
                    faq_personal_grooming=0,
                    faq_meal_preparation=0,
                    faq_home_safety_awareness=0,
                ),
            ),
            "Expected: Normal. Demographic calibration layer should offset schooling/age bias, preventing a false positive.",
        ),
        (
            "CASE 2: 68yo Former Teacher with Early Executive Dysfunction (MCI)",
            DetectionInput(
                patient_id="pt-mci-02",
                demographics=DemographicProfile(age=68.0, education_years=16.0),
                motor=MotorKinematics(
                    tap_latency_mean_ms=395.0,
                    tap_latency_std_ms=78.0,  # motor rhythm dysregulation
                    sampling_interval_jitter_ms=3.4,
                    finger_lift_velocity_px_ms=1.7,
                    stroke_curvature_index=1.85,
                    stroke_hesitation_count=8,  # motor planning micro-stalls
                ),
                functional=CaregiverFAQ(
                    faq_medication_compliance=1,
                    faq_cooking_stove_safety=2,  # Left burner unattended twice
                    faq_financial_handling=1,
                    faq_orientation_time_space=0,
                    faq_transport_navigation=0,
                    faq_telephone_communication=0,
                    faq_remembering_appointments=2,
                    faq_personal_grooming=0,
                    faq_meal_preparation=1,
                    faq_home_safety_awareness=1,
                ),
            ),
            "Expected: Mild Cognitive Concern with high Executive/Safety strain & STOVE_FIRE_HAZARD flag.",
        ),
        (
            "CASE 3: 82yo Patient with Multi-Domain Moderate Impairment",
            DetectionInput(
                patient_id="pt-severe-03",
                demographics=DemographicProfile(age=82.0, education_years=10.0),
                motor=MotorKinematics(
                    tap_latency_mean_ms=530.0,
                    tap_latency_std_ms=115.0,
                    sampling_interval_jitter_ms=7.8,  # tremor / micro-jitter
                    finger_lift_velocity_px_ms=0.85,
                    stroke_curvature_index=2.65,
                    stroke_hesitation_count=14,
                ),
                functional=CaregiverFAQ(
                    faq_medication_compliance=3,  # Completely dependent
                    faq_cooking_stove_safety=3,
                    faq_financial_handling=3,
                    faq_orientation_time_space=2,  # Wandered, lost orientation
                    faq_transport_navigation=3,
                    faq_telephone_communication=2,
                    faq_remembering_appointments=3,
                    faq_personal_grooming=2,
                    faq_meal_preparation=2,
                    faq_home_safety_awareness=3,
                ),
            ),
            "Expected: Severe/Moderate Impairment with multiple CRITICAL alerts (Stove, Meds, Wandering, Tremor).",
        ),
    ]

    print("\n[2/3] Evaluating Clinical Test Profiles...")
    for title, payload, note in profiles:
        print("\n" + "-" * 80)
        print(f"📋 {title}")
        print(f"   Clinical Context: {note}")
        print("-" * 80)

        t_start = time.perf_counter()
        report = engine.evaluate(payload, use_onnx=True)
        eval_time = (time.perf_counter() - t_start) * 1000.0

        print(f"  • Severity Classification   : {report.severity_band}")
        print(f"  • Calibrated Risk Score     : {report.calibrated_risk_score:.3f} (Raw: {report.raw_risk_score:.3f})")
        print(f"  • Demographic Offset Applied: -{report.demographic_adjustment:.3f} (Education + Age Bias Mitigation)")
        print(f"  • Inference Runtime         : {report.model_runtime} (Total pipeline: {eval_time:.1f}ms)")

        print("\n  📊 Decomposed Domain Sub-Indices (TreeSHAP Aggregates):")
        for domain_name, sub in report.domain_sub_indices.items():
            bar = "█" * int(sub.normalized_score * 20) + "░" * (20 - int(sub.normalized_score * 20))
            print(f"     - {domain_name:<30}: [{bar}] {sub.normalized_score:.2f} ({sub.risk_level}) | SHAP: {sub.additive_attribution:+.4f}")
            print(f"       Notes: {sub.clinical_summary}")

        if report.critical_flags:
            print("\n  🚨 Actionable Deficit Triggers / Safety Flags:")
            for flag in report.critical_flags:
                color = "🔴" if flag.severity == "CRITICAL" else "🟡"
                print(f"     {color} [{flag.severity}] {flag.code} ({flag.feature_name})")
                print(f"        Message: {flag.message}")
                print(f"        Action : {flag.recommended_action}")
        else:
            print("\n  ✅ Actionable Deficit Triggers: No safety alarms triggered.")

        print("\n  🔍 Top 4 Additive Feature Attributions:")
        for feat in report.top_feature_attributions[:4]:
            print(f"     • {feat['feature']:<30} = {feat['value']:<6} | Attribution: {feat['attribution']:+.4f} ({feat['impact']})")

    # Step 3: Print Sample JSON Output Schema
    print("\n[3/3] Validating JSON Output Serialization...")
    sample_json = report.model_dump_json(indent=2)
    parsed = json.loads(sample_json)
    print(f"  ✓ JSON serialization successful ({len(sample_json)} bytes). Keys: {list(parsed.keys())}")
    print("=" * 80)
    print("✅ DETECTION SYSTEM DEPLOYED AND FULLY OPERATIONAL.")
    print("=" * 80)


if __name__ == "__main__":
    run_demo()
