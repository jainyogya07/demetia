/**
 * Upcoming Alarm & Routine Reminder Watcher
 * Proactively scans routine items scheduled in the next 30 minutes,
 * and adds upcoming reminder notifications so caregivers & patients are alerted ahead of time.
 */

import { getRoutineItems, todayKey } from './liveState';
import { addNotification } from './notificationStore';

const REMINDED_KEY = 'ss-upcoming-reminded-v1';

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

export function checkUpcomingAlarms(now = new Date()) {
  const day = todayKey(now);
  const remindedMap = readJson(REMINDED_KEY, {});
  const todayReminded = remindedMap[day] || {};

  const items = getRoutineItems(now);
  const nextReminded = { ...todayReminded };
  let notifiedCount = 0;

  for (const item of items) {
    if (item.completed) continue;
    if (todayReminded[item.id]) continue;

    const diffMinutes = (item.dueAt.getTime() - now.getTime()) / 60000;

    // Check if the alarm is scheduled in the next 30 minutes (and not already past)
    if (diffMinutes > 0 && diffMinutes <= 30) {
      const roundedMins = Math.max(1, Math.round(diffMinutes));
      nextReminded[item.id] = true;
      notifiedCount += 1;

      addNotification({
        type: 'alarm_upcoming',
        title: 'Upcoming Routine Reminder',
        message: `${item.title} is due in ${roundedMins} minutes (${item.time}).`,
        priority: 'high',
        actionUrl: '/caregiver/routine',
        actionLabel: 'View Routine',
        meta: { itemId: item.id, scheduledTime: item.time },
      });
    }
  }

  if (notifiedCount > 0) {
    writeJson(REMINDED_KEY, { ...remindedMap, [day]: nextReminded });
  }

  return notifiedCount;
}

/**
 * Starts a recurring check interval for upcoming alarms (every 30 seconds).
 */
export function startUpcomingAlarmWatcher() {
  if (typeof window === 'undefined') return () => {};

  // Check immediately on mount
  checkUpcomingAlarms();

  const intervalId = window.setInterval(() => {
    checkUpcomingAlarms();
  }, 30000);

  return () => window.clearInterval(intervalId);
}
