/** Smriti Saarthi alarm system.
 *
 * Browser alarms are retained for the web app.
 * Native Android notifications are additionally scheduled
 * through Capacitor when running as an Android app.
 */

import {
  getRoutineItems,
  markRoutineDone,
  pingLive,
} from './liveState';

import {
  setupNativeNotifications,
  scheduleAllNativeAlarms,
  scheduleNativeAlarm,
  cancelNativeAlarm,
  cancelAllNativeAlarms,
} from './nativeNotification';

const FIRED_KEY = 'ss-alarm-fired-v1';
const PREFS_KEY = 'ss-alarm-prefs-v1';

function dayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');

  return `${y}-${m}-${d}`;
}

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

export function getAlarmPrefs() {
  const row = readJson(PREFS_KEY, {});

  return {
    enabled: row.enabled === true,
    sound: row.sound !== false,
    notify: row.notify !== false,
  };
}

export async function setAlarmPrefs(patch) {
  const next = {
    ...getAlarmPrefs(),
    ...patch,
  };

  writeJson(PREFS_KEY, next);

  if (next.enabled) {
    await setupNativeNotifications();

    const items = getRoutineItems();

    await scheduleAllNativeAlarms(items);
  } else {
    await cancelAllNativeAlarms();
  }

  return next;
}

function firedMap() {
  return readJson(FIRED_KEY, {});
}

function markFired(id, now = new Date()) {
  const all = firedMap();
  const day = dayKey(now);

  writeJson(FIRED_KEY, {
    ...all,
    [day]: {
      ...(all[day] || {}),
      [id]: now.toISOString(),
    },
  });
}

function wasFired(id, now = new Date()) {
  return Boolean(
    firedMap()[dayKey(now)]?.[id]
  );
}

export function clearAlarmFired(id, now = new Date()) {
  const all = firedMap();
  const day = dayKey(now);

  const row = {
    ...(all[day] || {}),
  };

  delete row[id];

  writeJson(FIRED_KEY, {
    ...all,
    [day]: row,
  });
}

/**
 * Due items not yet completed / dismissed,
 * within 90 minutes of schedule.
 */
export function getDueAlarms(now = new Date()) {
  const prefs = getAlarmPrefs();

  if (!prefs.enabled) return [];

  return getRoutineItems(now).filter((item) => {
    if (item.completed || item.status !== 'due') {
      return false;
    }

    if (wasFired(item.id, now)) {
      return false;
    }

    if (isSnoozing(item.id)) {
      return false;
    }

    const ageMin =
      (now - item.dueAt) / 60000;

    return ageMin >= 0 && ageMin <= 90;
  });
}

let audioCtx;

function beep() {
  try {
    const Ctx =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!Ctx) return;

    audioCtx = audioCtx || new Ctx();

    const osc =
      audioCtx.createOscillator();

    const gain =
      audioCtx.createGain();

    osc.type = 'sine';

    osc.frequency.value = 880;

    gain.gain.value = 0.0001;

    osc.connect(gain);

    gain.connect(audioCtx.destination);

    const t = audioCtx.currentTime;

    gain.gain.exponentialRampToValueAtTime(
      0.18,
      t + 0.02
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      t + 0.55
    );

    osc.start(t);

    osc.stop(t + 0.6);
  } catch {
    /* ignore */
  }
}

export async function ensureNotifyPermission() {
  // Android/native
  try {
    const native = await import('./nativeNotification');

    if (native?.setupNativeNotifications) {
      await native.setupNativeNotifications();
    }
  } catch {
    // Continue with browser notifications.
  }

  // Browser
  if (!('Notification' in window)) {
    return 'unsupported';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

function pushNotify(item) {
  const prefs = getAlarmPrefs();

  if (
    !prefs.notify ||
    !('Notification' in window) ||
    Notification.permission !== 'granted'
  ) {
    return;
  }

  try {
    const n = new Notification(
      item.title,
      {
        body: `${item.time} — ${
          item.subtitle ||
          'Smriti Saarthi reminder'
        }`,
        tag: `ss-alarm-${item.id}`,
        renotify: true,
      }
    );

    setTimeout(() => {
      n.close();
    }, 20000);
  } catch {
    /* ignore */
  }
}

/**
 * Fire the next browser alarm.
 */
export function fireNextAlarm(
  now = new Date()
) {
  const due = getDueAlarms(now);

  if (!due.length) {
    return null;
  }

  const item = due[0];

  markFired(item.id, now);

  const prefs = getAlarmPrefs();

  if (prefs.sound) {
    beep();
  }

  pushNotify(item);

  return item;
}

/**
 * Schedule native Android alarms for all routines.
 */
export async function syncNativeAlarms() {
  try {
    const prefs = getAlarmPrefs();

    if (!prefs.enabled) {
      await cancelAllNativeAlarms();
      return;
    }

    const items = getRoutineItems();

    await setupNativeNotifications();

    await scheduleAllNativeAlarms(items);
  } catch (error) {
    console.error(
      'Native alarm synchronization failed:',
      error
    );
  }
}

/**
 * Snooze browser alarm.
 */
export function snoozeAlarm(
  id,
  minutes = 10
) {
  clearAlarmFired(id);

  writeJson(
    `ss-alarm-snooze-${id}`,
    Date.now() +
      minutes * 60 * 1000
  );
}

/**
 * Check whether an alarm is snoozed.
 */
export function isSnoozing(id) {
  const until = readJson(
    `ss-alarm-snooze-${id}`,
    0
  );

  return (
    typeof until === 'number' &&
    until > Date.now()
  );
}

/**
 * Complete alarm.
 */
export function completeAlarm(id) {
  markRoutineDone(id);

  markFired(id);

  try {
    localStorage.removeItem(
      `ss-alarm-snooze-${id}`
    );
  } catch {
    /* ignore */
  }

  pingLive();
}

/**
 * Dismiss alarm.
 */
export function dismissAlarm(id) {
  markFired(id);

  pingLive();
}

/**
 * Cancel a native alarm when necessary.
 */
export async function removeNativeAlarm(id) {
  await cancelNativeAlarm(id);
}