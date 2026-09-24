from __future__ import annotations

from typing import Any
from pydantic import BaseModel, Field


class MotorKinematics(BaseModel):
    """Micro-motor kinematics gathered from client touch screen & drawing interactions."""
    tap_latency_mean_ms: float = Field(
        ...,
        description="Average tap reaction latency in milliseconds (typically 180-600ms).",
        ge=50.0,
        le=2000.0,
    )
    tap_latency_std_ms: float = Field(
        ...,
        description="Standard deviation of tap latency, capturing rhythm dysregulation.",
        ge=0.0,
        le=1000.0,
    )
    sampling_interval_jitter_ms: float = Field(
        ...,
        description="Variance in touch event delivery intervals (<16ms baseline), micro-tremor indicator.",
        ge=0.0,
        le=100.0,
    )
    finger_lift_velocity_px_ms: float = Field(
        ...,
        description="Speed of finger release off touchscreen (pixels per millisecond).",
        ge=0.01,
        le=20.0,
    )
    stroke_curvature_index: float = Field(
        ...,
        description="Ratio of actual drawing path length to ideal shortest path (spiral/trail tracing).",
        ge=1.0,
        le=10.0,
    )
    stroke_hesitation_count: int = Field(
        ...,
        description="Frequency of micro-pauses (>150ms) during continuous drawing/tracing strokes.",
        ge=0,
        le=100,
    )


class CaregiverFAQ(BaseModel):
    """10-item icon-based Activities of Daily Living (ADL) / Functional Activities Questionnaire.
    0 = Independent/Normal, 1 = Occasional difficulty/Slow, 2 = Needs assistance, 3 = Completely dependent.
    """
    faq_medication_compliance: int = Field(..., ge=0, le=3, description="Adherence to prescribed medication schedule.")
    faq_cooking_stove_safety: int = Field(..., ge=0, le=3, description="Remembering to turn off stove/appliances.")
    faq_financial_handling: int = Field(..., ge=0, le=3, description="Managing cash, change, and small transactions.")
    faq_orientation_time_space: int = Field(..., ge=0, le=3, description="Awareness of day, year, and familiar neighborhood routes.")
    faq_transport_navigation: int = Field(..., ge=0, le=3, description="Traveling independently via transit or familiar walking paths.")
    faq_telephone_communication: int = Field(..., ge=0, le=3, description="Operating phone to place and answer calls.")
    faq_remembering_appointments: int = Field(..., ge=0, le=3, description="Recalling upcoming family events and clinic visits.")
    faq_personal_grooming: int = Field(..., ge=0, le=3, description="Bathing, dressing, and hygiene self-care.")
    faq_meal_preparation: int = Field(..., ge=0, le=3, description="Assembling simple meals or finding food safely.")
    faq_home_safety_awareness: int = Field(..., ge=0, le=3, description="Locking front doors, managing keys, and hazard awareness.")


class DemographicProfile(BaseModel):
    """Demographic factors used for baseline bias calibration."""
    age: float = Field(..., ge=40.0, le=110.0, description="Chronological age in years.")
    education_years: float = Field(
        ...,
        ge=0.0,
        le=30.0,
        description="Years of formal schooling (0 = no formal schooling / illiterate).",
    )


class DetectionInput(BaseModel):
    """Full input payload for cognitive-motor severity evaluation."""
    patient_id: str = Field(default="patient_local")
    demographics: DemographicProfile
    motor: MotorKinematics
    functional: CaregiverFAQ


class DomainSubIndex(BaseModel):
    """Decomposed risk dimension explaining where cognitive/motor strain is situated."""
    domain_name: str
    risk_level: str  # "LOW", "MILD", "MODERATE", "HIGH"
    normalized_score: float  # 0.0 to 1.0 scale
    additive_attribution: float  # TreeSHAP sum for this domain
    clinical_summary: str


class RiskFlag(BaseModel):
    """Actionable safety or functional deficit trigger."""
    code: str
    severity: str  # "CRITICAL", "WARNING", "INFO"
    feature_name: str
    message: str
    recommended_action: str


class DetectionReport(BaseModel):
    """Structured end-to-end clinical telemetry analysis report."""
    patient_id: str
    timestamp: str
    demographics: dict[str, Any]
    raw_risk_score: float
    demographic_adjustment: float
    calibrated_risk_score: float
    severity_band: str
    domain_sub_indices: dict[str, DomainSubIndex]
    critical_flags: list[RiskFlag]
    top_feature_attributions: list[dict[str, Any]]
    model_runtime: str
