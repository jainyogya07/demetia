/**
 * Clinical Assessment & Detection Evaluation Store
 * Manages the 10-Item FAQ (Functional Activities Questionnaire),
 * patient demographics, baseline telemetry, and calls to the
 * cognitive-motor detection engine (/auth-api/detection/evaluate).
 */

export const FAQ_QUESTIONS = [
  {
    id: 'faq_cooking_stove_safety',
    code: 'STOVE_SAFETY',
    domain: 'Daily Independence',
    title: 'Cooking & Stove Safety',
    desc: 'Remembering to turn off gas burners, induction, or water heater after use.',
    icon: 'Flame',
    hazard: 'STOVE_FIRE_HAZARD',
    options: [
      { score: 0, label: 'Normal / Independent', hint: 'Turns off stove promptly' },
      { score: 1, label: 'Occasional hesitation', hint: 'Takes longer, but safe' },
      { score: 2, label: 'Needs reminder / supervision', hint: 'Left burner on 1-2 times' },
      { score: 3, label: 'Dependent / unsafe alone', hint: 'Must not cook unsupervised' },
    ],
  },
  {
    id: 'faq_medication_compliance',
    code: 'MEDICATION_ADHERENCE',
    domain: 'Daily Independence',
    title: 'Medication Adherence',
    desc: 'Taking prescribed doses at the correct time without missing or repeating.',
    icon: 'Pill',
    hazard: 'MEDICATION_NONADHERENCE',
    options: [
      { score: 0, label: 'Independent', hint: 'Takes pills on time' },
      { score: 1, label: 'Occasional delay', hint: 'Needs gentle routine prompt' },
      { score: 2, label: 'Frequently forgets / duplicates', hint: 'Requires direct handover' },
      { score: 3, label: 'Completely dependent', hint: 'Cannot administer safely' },
    ],
  },
  {
    id: 'faq_financial_handling',
    code: 'FINANCIAL_HANDLING',
    domain: 'Executive Function',
    title: 'Money & Small Transactions',
    desc: 'Handling cash, counting change with local vendor, understanding bills.',
    icon: 'Coins',
    options: [
      { score: 0, label: 'Normal', hint: 'Handles money accurately' },
      { score: 1, label: 'Slow with change', hint: 'Checks twice, minor doubt' },
      { score: 2, label: 'Struggles with bills', hint: 'Assistance needed to verify' },
      { score: 3, label: 'Unable to manage cash', hint: 'Risk of financial loss' },
    ],
  },
  {
    id: 'faq_orientation_time_space',
    code: 'SPATIAL_ORIENTATION',
    domain: 'Daily Independence',
    title: 'Orientation to Time & Route',
    desc: 'Awareness of the current day, month, and navigating familiar neighborhood paths.',
    icon: 'Compass',
    hazard: 'DISORIENTATION_WANDERING_RISK',
    options: [
      { score: 0, label: 'Fully oriented', hint: 'Knows paths, day, and time' },
      { score: 1, label: 'Occasional date confusion', hint: 'Clarifies calendar easily' },
      { score: 2, label: 'Loses orientation briefly', hint: 'Hesitates on known routes' },
      { score: 3, label: 'High wandering risk', hint: 'Cannot navigate outside safely' },
    ],
  },
  {
    id: 'faq_transport_navigation',
    code: 'TRANSPORT_MOBILITY',
    domain: 'Daily Independence',
    title: 'Travel & Transportation',
    desc: 'Traveling independently via local rickshaw/bus or walking to familiar market.',
    icon: 'Bus',
    options: [
      { score: 0, label: 'Independent', hint: 'Travels alone comfortably' },
      { score: 1, label: 'Prefers company', hint: 'Slightly anxious traveling alone' },
      { score: 2, label: 'Needs escort', hint: 'Escort required for public travel' },
      { score: 3, label: 'Confined to home', hint: 'Cannot travel without assistance' },
    ],
  },
  {
    id: 'faq_telephone_communication',
    code: 'PHONE_USAGE',
    domain: 'Daily Independence',
    title: 'Using the Phone',
    desc: 'Answering incoming calls, dialing familiar family numbers or doctor.',
    icon: 'Phone',
    options: [
      { score: 0, label: 'Independent', hint: 'Answers and dials easily' },
      { score: 1, label: 'Answers only', hint: 'Can talk but struggles dialing' },
      { score: 2, label: 'Needs help with screen', hint: 'Needs caregiver to connect' },
      { score: 3, label: 'Unable to use phone', hint: 'No phone interaction' },
    ],
  },
  {
    id: 'faq_remembering_appointments',
    code: 'APPOINTMENT_RECALL',
    domain: 'Executive Function',
    title: 'Remembering Appointments & Events',
    desc: 'Recalling upcoming doctor visits, family events, or community festivals.',
    icon: 'Calendar',
    options: [
      { score: 0, label: 'Remembers reliably', hint: 'Recalls schedule easily' },
      { score: 1, label: 'Recalls when reminded', hint: 'Prompt aids memory' },
      { score: 2, label: 'Frequent memory slips', hint: 'Forgot recent appointments' },
      { score: 3, label: 'No recall of plans', hint: 'Completely reliant on caregiver' },
    ],
  },
  {
    id: 'faq_personal_grooming',
    code: 'PERSONAL_GROOMING',
    domain: 'Daily Independence',
    title: 'Bathing, Dressing & Hygiene',
    desc: 'Bathing, washing hands, putting on clean clothes, combing hair.',
    icon: 'Sparkles',
    options: [
      { score: 0, label: 'Independent', hint: 'Full self-care maintained' },
      { score: 1, label: 'Minor slowing', hint: 'Takes more time but thorough' },
      { score: 2, label: 'Needs physical assistance', hint: 'Requires help with buttons/bath' },
      { score: 3, label: 'Completely dependent', hint: 'Full caregiver care required' },
    ],
  },
  {
    id: 'faq_meal_preparation',
    code: 'MEAL_PREPARATION',
    domain: 'Daily Independence',
    title: 'Meal Preparation & Food Safety',
    desc: 'Preparing tea, peeling fruit, or finding food safely in the kitchen.',
    icon: 'Utensils',
    options: [
      { score: 0, label: 'Independent', hint: 'Prepares simple snacks/tea' },
      { score: 1, label: 'Simplified meals only', hint: 'Avoids complex cooking' },
      { score: 2, label: 'Needs ingredients laid out', hint: 'Requires prep assistance' },
      { score: 3, label: 'Cannot prepare food', hint: 'Meals must be served' },
    ],
  },
  {
    id: 'faq_home_safety_awareness',
    code: 'HOME_SECURITY',
    domain: 'Daily Independence',
    title: 'Home Safety & Locking Doors',
    desc: 'Locking courtyard gate/front door at night, managing house keys.',
    icon: 'KeyRound',
    options: [
      { score: 0, label: 'Alert & Secure', hint: 'Checks locks and keys reliably' },
      { score: 1, label: 'Occasionally forgets key', hint: 'Needs brief reminder' },
      { score: 2, label: 'Leaves doors unlocked', hint: 'Caregiver double-checks nightly' },
      { score: 3, label: 'Unaware of hazards', hint: 'High safety risk' },
    ],
  },
];

