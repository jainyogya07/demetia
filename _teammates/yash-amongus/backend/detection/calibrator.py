"""
Demographic Normalization & Calibration Layer
Implements offset correction to prevent false positives driven by low formal schooling
or natural non-pathological senescent slowing.
Formula: Adjusted Score = Base - beta_1 * (Education == 0) - beta_2 * max(0, Age - 65)
"""

from __future__ import annotations
from typing import NamedTuple


class CalibrationResult(NamedTuple):
    raw_score: float
    adjustment_offset: float
    calibrated_score: float
    severity_band: str
    education_penalty_mitigated: float
    age_offset_mitigated: float


class DemographicCalibrator:
    def __init__(
        self,
        beta_education_illiterate: float = 0.09,
        beta_education_primary: float = 0.04,
        beta_age_per_year_over_65: float = 0.0035,
    ) -> None:
        """
        Parameters:
        beta_education_illiterate: Offset subtracted if patient has 0 years of formal schooling.
        beta_education_primary: Offset subtracted if patient has 1-5 years of primary schooling.
        beta_age_per_year_over_65: Offset per year above 65 to account for healthy age deceleration.
        """
        self.beta_edu_zero = beta_education_illiterate
        self.beta_edu_primary = beta_education_primary
        self.beta_age = beta_age_per_year_over_65

    def compute_offset(self, age: float, education_years: float) -> tuple[float, float, float]:
        """Returns (total_offset, edu_offset, age_offset)."""
        # Education bias mitigation
        if education_years <= 0.5:
            edu_offset = self.beta_edu_zero
        elif education_years <= 5.0:
            edu_offset = self.beta_edu_primary
        else:
            edu_offset = 0.0

        # Senescent motor/cognitive deceleration mitigation
        age_delta = max(0.0, float(age) - 65.0)
        age_offset = age_delta * self.beta_age

        total_offset = edu_offset + age_offset
        return total_offset, edu_offset, age_offset

    def calibrate(self, raw_score: float, age: float, education_years: float) -> CalibrationResult:
        """Adjusts raw predicted risk score using demographic normalization."""
        total_offset, edu_offset, age_offset = self.compute_offset(age, education_years)
        
        # Apply offset and clamp between [0.0, 1.0]
        calibrated = max(0.0, min(1.0, float(raw_score) - total_offset))
        severity = self.classify_severity(calibrated)

        return CalibrationResult(
            raw_score=round(raw_score, 4),
            adjustment_offset=round(total_offset, 4),
            calibrated_score=round(calibrated, 4),
            severity_band=severity,
            education_penalty_mitigated=round(edu_offset, 4),
            age_offset_mitigated=round(age_offset, 4),
        )

    @staticmethod
    def classify_severity(score: float) -> str:
        if score < 0.25:
            return "NORMAL"
        if score < 0.50:
            return "MILD_COGNITIVE_CONCERN"
        if score < 0.75:
            return "MODERATE_IMPAIRMENT"
        return "SEVERE_IMPAIRMENT"
