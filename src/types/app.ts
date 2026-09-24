export type LangCode =
  | 'as'
  | 'en'
  | 'hi'
  | 'kha'
  | 'lus'
  | 'mni'
  | 'brx'
  | 'bn'
  | 'ta'
  | 'te'
  | 'mr'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'pa'
  | string;

export interface LanguageMeta {
  code: string;
  englishName: string;
  nativeLabel: string;
}

export interface RoutineTemplateItem {
  id: string;
  hour: number;
  minute: number;
  title: string;
  subtitle: string;
  type: 'medicine' | 'water' | 'brain' | 'meal' | 'walk' | string;
}

export type RoutineStatus = 'upcoming' | 'due' | 'completed';

export interface RoutineItem extends RoutineTemplateItem {
  time: string;
  completed: boolean;
  status: RoutineStatus;
  dueAt: Date;
}

export interface CircleMember {
  id: string;
  name: string;
  relation: string;
  role: string;
  location: string;
  type: string;
  phone: string;
}

export interface GameLogEntry {
  id: string;
  gameId: string;
  title: string;
  score: number | string;
  category: string;
  at: string;
}

export interface ProgressSnapshot {
  routineDone: number;
  routineTotal: number;
  todayPlays: number;
  activities: number;
  planned: number;
  accuracy: number;
  overall: number;
  streak: number;
  weekBars: number[];
  recent: GameLogEntry[];
  next: RoutineItem | undefined;
}

export interface CheckInRow {
  id: string;
  at: string;
  place: string;
  lat?: number;
  lng?: number;
}

export interface AlarmPrefs {
  enabled: boolean;
  sound: boolean;
  notify: boolean;
}

export type NotificationType =
  | 'alarm'
  | 'alarm_upcoming'
  | 'doctor'
  | 'ai_train'
  | 'scheme'
  | 'document'
  | string;

export type NotificationPriority = 'high' | 'normal' | 'low' | string;

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: NotificationPriority;
  actionUrl?: string;
  actionLabel?: string;
  meta?: Record<string, unknown>;
}

export type UserRole = 'user' | 'caregiver' | 'doctor' | string;

export interface AuthSession {
  id?: string;
  firstName: string;
  lastName: string;
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  role: UserRole;
  verified: boolean;
  at: string;
  householdCode?: string;
}

export interface UserPrefs {
  profile: {
    name: string;
    phone: string;
    state: string;
    district: string;
    photoDataUrl: string;
    faith: string;
  };
  accessibility: {
    fontSize: string;
    highContrast: boolean;
    uiScale: number;
    simpleMode: boolean;
  };
  notifications: {
    schemes: boolean;
    tickets: boolean;
    community: boolean;
  };
  privacy: {
    dataSharing: boolean;
    aiTranscripts: boolean;
    captions: boolean;
  };
  voice: {
    gender: string;
    rate: string;
  };
}

export interface LatLng {
  lat: number;
  lng: number;
  name?: string;
}

export type DemoCityId = 'assam' | 'delhi' | string;

export interface DemoHome {
  lat: number;
  lng: number;
  label: string;
  area: string;
  radiusM: number;
}

export interface DemoPlace {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
  familiarity: string;
}

export interface DemoCity {
  id: DemoCityId;
  shortLabel: string;
  cityLabel: string;
  liveChip: string;
  viewerTitle: string;
  panoCaption: string;
  weather: string;
  eveningFeel: string;
  safetyIntro: string;
  mapAria: string;
  durationMs: number;
  theme: string;
  copyInside: string;
  home: DemoHome;
  polygon: [number, number][];
  path: LatLng[];
  places: DemoPlace[];
}

export interface FaqOption {
  score: number;
  label: string;
  hint: string;
}

export interface FaqQuestion {
  id: string;
  code: string;
  domain: string;
  title: string;
  desc: string;
  icon: string;
  hazard?: string;
  options: FaqOption[];
}

export type TranslateVars = Record<string, string | number | undefined | null>;