export const DEMO_PATIENTS = {
  aita: {
    id: 'aita',
    name: 'Latveria Devi (Aita)',
    age: 78.0,
    education_years: 0.0,
    education_label: 'No Formal Schooling / Illiterate',
    caregiver: 'Rina Devi (Daughter)',
    village: 'Jorhat, Assam',
    initialFunctional: {
      faq_medication_compliance: 0,
      faq_cooking_stove_safety: 0,
      faq_financial_handling: 0,
      faq_orientation_time_space: 0,
      faq_transport_navigation: 0,
      faq_telephone_communication: 0,
      faq_remembering_appointments: 0,
      faq_personal_grooming: 0,
      faq_meal_preparation: 0,
      faq_home_safety_awareness: 0,
    },
    motorBaseline: {
      tap_latency_mean_ms: 315.0,
      tap_latency_std_ms: 36.0,
      sampling_interval_jitter_ms: 1.8,
      finger_lift_velocity_px_ms: 2.4,
      stroke_curvature_index: 1.35,
      stroke_hesitation_count: 2,
    },
  },
  binod: {
    id: 'binod',
    name: 'Binod Kalita',
    age: 81.0,
    education_years: 6.0,
    education_label: 'Primary Schooling (Class 6)',
    caregiver: 'Doom Kalita (Son)',
    village: 'Golaghat, Assam',
    initialFunctional: {
      faq_medication_compliance: 1,
      faq_cooking_stove_safety: 1,
      faq_financial_handling: 1,
      faq_orientation_time_space: 1,
      faq_transport_navigation: 1,
      faq_telephone_communication: 0,
      faq_remembering_appointments: 1,
      faq_personal_grooming: 0,
      faq_meal_preparation: 1,
      faq_home_safety_awareness: 1,
    },
    motorBaseline: {
      tap_latency_mean_ms: 360.0,
      tap_latency_std_ms: 65.0,
      sampling_interval_jitter_ms: 2.8,
      finger_lift_velocity_px_ms: 1.9,
      stroke_curvature_index: 1.6,
      stroke_hesitation_count: 5,
    },
  },
  sarala_mci: {
    id: 'sarala_mci',
    name: 'Sarala Barua (Former Teacher)',
    age: 68.0,
    education_years: 16.0,
    education_label: 'Post-Graduate (16 Years)',
    caregiver: 'Anil Barua (Husband)',
    village: 'Guwahati, Assam',
    initialFunctional: {
      faq_medication_compliance: 1,
      faq_cooking_stove_safety: 2, // Left burner unattended twice
      faq_financial_handling: 1,
      faq_orientation_time_space: 0,
      faq_transport_navigation: 0,
      faq_telephone_communication: 0,
      faq_remembering_appointments: 2,
      faq_personal_grooming: 0,
      faq_meal_preparation: 1,
      faq_home_safety_awareness: 1,
    },
    motorBaseline: {
      tap_latency_mean_ms: 395.0,
      tap_latency_std_ms: 78.0,
      sampling_interval_jitter_ms: 3.4,
      finger_lift_velocity_px_ms: 1.7,
      stroke_curvature_index: 1.85,
      stroke_hesitation_count: 8,
    },
  },
};

