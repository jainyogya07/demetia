import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ensureSupabaseProfile, isSupabaseConfigured, supabase } from '../lib/supabase';

const STORAGE_KEY = 'ss-auth-session';
const AuthContext = createContext(null);

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

  const applySupabaseSession = useCallback(async (authSession) => {
    const user = authSession?.user;
    if (!user) {
      setSession(null);
      return;
    }
    try {
      const profile = await ensureSupabaseProfile(user);
      const meta = user.user_metadata || {};
      const name = profile?.display_name || meta.display_name || user.email?.split('@')[0] || '';
      const parts = name.trim().split(/\s+/);
      const row = {
        id: user.id,
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' '),
        name,
        phone: profile?.phone || meta.phone || '',
        email: user.email || '',
        birthDate: profile?.birth_date || meta.birth_date || '',
        role: profile?.role || 'patient',
        verified: true,
        at: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(row));
      setSession(row);
    } catch {
      // Auth remains valid even if a profile sync is temporarily unavailable.
      setSession({
        id: user.id,
        name: user.user_metadata?.display_name || user.email?.split('@')[0] || '',
        phone: user.user_metadata?.phone || '',
        email: user.email || '',
        role: 'patient',
        verified: true,
        at: new Date().toISOString(),
      });
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return undefined;
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (alive) applySupabaseSession(data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (alive) applySupabaseSession(nextSession);
    });
    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, [applySupabaseSession]);

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
  }, []);

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setSession(null);
    if (supabase) supabase.auth.signOut().catch(() => {});
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
