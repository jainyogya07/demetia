"""
Synthetic Clinical Cohort Data Generator
Synthesizes high-fidelity digital motor telemetry and 10-item FAQ functional questionnaires
calibrated against clinical dementia & Mild Cognitive Impairment (MCI) distributions.
"""

from __future__ import annotations
import numpy as np
import pandas as pd

FEATURE_COLUMNS = [
    # Motor Kinematics (6)
    "tap_latency_mean_ms",
    "tap_latency_std_ms",
    "sampling_interval_jitter_ms",
    "finger_lift_velocity_px_ms",
    "stroke_curvature_index",
    "stroke_hesitation_count",
    # Caregiver 10-item FAQ / ADL (10)
    "faq_medication_compliance",
    "faq_cooking_stove_safety",
    "faq_financial_handling",
    "faq_orientation_time_space",
    "faq_transport_navigation",
    "faq_telephone_communication",
    "faq_remembering_appointments",
    "faq_personal_grooming",
    "faq_meal_preparation",
    "faq_home_safety_awareness",
    # Demographics (2)
    "age",
    "education_years",
]


def generate_synthetic_cohort(
    n_samples: int = 2000,
    random_seed: int = 42,
) -> tuple[pd.DataFrame, pd.Series]:
    """
    Generates a synthetic dataset of patient telemetry and functional reports.
    Returns:
        X: DataFrame of 18 features.
        y: Series of continuous composite impairment risk index [0.00 to 1.00].
    """
    rng = np.random.default_rng(random_seed)

    # 1. Demographics
    # Age distributed between 50 and 92, concentrated around 71
    age = np.clip(rng.normal(loc=71.0, scale=8.5, size=n_samples), 50.0, 95.0)

    # Education: mixed multimodal distribution (rural zero schooling ~18%, primary 25%, secondary/tertiary ~57%)
    edu_raw = rng.choice(
        [0, 1, 2],
        size=n_samples,
        p=[0.18, 0.27, 0.55],
    )
    education_years = np.zeros(n_samples)
    education_years[edu_raw == 0] = 0.0  # Illiterate / No schooling
    education_years[edu_raw == 1] = rng.uniform(1.0, 5.0, size=np.sum(edu_raw == 1))  # Primary
    education_years[edu_raw == 2] = rng.normal(12.5, 2.5, size=np.sum(edu_raw == 2))  # Secondary+
    education_years = np.clip(education_years, 0.0, 22.0)

    # 2. Latent true cognitive & motor impairment factor theta in [0, 1]
    # Positively skewed: most subjects are healthy/MCI, smaller tail of severe
    theta = rng.beta(a=1.6, b=3.5, size=n_samples)

    # 3. Motor Kinematics (Patient Device Telemetry)
    # Natural age slowing + true impairment effect + noise
    age_factor = (age - 65.0) / 30.0
    age_factor_pos = np.maximum(0.0, age_factor)

    # Tap latency (healthy ~210ms; MCI ~350ms; Severe ~520ms)
    tap_mean = 200.0 + (theta * 280.0) + (age_factor_pos * 45.0) + rng.normal(0, 25.0, n_samples)
    tap_mean = np.clip(tap_mean, 140.0, 800.0)

    # Tap rhythm variability (standard deviation across taps)
    tap_std = 22.0 + (theta * 95.0) + (age_factor_pos * 15.0) + rng.normal(0, 8.0, n_samples)
    tap_std = np.clip(tap_std, 8.0, 250.0)

    # Micro-jitter / tremor: touch interval deviations
    jitter = 1.2 + (theta * 8.5) + rng.normal(0, 1.0, n_samples)
    jitter = np.clip(jitter, 0.2, 25.0)

    # Finger lift release velocity (px/ms) - drops with motor inertia
    lift_vel = 3.2 - (theta * 2.1) - (age_factor_pos * 0.4) + rng.normal(0, 0.25, n_samples)
    lift_vel = np.clip(lift_vel, 0.2, 5.0)

    # Tracing / drawing curvature index (ideal = 1.0; ataxia/tremor > 1.8)
    # Education has a minor effect on stylus familiarity when healthy, controlled here
    edu_inexperience = (education_years == 0) * 0.15
    curvature = 1.1 + (theta * 1.6) + edu_inexperience + rng.normal(0, 0.15, n_samples)
    curvature = np.clip(curvature, 1.0, 4.5)

    # Stroke hesitation count (>150ms micro-stalls during continuous stroke)
    hesitations = np.round(
        np.maximum(0, (theta * 16.0) + edu_inexperience * 3.0 + rng.normal(0, 1.8, n_samples))
    ).astype(int)

    # 4. Caregiver 10-Item FAQ (Functional Activities Questionnaire, 0-3 ordinal scale)
    def sample_faq(item_difficulty_weight: float) -> np.ndarray:
        # Logistic probability curves based on theta
        logits = (theta * 4.5 * item_difficulty_weight) - 1.5 + rng.normal(0, 0.4, n_samples)
        # Map logits to discrete levels 0, 1, 2, 3
        scores = np.zeros(n_samples, dtype=int)
        scores[logits > 0.0] = 1
        scores[logits > 1.5] = 2
        scores[logits > 3.0] = 3
        return scores

    faq_medication = sample_faq(1.3)
    faq_stove_safety = sample_faq(1.4)
    faq_finances = sample_faq(1.2)
    faq_orientation = sample_faq(1.5)
    faq_transport = sample_faq(1.1)
    faq_telephone = sample_faq(0.9)
    faq_appointments = sample_faq(1.0)
    faq_grooming = sample_faq(0.8)  # preserved until later stages
    faq_meals = sample_faq(1.0)
    faq_home_safety = sample_faq(1.3)

    # Assemble feature matrix
    data = {
        "tap_latency_mean_ms": tap_mean,
        "tap_latency_std_ms": tap_std,
        "sampling_interval_jitter_ms": jitter,
        "finger_lift_velocity_px_ms": lift_vel,
        "stroke_curvature_index": curvature,
        "stroke_hesitation_count": hesitations,
        "faq_medication_compliance": faq_medication,
        "faq_cooking_stove_safety": faq_stove_safety,
        "faq_financial_handling": faq_finances,
        "faq_orientation_time_space": faq_orientation,
        "faq_transport_navigation": faq_transport,
        "faq_telephone_communication": faq_telephone,
        "faq_remembering_appointments": faq_appointments,
        "faq_personal_grooming": faq_grooming,
        "faq_meal_preparation": faq_meals,
        "faq_home_safety_awareness": faq_home_safety,
        "age": age,
        "education_years": education_years,
    }
    df_features = pd.DataFrame(data)[FEATURE_COLUMNS]

    # 5. Continuous composite risk index ground truth y in [0.0, 1.0]
    # Weighted combination of functional failure + motor deterioration + clinical noise
    faq_sum = (
        faq_medication + faq_stove_safety + faq_finances + faq_orientation
        + faq_transport + faq_telephone + faq_appointments + faq_grooming
        + faq_meals + faq_home_safety
    ) / 30.0  # normalized 0-1

    motor_composite = (
        (tap_mean - 180.0) / 400.0 * 0.35
        + (tap_std - 20.0) / 100.0 * 0.25
        + (curvature - 1.0) / 2.0 * 0.20
        + (hesitations / 15.0) * 0.20
    )
    motor_composite = np.clip(motor_composite, 0.0, 1.0)

    # Overall target: functional impairment is gold standard (60%), motor kinematics is early marker (40%)
    raw_target = (0.55 * faq_sum) + (0.45 * motor_composite) + rng.normal(0, 0.02, n_samples)
    y_target = pd.Series(np.clip(raw_target, 0.0, 1.0), name="composite_risk_index")

    return df_features, y_target