const STORAGE_KEY_PREFIX = 'ss-assessment-v1-';
const LATEST_EVAL_KEY_PREFIX = 'ss-latest-eval-v1-';
const PATIENT_CHECKIN_KEY_PREFIX = 'ss-patient-checkin-v1-';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function getAssessmentForPatient(patientId = 'aita') {
  const demo = DEMO_PATIENTS[patientId] || DEMO_PATIENTS.aita;
  const saved = readJson(`${STORAGE_KEY_PREFIX}${patientId}`, null);
  if (saved) return saved;

  const initial = {
    patientId: demo.id,
    patientName: demo.name,
    age: demo.age,
    education_years: demo.education_years,
    education_label: demo.education_label,
    functional: { ...demo.initialFunctional },
    motor: { ...demo.motorBaseline },
    lastUpdated: new Date().toISOString(),
  };
  writeJson(`${STORAGE_KEY_PREFIX}${patientId}`, initial);
  return initial;
}

export function saveAssessmentForPatient(patientId, patch) {
  const current = getAssessmentForPatient(patientId);
  const updated = {
    ...current,
    ...patch,
    functional: { ...(current.functional || {}), ...(patch.functional || {}) },
    motor: { ...(current.motor || {}), ...(patch.motor || {}) },
    lastUpdated: new Date().toISOString(),
  };
  writeJson(`${STORAGE_KEY_PREFIX}${patientId}`, updated);
  notifyAssessmentChange(patientId);
  return updated;
}

export function getLatestEvaluation(patientId = 'aita') {
  return readJson(`${LATEST_EVAL_KEY_PREFIX}${patientId}`, null);
}

