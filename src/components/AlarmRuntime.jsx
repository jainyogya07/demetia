import { useEffect, useState } from 'react';
import { AlarmClock, Bell, Check, Clock3, X } from 'lucide-react';
import {
  completeAlarm,
  dismissAlarm,
  ensureNotifyPermission,
  fireNextAlarm,
  getAlarmPrefs,
  setAlarmPrefs,
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
  const [prefs, setPrefs] = useState(getAlarmPrefs);

  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      if (cancelled || active) return;
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

  const enableAlerts = async () => {
    await ensureNotifyPermission();
    const next = setAlarmPrefs({ enabled: true, notify: true, sound: true });
    setPrefs(next);
  };

  if (!session?.verified || session.role !== 'user') {
    return null;
  }

  return (
    <>
      {!prefs.enabled && (
        <button type="button" className="ss-alarm-enable" onClick={enableAlerts}>
          <Bell size={16} />
          Turn on medicine alarms
        </button>
      )}

      {active && (
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
      )}
    </>
  );
}
