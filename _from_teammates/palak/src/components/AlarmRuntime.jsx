import { useEffect, useState } from 'react';
import { AlarmClock, Check, Clock3, X } from 'lucide-react';
import {
  completeAlarm,
  dismissAlarm,
  fireNextAlarm,
  getAlarmPrefs,
  snoozeAlarm,
} from '../lib/alarms';
import { hydrateRoutineBackend } from '../lib/liveState';
import { recordSupabaseRoutineEvent } from '../lib/routinesApi';
import { useAuth } from '../context/AuthContext';
import './AlarmRuntime.css';

const POLL_MS = 15000;

async function postAlarmEvent(item, action) {
  if (!item || action === 'done') return;
  try {
    const dbAction = action === 'snooze' ? 'snoozed' : action === 'dismiss' ? 'dismissed' : action;
    await recordSupabaseRoutineEvent(item.id, dbAction, { title: item.title });
  } catch {
    /* offline ok */
  }
}

export default function AlarmRuntime() {
  const { session } = useAuth();
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (session?.id) hydrateRoutineBackend();
  }, [session?.id]);

  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      if (cancelled || active) return;
      if (!getAlarmPrefs().enabled) return;
      const item = fireNextAlarm();
      if (item) {
        setActive(item);
        postAlarmEvent(item, 'fired');
      }
    };
    tick();
    const id = setInterval(tick, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [active, session]);

  if (!active) return null;

  return (
    <div className="ss-alarm-overlay" role="alertdialog" aria-label="Routine alarm">
      <div className="ss-alarm-card">
        <p className="ss-alarm-kicker"><AlarmClock size={16} /> Reminder</p>
        <h2>{active.title}</h2>
        <p className="ss-alarm-lead">{active.subtitle}</p>
        <p className="ss-alarm-time"><Clock3 size={16} /> {active.time}</p>
        <div className="ss-alarm-actions">
          <button
            type="button"
            className="ss-alarm-primary"
            onClick={() => {
              completeAlarm(active.id);
              postAlarmEvent(active, 'done');
              setActive(null);
            }}
          >
            <Check size={18} /> Done
          </button>
          <button
            type="button"
            className="ss-alarm-secondary"
            onClick={() => {
              snoozeAlarm(active.id, 10);
              postAlarmEvent(active, 'snooze');
              setActive(null);
            }}
          >
            Snooze 10 min
          </button>
          <button
            type="button"
            className="ss-alarm-ghost"
            onClick={() => {
              dismissAlarm(active.id);
              postAlarmEvent(active, 'dismiss');
              setActive(null);
            }}
          >
            <X size={16} /> Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