export function saveLatestEvaluation(patientId, report) {
  writeJson(`${LATEST_EVAL_KEY_PREFIX}${patientId}`, report);
  notifyAssessmentChange(patientId);
}

export function getPatientDailyCheckin(patientId = 'aita') {
  return readJson(`${PATIENT_CHECKIN_KEY_PREFIX}${patientId}`, {
    date: new Date().toISOString().slice(0, 10),
    medsTaken: true,
    breakfastComfort: 'good',
    walkDone: true,
    moodScore: 'calm',
    completedAt: null,
  });
}

export function savePatientDailyCheckin(patientId, answers) {
  const row = {
    ...answers,
    completedAt: new Date().toISOString(),
    date: new Date().toISOString().slice(0, 10),
  };
  writeJson(`${PATIENT_CHECKIN_KEY_PREFIX}${patientId}`, row);
  notifyAssessmentChange(patientId);
  return row;
}

/**
 * Calls FastAPI detection endpoint with client-side fallback
 */
export async function evaluateTelemetry({ patient_id, demographics, motor, functional }) {
  const payload = {
    patient_id: patient_id || 'patient_local',
    demographics: {
      age: Number(demographics.age || 75.0),
      education_years: Number(demographics.education_years || 0.0),
    },
    motor: {
      tap_latency_mean_ms: Number(motor.tap_latency_mean_ms || 280.0),
      tap_latency_std_ms: Number(motor.tap_latency_std_ms || 35.0),
      sampling_interval_jitter_ms: Number(motor.sampling_interval_jitter_ms || 2.0),
      finger_lift_velocity_px_ms: Number(motor.finger_lift_velocity_px_ms || 2.2),
      stroke_curvature_index: Number(motor.stroke_curvature_index || 1.3),
      stroke_hesitation_count: Number(motor.stroke_hesitation_count || 1),
    },
    functional: {
      faq_medication_compliance: Number(functional.faq_medication_compliance || 0),
      faq_cooking_stove_safety: Number(functional.faq_cooking_stove_safety || 0),
      faq_financial_handling: Number(functional.faq_financial_handling || 0),
      faq_orientation_time_space: Number(functional.faq_orientation_time_space || 0),
      faq_transport_navigation: Number(functional.faq_transport_navigation || 0),
      faq_telephone_communication: Number(functional.faq_telephone_communication || 0),
      faq_remembering_appointments: Number(functional.faq_remembering_appointments || 0),
      faq_personal_grooming: Number(functional.faq_personal_grooming || 0),
      faq_meal_preparation: Number(functional.faq_meal_preparation || 0),
      faq_home_safety_awareness: Number(functional.faq_home_safety_awareness || 0),
    },
  };

  try {
    const res = await fetch('/auth-api/detection/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      saveLatestEvaluation(patient_id, data);
      return data;
    }
  } catch (err) {
    console.warn('[detection] Backend evaluate unreachable, calculating fallback:', err);
  }

  // Client-side fallback calculation matching calibrator logic
  const faqSum = Object.values(payload.functional).reduce((a, b) => a + b, 0);
  const rawScore = Math.min(1.0, Math.max(0.0, (faqSum / 30.0) * 0.7 + (payload.motor.tap_latency_mean_ms / 600.0) * 0.3));
  
  // Demographic bias calculation
  let eduOffset = 0.0;
  if (payload.demographics.education_years <= 0.5) eduOffset = 0.09;
  else if (payload.demographics.education_years <= 5.0) eduOffset = 0.04;
  const ageOffset = Math.max(0.0, (payload.demographics.age - 65.0) * 0.0035);
  const totalOffset = eduOffset + ageOffset;
  const calibrated = Math.max(0.0, Math.min(1.0, rawScore - totalOffset));

  let band = 'NORMAL';
  if (calibrated >= 0.75) band = 'SEVERE_IMPAIRMENT';
  else if (calibrated >= 0.50) band = 'MODERATE_IMPAIRMENT';
  else if (calibrated >= 0.25) band = 'MILD_COGNITIVE_CONCERN';

  const criticalFlags = [];
  if (payload.functional.faq_cooking_stove_safety >= 2) {
    criticalFlags.push({
      code: 'STOVE_FIRE_HAZARD',
      severity: 'CRITICAL',
      feature_name: 'faq_cooking_stove_safety',
      message: 'Frequent stove or thermal appliance unattendance observed.',
      recommended_action: 'Install automated kitchen shut-off sensor and accompany meal prep.',
    });
  }
  if (payload.functional.faq_medication_compliance >= 2) {
    criticalFlags.push({
      code: 'MEDICATION_NONADHERENCE',
      severity: 'CRITICAL',
      feature_name: 'faq_medication_compliance',
      message: 'Missed or duplicate prescription doses observed.',
      recommended_action: 'Deploy locked daily pill organizer / caregiver verified handover.',
    });
  }
  if (payload.functional.faq_orientation_time_space >= 2) {
    criticalFlags.push({
      code: 'DISORIENTATION_WANDERING_RISK',
      severity: 'CRITICAL',
      feature_name: 'faq_orientation_time_space',
      message: 'Confusion navigating familiar routes or date disorientation.',
      recommended_action: 'Activate GPS geofencing perimeter and notify care circle.',
    });
  }

  const fallbackReport = {
    patient_id,
    timestamp: new Date().toISOString(),
    demographics: {
      age: payload.demographics.age,
      education_years: payload.demographics.education_years,
      education_status: payload.demographics.education_years <= 0.5 ? 'No Formal Schooling / Illiterate' : `${payload.demographics.education_years} Years`,
    },
    raw_risk_score: Number(rawScore.toFixed(4)),
    demographic_adjustment: Number(totalOffset.toFixed(4)),
    calibrated_risk_score: Number(calibrated.toFixed(4)),
    severity_band: band,
    domain_sub_indices: {
      'Executive Function': {
        domain_name: 'Executive Function',
        risk_level: calibrated > 0.4 ? 'MILD' : 'LOW',
        normalized_score: Number((calibrated * 0.9).toFixed(2)),
        additive_attribution: 0.024,
        clinical_summary: 'Evaluation of financial handling and motor trajectory planning.',
      },
      'Daily Independence': {
        domain_name: 'Daily Independence',
        risk_level: calibrated > 0.5 ? 'MODERATE' : 'LOW',
        normalized_score: Number((calibrated * 1.1).toFixed(2)),
        additive_attribution: 0.048,
        clinical_summary: 'Observation of stove, navigation, and medication safety.',
      },
      'Motor Speed': {
        domain_name: 'Motor Speed',
        risk_level: payload.motor.tap_latency_mean_ms > 350 ? 'MILD' : 'LOW',
        normalized_score: Number((payload.motor.tap_latency_mean_ms / 600).toFixed(2)),
        additive_attribution: 0.012,
        clinical_summary: 'Touch reaction latency and fine-motor rhythm variability.',
      },
    },
    critical_flags: criticalFlags,
    top_feature_attributions: [
      { feature: 'faq_orientation_time_space', value: payload.functional.faq_orientation_time_space, attribution: 0.035, impact: 'Increases Risk' },
      { feature: 'faq_cooking_stove_safety', value: payload.functional.faq_cooking_stove_safety, attribution: 0.028, impact: 'Increases Risk' },
      { feature: 'tap_latency_mean_ms', value: payload.motor.tap_latency_mean_ms, attribution: 0.015, impact: 'Increases Risk' },
    ],
    model_runtime: 'Client-side fallback',
  };

  saveLatestEvaluation(patient_id, fallbackReport);
  return fallbackReport;
}

function notifyAssessmentChange(patientId) {
  window.dispatchEvent(new CustomEvent('ss-assessment-updated', { detail: { patientId } }));
}

export function subscribeAssessmentChange(onChange) {
  const handler = (e) => onChange(e.detail);
  window.addEventListener('ss-assessment-updated', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('ss-assessment-updated', handler);
    window.removeEventListener('storage', handler);
  };
}
