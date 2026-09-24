import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  DEFAULT_LANG,
  LANG_STORAGE_KEY,
  LANGUAGES,
  getLanguage,
  normalizeLang,
  translate,
} from './i18n';
import { detectAndResolveLang } from './lib/regionLanguage';
import type { LanguageMeta, TranslateVars } from './types/app';

export interface I18nContextValue {
  lang: string;
  language: LanguageMeta;
  languages?: typeof LANGUAGES;
  setLang: (code: string) => void;
  t: (path: string, vars?: TranslateVars) => string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: DEFAULT_LANG,
  language: getLanguage(DEFAULT_LANG),
  setLang: () => {},
  t: (path, vars) => translate(DEFAULT_LANG, path, vars),
});

function readStoredLang() {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored) return normalizeLang(stored);
  } catch {
    /* ignore */
  }
  return DEFAULT_LANG;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState(readStoredLang);

  const setLang = useCallback((code: string) => {
    const resolved = normalizeLang(code);
    setLangState(resolved);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, resolved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (localStorage.getItem('smriti-auto-language') === 'false') return;
        if (localStorage.getItem('smriti-lang-manual') === '1') return;
        if (localStorage.getItem('smriti-region-applied')) return;
      } catch {
        return;
      }
      const found = await detectAndResolveLang();
      if (cancelled || !found.lang) return;
      // Re-check after await — user may have picked a language while geo was in flight.
      try {
        if (localStorage.getItem('smriti-auto-language') === 'false') return;
        if (localStorage.getItem('smriti-lang-manual') === '1') return;
      } catch {
        /* ignore */
      }
      setLang(found.lang);
      try { localStorage.setItem('smriti-region-applied', '1'); } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [setLang]);

  const t = useCallback((path: string, vars?: TranslateVars) => translate(lang, path, vars), [lang]);

  const value = useMemo(() => {
    const language = getLanguage(lang);
    return {
      lang,
      language,
      languages: LANGUAGES,
      setLang,
      t,
    };
  }, [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
