/**
 * Notification Store & Event Bus
 * Tracks notifications for doctor notes, caregiver AI training,
 * alarm alerts, upcoming alarm reminders, document uploads, and government schemes.
 */

import type { AppNotification, NotificationPriority } from '../types/app';

const STORAGE_KEY = 'ss-notifications-v1';
const EVENT_NAME = 'ss-notifications-updated';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key } }));
    }
  } catch {
    /* ignore quota */
  }
}

function uid(prefix = 'notif') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

// Seed notifications representing the core requested features
const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'seed-upcoming-1',
    type: 'alarm_upcoming',
    title: 'Upcoming Routine Reminder',
    message: 'Evening Hydration and garden walk scheduled in 20 minutes (05:00 PM).',
    time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
    priority: 'high',
    actionUrl: '/caregiver/routine',
    actionLabel: 'View Routine',
  },
  {
    id: 'seed-doc-1',
    type: 'doctor',
    title: 'Dr. Sharma (Neurologist)',
    message: 'New clinical advice: Reduce sodium intake and log evening BP readings for the next 5 days.',
    time: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: false,
    priority: 'high',
    actionUrl: '/caregiver/circle',
    actionLabel: 'Doctor Notes',
  },
  {
    id: 'seed-ai-1',
    type: 'ai_train',
    title: 'Care Agent AI Trained',
    message: 'Rina added a behavioral preference: "Latveria gets anxious around sunset (sundowning). Speak calmly and offer warm tea."',
    time: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    read: false,
    priority: 'normal',
    actionUrl: '/caregiver/train-ai',
    actionLabel: 'Train AI Page',
  },
  {
    id: 'seed-alarm-1',
    type: 'alarm',
    title: 'Medication Alarm Fired',
    message: 'Morning Donepezil 5mg dose was completed at 08:32 AM.',
    time: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    read: true,
    priority: 'normal',
    actionUrl: '/caregiver/routine',
    actionLabel: 'View Schedule',
  },
  {
    id: 'seed-paper-1',
    type: 'document',
    title: 'Prescription Updated',
    message: 'Dr. Sharma neurology clinic follow-up prescription was uploaded and shared with the care circle.',
    time: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    read: true,
    priority: 'normal',
    actionUrl: '/caregiver/documents',
    actionLabel: 'Open Documents',
  },
  {
    id: 'seed-scheme-1',
    type: 'scheme',
    title: 'New Government Scheme Available',
    message: 'Rashtriya Vayoshri Yojana (RVY): Free physical aids and assisted-living devices for eligible senior citizens.',
    time: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    read: true,
    priority: 'low',
    actionUrl: '/user',
    actionLabel: 'Check Scheme Details',
  },
];

export function getNotifications(): AppNotification[] {
  const saved = readJson<unknown>(STORAGE_KEY, null);
  if (Array.isArray(saved)) return saved as AppNotification[];
  writeJson(STORAGE_KEY, INITIAL_NOTIFICATIONS);
  return INITIAL_NOTIFICATIONS;
}

export function saveNotifications(list: AppNotification[]) {
  writeJson(STORAGE_KEY, list);
  return list;
}

function playNotificationChime(priority: NotificationPriority = 'normal') {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    const freqs = priority === 'high' ? [523.25, 659.25, 783.99] : [392, 493.88];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = 0.0001;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const t = now + i * 0.08;
      gain.gain.exponentialRampToValueAtTime(0.08, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
      osc.start(t);
      osc.stop(t + 0.32);
    });
    window.setTimeout(() => ctx.close().catch(() => {}), 800);
  } catch {
    /* ignore */
  }
}

