import { useEffect, useState } from 'react';
import { AlarmClock, Check, Clock3, X } from 'lucide-react';

import {
  completeAlarm,
  dismissAlarm,
  fireNextAlarm,
  getAlarmPrefs,
  snoozeAlarm,
} from '../lib/alarms';

import { ensureNotifyPermission } from '../lib/alarms';

import { useAuth } from '../context/AuthContext';

import './AlarmRuntime.css';

const POLL_MS = 15000;

async function postAlarmEvent(session, item, action) {
  if (!session?.householdCode || !item) return;

  try {
    await fetch('/auth-api/alarms/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    // Offline is okay
  }
}

export default function AlarmRuntime() {
  const { session } = useAuth();

  const [active, setActive] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;

      // Don't fire another alarm while one is already visible
      if (active) return;

      // Check whether alarms are enabled
      const prefs = getAlarmPrefs();

      if (!prefs.enabled) return;

      const item = fireNextAlarm();

      if (!item) return;

      setActive(item);

      postAlarmEvent(session, item, 'fired');
    };

    // Check immediately when component starts
    tick();

    // Continue checking every 15 seconds
    const intervalId = setInterval(tick, POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [active, session]);

  /*
   * Notification permission should ideally be requested
   * from a user action rather than automatically.
   *
   * We intentionally don't call ensureNotifyPermission()
   * automatically here.
   */

  if (!active) {
    return null;
  }

  return (
    <div
      className="ss-alarm-overlay"
      role="alertdialog"
      aria-label="Routine alarm"
    >
      <div className="ss-alarm-card">

        <p className="ss-alarm-kicker">
          <AlarmClock size={16} />
          Reminder
        </p>

        <h2>{active.title}</h2>

        <p className="ss-alarm-lead">
          {active.subtitle}
        </p>

        <p className="ss-alarm-time">
          <Clock3 size={16} />
          {active.time}
        </p>

        <div className="ss-alarm-actions">

          {/* DONE */}
          <button
            type="button"
            className="ss-alarm-primary"
            onClick={() => {
              completeAlarm(active.id);

              postAlarmEvent(
                session,
                active,
                'done'
              );

              setActive(null);
            }}
          >
            <Check size={18} />
            Done
          </button>

          {/* SNOOZE */}
          <button
            type="button"
            className="ss-alarm-secondary"
            onClick={() => {
              snoozeAlarm(active.id, 10);

              postAlarmEvent(
                session,
                active,
                'snooze'
              );

              setActive(null);
            }}
          >
            Snooze 10 min
          </button>

          {/* DISMISS */}
          <button
            type="button"
            className="ss-alarm-ghost"
            onClick={() => {
              dismissAlarm(active.id);

              postAlarmEvent(
                session,
                active,
                'dismiss'
              );

              setActive(null);
            }}
          >
            <X size={16} />
            Dismiss
          </button>

        </div>
      </div>
    </div>
  );
}