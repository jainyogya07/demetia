import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { user as seedUser } from './data/user';

export const PREFS_STORAGE_KEY = 'smriti-user-prefs';

export const DEFAULT_PREFS = {
  profile: {
    name: seedUser.name || '',
    phone: '',
    state: '',
    district: '',
    photoDataUrl: '',
  },
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
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
  },
};

function readPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw);
    return {
      profile: { ...DEFAULT_PREFS.profile, ...(parsed.profile || {}) },
      accessibility: { ...DEFAULT_PREFS.accessibility, ...(parsed.accessibility || {}) },
      notifications: { ...DEFAULT_PREFS.notifications, ...(parsed.notifications || {}) },
      privacy: { ...DEFAULT_PREFS.privacy, ...(parsed.privacy || {}) },
      voice: { ...DEFAULT_PREFS.voice, ...(parsed.voice || {}) },
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

function applyAccessibility(accessibility) {
  const root = document.documentElement;
  root.dataset.uiFont = accessibility.fontSize || 'medium';
  root.classList.toggle('ui-contrast', !!accessibility.highContrast);
}

const PrefsContext = createContext({
  prefs: DEFAULT_PREFS,
  updatePrefs: () => {},
  resetPrefs: () => {},
});

export function PrefsProvider({ children }) {
  const [prefs, setPrefs] = useState(readPrefs);

  useEffect(() => {
    applyAccessibility(prefs.accessibility);
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
  }, [prefs]);

  const updatePrefs = useCallback((patch) => {
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