export function addNotification(payload: {
  type?: string;
  title?: string;
  message?: string;
  time?: string;
  priority?: NotificationPriority;
  actionUrl?: string;
  actionLabel?: string;
  meta?: Record<string, unknown>;
}) {
  const list = getNotifications();
  const newNotif = {
    id: uid('notif'),
    type: payload.type || 'system',
    title: payload.title || 'Notification',
    message: payload.message || '',
    time: payload.time || new Date().toISOString(),
    read: false,
    priority: payload.priority || 'normal',
    actionUrl: payload.actionUrl || '',
    actionLabel: payload.actionLabel || '',
    meta: payload.meta || {},
  };

  const updated = [newNotif, ...list].slice(0, 100);
  saveNotifications(updated);
  if (newNotif.type !== 'alarm') playNotificationChime(newNotif.priority);
  return newNotif;
}

export function markAsRead(id: string) {
  const list = getNotifications();
  const updated = list.map((item) => (item.id === id ? { ...item, read: true } : item));
  return saveNotifications(updated);
}

export function markAllAsRead() {
  const list = getNotifications();
  const updated = list.map((item) => ({ ...item, read: true }));
  return saveNotifications(updated);
}

export function removeNotification(id: string) {
  const list = getNotifications().filter((item) => item.id !== id);
  return saveNotifications(list);
}

export function clearAllNotifications() {
  return saveNotifications([]);
}

export function getUnreadCount() {
  return getNotifications().filter((item) => !item.read).length;
}

export function subscribeNotifications(handler: (list: AppNotification[]) => void) {
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY) handler(getNotifications());
  };
  const onCustom = () => handler(getNotifications());

  window.addEventListener('storage', onStorage);
  window.addEventListener(EVENT_NAME, onCustom);

  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(EVENT_NAME, onCustom);
  };
}

export function triggerDemoNotification(type: string) {
  switch (type) {
    case 'doctor':
      return addNotification({
        type: 'doctor',
        title: 'Dr. Sharma (Neurologist)',
        message: 'Shared new clinical recommendation: Continue Memantine 10mg daily after dinner, observe sleep patterns.',
        priority: 'high',
        actionUrl: '/caregiver/circle',
        actionLabel: 'View Doctor Note',
      });
    case 'ai_train':
      return addNotification({
        type: 'ai_train',
        title: 'Care Agent AI Trained',
        message: 'Caregiver added new memory trigger: "Show photo album from Guwahati if she feels disoriented."',
        priority: 'normal',
        actionUrl: '/caregiver/train-ai',
        actionLabel: 'View AI Training',
      });
    case 'alarm':
      return addNotification({
        type: 'alarm',
        title: 'Scheduled Alarm: Blood Pressure Check',
        message: 'Evening BP monitoring routine is active right now. Please log the systolic/diastolic readings.',
        priority: 'high',
        actionUrl: '/caregiver/routine',
        actionLabel: 'Check Routine',
      });
    case 'alarm_upcoming':
      return addNotification({
        type: 'alarm_upcoming',
        title: 'Upcoming Routine Reminder',
        message: 'Night Medication (Donepezil 10mg) is due in 25 minutes (09:00 PM). Prepare water and pill tray.',
        priority: 'high',
        actionUrl: '/caregiver/routine',
        actionLabel: 'Open Routine',
      });
    case 'document':
      return addNotification({
        type: 'document',
        title: 'Prescription Uploaded',
        message: 'Dr. Anita Das uploaded MRI Neuro report summary (PDF) to Latveria’s shared health records.',
        priority: 'normal',
        actionUrl: '/caregiver/documents',
        actionLabel: 'Open Documents',
      });
    case 'scheme':
      return addNotification({
        type: 'scheme',
        title: 'New Government Scheme Notification',
        message: 'Ayushman Bharat PM-JAY: Free ₹5 Lakh annual healthcare cover expanded for all citizens aged 70+ regardless of income.',
        priority: 'normal',
        actionUrl: '/user',
        actionLabel: 'Explore Scheme',
      });
    default:
      return addNotification({
        type: 'system',
        title: 'System Notification',
        message: 'Smriti Saarthi synchronization completed successfully.',
        priority: 'low',
        actionUrl: '/caregiver',
        actionLabel: 'View Dashboard',
      });
  }
}

