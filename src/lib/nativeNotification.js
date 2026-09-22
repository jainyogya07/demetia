import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const CHANNEL_ID = 'smriti-saarthi-reminders';
const EMERGENCY_CHANNEL_ID = 'smriti-saarthi-emergency';

const ALARM_IDS = {
  'med-am': 730,
  water: 900,
  brain: 1100,
  lunch: 1300,
  walk: 1630,
  'med-pm': 2030,
};

function isNative() {
  return Capacitor.isNativePlatform();
}

function getNotificationId(id) {
  return ALARM_IDS[id] || Math.floor(Math.random() * 100000);
}

export async function setupNativeNotifications() {
  if (!isNative()) {
    return { supported: false };
  }

  try {
    await LocalNotifications.createChannel({
      id: CHANNEL_ID,
      name: 'Smriti Saarthi Reminders',
      description: 'Daily routine reminders',
      importance: 5,
      visibility: 1,
      sound: 'default',
      vibration: true,
    });

    await LocalNotifications.createChannel({
      id: EMERGENCY_CHANNEL_ID,
      name: 'Smriti Saarthi Emergency',
      description: 'Emergency and SOS alerts',
      importance: 5,
      visibility: 1,
      sound: 'default',
      vibration: true,
    });

    const permission = await LocalNotifications.checkPermissions();

    if (permission.display !== 'granted') {
      await LocalNotifications.requestPermissions();
    }

    return { supported: true };
  } catch (error) {
    console.error('Native notification setup failed:', error);
    return { supported: false, error };
  }
}

/**
 * Schedule one daily routine reminder.
 */
export async function scheduleNativeAlarm(item) {
  if (!isNative() || !item) return;

  try {
    const id = getNotificationId(item.id);

    const now = new Date();

    let at = new Date(now);
    at.setHours(item.hour, item.minute, 0, 0);

    // If today's time has already passed,
    // schedule the first notification for tomorrow.
    if (at <= now) {
      at.setDate(at.getDate() + 1);
    }

    await LocalNotifications.cancel({
      notifications: [{ id }],
    });

    await LocalNotifications.schedule({
      notifications: [
        {
          id,
          title: `🔔 ${item.title}`,
          body: `${item.time} — ${item.subtitle || 'Smriti Saarthi reminder'}`,
          channelId: CHANNEL_ID,
          schedule: {
            at,
            repeats: true,
            every: 'day',
          },
          sound: 'default',
          smallIcon: 'ic_stat_icon_config_sample',
          extra: {
            type: 'routine',
            alarmId: item.id,
          },
        },
      ],
    });

    console.log(
      `Native alarm scheduled: ${item.id} at ${item.hour}:${item.minute}`
    );
  } catch (error) {
    console.error(`Could not schedule alarm ${item.id}:`, error);
  }
}

/**
 * Schedule all daily routine alarms.
 */
export async function scheduleAllNativeAlarms(items) {
  if (!isNative()) return;

  await setupNativeNotifications();

  for (const item of items) {
    await scheduleNativeAlarm(item);
  }
}

/**
 * Cancel one alarm.
 */
export async function cancelNativeAlarm(id) {
  if (!isNative()) return;

  try {
    await LocalNotifications.cancel({
      notifications: [
        {
          id: getNotificationId(id),
        },
      ],
    });
  } catch (error) {
    console.error('Could not cancel native alarm:', error);
  }
}

/**
 * Cancel all Smriti Saarthi routine alarms.
 */
export async function cancelAllNativeAlarms() {
  if (!isNative()) return;

  try {
    await LocalNotifications.cancel({
      notifications: Object.values(ALARM_IDS).map((id) => ({ id })),
    });
  } catch (error) {
    console.error('Could not cancel native alarms:', error);
  }
}

/**
 * Immediately display an emergency notification.
 */
export async function triggerEmergencyNotification({
  title = '🚨 Emergency Alert',
  body = 'Emergency assistance may be required.',
} = {}) {
  if (!isNative()) {
    // Browser fallback
    try {
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(title, {
            body,
            tag: 'smriti-saarthi-emergency',
            renotify: true,
          });
        }
      }
    } catch {
      // Ignore browser notification errors.
    }

    return;
  }

  try {
    await setupNativeNotifications();

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 999999,
          title,
          body,
          channelId: EMERGENCY_CHANNEL_ID,
          schedule: {
            at: new Date(Date.now() + 1000),
          },
          sound: 'default',
          smallIcon: 'ic_stat_icon_config_sample',
          extra: {
            type: 'emergency',
          },
        },
      ],
    });
  } catch (error) {
    console.error('Emergency notification failed:', error);
  }
}

export async function getPendingNativeNotifications() {
  if (!isNative()) return [];

  try {
    const result = await LocalNotifications.getPending();
    return result.notifications || [];
  } catch {
    return [];
  }
}