import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { user as seedUser } from './data/user';
import type { UserPrefs } from './types/app';

export const PREFS_STORAGE_KEY = 'smriti-user-prefs';

export const DEFAULT_PREFS: UserPrefs = {
  profile: {
    name: seedUser.name || '',
    phone: '',
    state: '',
    district: '',
    photoDataUrl: '',
    /** Optional soft faith tint key: hindu|muslim|sikh|christian|buddhist|jain|secular — no UI picker yet. */
    faith: '',
  },
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
    uiScale: 100,
    simpleMode: false,
  },
  notifications: {
    schemes: true,
    tickets: true,
    community: false,
  },
  privacy: {
    dataSharing: false,
    aiTranscripts: true,
    captions: true,
  },
  voice: {
    gender: 'female',
    rate: 'normal',
  },
};

function readPrefs(): UserPrefs {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed: unknown = JSON.parse(raw);
    const row = parsed && typeof parsed === 'object' ? (parsed as Record<string, Record<string, unknown>>) : {};
    return {
      profile: { ...DEFAULT_PREFS.profile, ...(row.profile || {}) },
      accessibility: { ...DEFAULT_PREFS.accessibility, ...(row.accessibility || {}) },
      notifications: { ...DEFAULT_PREFS.notifications, ...(row.notifications || {}) },
      privacy: { ...DEFAULT_PREFS.privacy, ...(row.privacy || {}) },
      voice: { ...DEFAULT_PREFS.voice, ...(row.voice || {}) },
    } as UserPrefs;
  } catch {
    return DEFAULT_PREFS;
  }
}

function applyAccessibility(accessibility: UserPrefs['accessibility']) {
  const root = document.documentElement;
  root.dataset.uiFont = accessibility.fontSize || 'medium';
  root.dataset.uiScale = String(accessibility.uiScale || 100);
  root.classList.toggle('ui-contrast', !!accessibility.highContrast);
  root.classList.toggle('ui-simple', !!accessibility.simpleMode);
}

interface PrefsContextValue {
  prefs: UserPrefs;
  updatePrefs: (patch: Partial<{ [K in keyof UserPrefs]: Partial<UserPrefs[K]> }>) => void;
  resetPrefs: () => void;
}

const PrefsContext = createContext<PrefsContextValue>({
  prefs: DEFAULT_PREFS,
  updatePrefs: () => {},
  resetPrefs: () => {},
});

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState(readPrefs);

  useEffect(() => {
    applyAccessibility(prefs.accessibility);
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
  }, [prefs]);

  const updatePrefs = useCallback((patch: Partial<{ [K in keyof UserPrefs]: Partial<UserPrefs[K]> }>) => {
    setPrefs((prev) => ({
      profile: { ...prev.profile, ...(patch.profile || {}) },
      accessibility: { ...prev.accessibility, ...(patch.accessibility || {}) },
      notifications: { ...prev.notifications, ...(patch.notifications || {}) },
      privacy: { ...prev.privacy, ...(patch.privacy || {}) },
      voice: { ...prev.voice, ...(patch.voice || {}) },
    }));
  }, []);

  const resetPrefs = useCallback(() => {
    setPrefs(DEFAULT_PREFS);
    try {
      localStorage.removeItem(PREFS_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ prefs, updatePrefs, resetPrefs }), [prefs, updatePrefs, resetPrefs]);

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  return useContext(PrefsContext);
}
