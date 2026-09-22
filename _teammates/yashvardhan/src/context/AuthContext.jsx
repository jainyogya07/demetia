import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'ss-auth-session';
const AuthContext = createContext(null);

const ROLE_HOME = {
  user: '/user',
  caregiver: '/caregiver',
  doctor: '/doctor',
};

export function homeForRole(role) {
  return ROLE_HOME[role] || '/user';
}

function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed?.verified && parsed?.phone) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const [authGate, setAuthGate] = useState(null);

  const openAuth = useCallback((mode = 'signup', opts = {}) => {
    setAuthMode(mode === 'login' ? 'login' : 'signup');
    setAuthGate(opts.gate || null);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
    setAuthGate(null);
  }, []);

  const signIn = useCallback((next) => {
    const row = {
      id: next.id,
      firstName: next.firstName || '',
      lastName: next.lastName || '',
      name: next.name || `${next.firstName || ''} ${next.lastName || ''}`.trim(),
      phone: next.phone,
      email: next.email || '',
      birthDate: next.birthDate || '',
      role: next.role || 'user',
      householdCode: next.householdCode || '',
      linkedPatientId: next.linkedPatientId || '',
      linkedPatient: next.linkedPatient || null,
      verified: true,
      at: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(row));
    } catch {
      /* ignore */
    }
    setSession(row);
    setAuthOpen(false);
    setAuthGate(null);
    return row;
  }, []);

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, signIn, signOut, authOpen, authMode, authGate, openAuth, closeAuth, homeForRole }),
    [session, signIn, signOut, authOpen, authMode, authGate, openAuth, closeAuth],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth requires AuthProvider');
  return ctx;
}
