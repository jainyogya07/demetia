import { useEffect, useState } from 'react';
import { AlarmClock, Check, Clock3, X } from 'lucide-react';
import {
  completeAlarm,
  dismissAlarm,
  fireNextAlarm,
  getAlarmPrefs,
  snoozeAlarm,
} from '../lib/alarms';
import { useAuth } from '../context/AuthContext';
import './AlarmRuntime.css';

const POLL_MS = 15000;

async function postAlarmEvent(session, item, action) {
  if (!session?.householdCode || !item) return;
  try {
    await fetch('/auth-api/alarms/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        householdCode: session.householdCode,
        phone: session.phone,
        alarmId: item.id,
        title: item.title,
        action,
        at: new Date().toISOString(),
      }),
    });
  } catch {
    /* offline ok */
  }
}

export default function AlarmRuntime() {
  const { session } = useAuth();
  const [active, setActive] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      if (cancelled || active) return;
      if (!getAlarmPrefs().enabled) return;
      const item = fireNextAlarm();
      if (item) {
        setActive(item);
        postAlarmEvent(session, item, 'fired');
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
              postAlarmEvent(session, active, 'done');
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
              postAlarmEvent(session, active, 'snooze');
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
              postAlarmEvent(session, active, 'dismiss');
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
