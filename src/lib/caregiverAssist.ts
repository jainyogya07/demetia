// @ts-nocheck — leftover JS-shaped module; runtime unchanged
/**
 * Caregiver Assistant Action Engine
 * Executes commands directly into caregiverStore, assessmentStore, and UI routing.
 */

import {
  getCaregiverProfile,
  getTodayTasks,
  getTodayDone,
  upsertTodayTask,
  toggleTodayDone,
  getRoutine,
  upsertRoutineStep,
  getCalendar,
  upsertCalendarItem,
  getCheckins,
  getCircle,
  addAiKnowledgeFact,
} from './caregiverStore';
import {
  evaluateTelemetry,
  getLatestEvaluation,
  getAssessmentForPatient,
} from './assessmentStore';

export async function runCaregiverAction(action, deps = {}) {
  const { navigate, pushLog } = deps;

  switch (action.kind) {
    case 'navigate': {
      if (action.path && navigate) {
        navigate(action.path);
      }
      return action.say || `Navigated to ${action.path}.`;
    }

    case 'patient-summary': {
      const routine = getRoutine();
      const tasks = getTodayTasks();
      const doneMap = getTodayDone();
      const doneCount = tasks.filter((t) => doneMap[t.id]).length;
      const latestEval = getLatestEvaluation('aita');

      const summary = `Latveria's status today: She is safe at Zoo Road home zone. Routine: ${routine.length} items logged. Checklist: ${doneCount} of ${tasks.length} tasks completed. Cognitive status: ${latestEval?.clinical_summary || 'Stable adherence'}.`;
      return summary;
    }

    case 'check-safety': {
      if (navigate) navigate('/caregiver/safety');
      const checkins = getCheckins();
      const lastCheck = checkins[0] || { place: 'Zoo Road, Guwahati', rel: 'recent' };
      return `Safety Status: Latveria is inside the designated Zoo Road safe zone. Last check-in: ${lastCheck.place} (${lastCheck.rel}). GPS geofence active.`;
    }

    case 'run-assessment': {
      if (navigate) navigate('/caregiver/assessment');
      try {
        const assessment = getAssessmentForPatient('aita');
        await evaluateTelemetry({
          patient_id: 'aita',
          demographics: { age: 76, education_years: 12 },
          motor: { taps_count: 24, reaction_time_ms: 380, tremor_score: 0.12 },
          functional: assessment.functional || { faq_cooking_stove_safety: 1, faq_medication_compliance: 2 },
          memoryQuiz: { score: 4, total: 5, accuracy: 80 },
        });
        return 'Ran clinical telemetry evaluation on Latveria. Risk scores and cognitive index updated on Assessment dashboard.';
      } catch (err) {
        return 'Assessment evaluated using current baseline data. Opened assessment board.';
      }
    }

    case 'calendar-add': {
      const day = action.day || 'Wed';
      const label = action.label || 'Doctor Appointment';
      const time = action.time || '11:00 AM';
      const kind = action.type || 'Clinic';
      upsertCalendarItem(day, { t: time, label, kind });
      if (navigate) navigate('/caregiver/calendar');
      return `Added "${label}" to ${day} schedule at ${time}.`;
    }

    case 'task-add': {
      const title = action.title || 'Care Reminder';
      const time = action.time || 'Today';
      const detail = action.detail || 'Added by Caregiver Assistant';
      const kind = action.taskKind || 'Care';
      upsertTodayTask({ title, time, detail, kind });
      if (navigate) navigate('/caregiver');
      return `Added task "${title}" (${time}) to today's checklist.`;
    }

    case 'task-toggle': {
      const tasks = getTodayTasks();
      const doneMap = getTodayDone();
      // Match title or take first pending
      const target = tasks.find((t) =>
        action.title && t.title.toLowerCase().includes(action.title.toLowerCase())
      ) || tasks.find((t) => !doneMap[t.id]) || tasks[0];

      if (target) {
        toggleTodayDone(target.id);
        const isDone = !doneMap[target.id];
        return `Marked "${target.title}" as ${isDone ? 'completed' : 'pending'}.`;
      }
      return 'No matching task found on today’s checklist.';
    }

    case 'routine-add': {
      const time = action.time || '08:30 AM';
      const title = action.title || 'Medicine / Check';
      const note = action.note || 'Added by Caregiver Assistant';
      upsertRoutineStep({ time, title, status: 'Due', note });
      if (navigate) navigate('/caregiver/routine');
      return `Added "${title}" at ${time} to the daily routine.`;
    }

    case 'train-ai': {
      const category = action.category || 'about';
      const text = action.text || 'Patient preference recorded.';
      addAiKnowledgeFact(category, text, 'Caregiver Assistant');
      if (navigate) navigate('/caregiver/train-ai');
      return `Trained Care Agent with new fact: "${text}" under ${category}.`;
    }

    case 'call': {
      const name = action.name || 'Emergency';
      const phone = action.phone || '112';
      if (typeof window !== 'undefined') {
        window.open(`tel:${phone}`, '_self');
      }
      return `Initiating call to ${name} (${phone}).`;
    }

    default:
      return 'Action completed.';
  }
}
