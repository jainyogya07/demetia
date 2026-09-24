import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AuthSession } from '../types/app';

const STORAGE_KEY = 'ss-auth-session';

export type AuthMode = 'login' | 'signup';

export interface AuthGate {
  gate?: string;
}

export interface AuthContextValue {
  session: AuthSession | null;
  signIn: (next: Partial<AuthSession> & { phone: string }) => void;
  signOut: () => void;
  authOpen: boolean;
  authMode: AuthMode;
  authGate: string | null;
  openAuth: (mode?: string, opts?: AuthGate) => void;
  closeAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function isSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') return false;
  const row = value as Record<string, unknown>;
  return row.verified === true && typeof row.phone === 'string';
}

function readSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (isSession(parsed)) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(readSession);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [authGate, setAuthGate] = useState<string | null>(null);

  const openAuth = useCallback((mode = 'signup', opts: AuthGate = {}) => {
    setAuthMode(mode === 'login' ? 'login' : 'signup');
    setAuthGate(opts.gate || null);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
    setAuthGate(null);
  }, []);

  const signIn = useCallback((next: Partial<AuthSession> & { phone: string }) => {
    const row: AuthSession = {
      id: next.id,
      firstName: next.firstName || '',
      lastName: next.lastName || '',
      name: next.name || `${next.firstName || ''} ${next.lastName || ''}`.trim(),
      phone: next.phone,
      email: next.email || '',
      birthDate: next.birthDate || '',
      role: next.role || 'user',
      verified: true,
      at: new Date().toISOString(),
      householdCode: next.householdCode,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(row));
    } catch {
      /* ignore */
    }
    setSession(row);
    setAuthOpen(false);
    setAuthGate(null);
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
    () => ({ session, signIn, signOut, authOpen, authMode, authGate, openAuth, closeAuth }),
    [session, signIn, signOut, authOpen, authMode, authGate, openAuth, closeAuth],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth requires AuthProvider');
  return ctx;
}
