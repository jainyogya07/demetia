// @ts-nocheck — leftover JS-shaped module; runtime unchanged
import { isSupabaseConfigured, supabase } from './supabase';

function ageFromBirthDate(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const month = today.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
}

async function currentUser() {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user || null;
}

/** Loads the most recent ADL snapshot for the caregiver's linked patient. */
export async function loadCareAssessment() {
  const user = await currentUser();
  if (!user) return null;
  const { data: links, error: linkError } = await supabase
    .from('care_relationships')
    .select('patient_id, relationship_role')
    .eq('member_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: true })
    .limit(1);
  if (linkError) throw linkError;
  const link = links?.[0];
  if (!link) return null;

  const [profileResult, assessmentResult] = await Promise.all([
    supabase.from('profiles').select('id, display_name, birth_date').eq('id', link.patient_id).single(),
    supabase.from('adl_assessments')
      .select('total_score, answers, notes, created_at')
      .eq('patient_id', link.patient_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);
  if (profileResult.error) throw profileResult.error;
  if (assessmentResult.error) throw assessmentResult.error;
  const saved = assessmentResult.data;
  return {
    patientId: link.patient_id,
    relationshipRole: link.relationship_role,
    patient: profileResult.data,
    age: ageFromBirthDate(profileResult.data.birth_date),
    functional: saved?.answers?.functional || {},
    motor: saved?.answers?.motor || {},
    memoryQuiz: saved?.answers?.memoryQuiz || null,
    memoryJourney: saved?.answers?.memoryJourney || null,
    latestEvaluation: saved?.answers?.latestEvaluation || null,
    notes: saved?.notes || '',
    savedAt: saved?.created_at || null,
  };
}

/** Appends an ADL snapshot; history is retained for clinical review rather than overwritten. */
export async function saveCareAssessment({ patientId, assessment, latestEvaluation = null, notes = '' }) {
  const user = await currentUser();
  if (!user) throw new Error('Sign in before saving an assessment.');
  const functional = assessment.functional || {};
  const totalScore = Object.values(functional).reduce((sum, value) => sum + Math.max(0, Number(value) || 0), 0);
  const { data, error } = await supabase
    .from('adl_assessments')
    .insert({
      patient_id: patientId,
      recorded_by: user.id,
      total_score: totalScore,
      answers: {
        functional,
        motor: assessment.motor || {},
        memoryQuiz: assessment.memoryQuiz || null,
        memoryJourney: assessment.memoryJourney || null,
        latestEvaluation: latestEvaluation || assessment.latestEvaluation || null,
      },
      notes,
    })
    .select('id, total_score, created_at')
    .single();
  if (error) throw error;
  return data;
}
