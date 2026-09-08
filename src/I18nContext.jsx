import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_LANG,
  LANG_STORAGE_KEY,
  LANGUAGES,
  getLanguage,
  normalizeLang,
  translate,
} from './i18n';
import { detectAndResolveLang } from './lib/regionLanguage';

const I18nContext = createContext({
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

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang);

  const setLang = useCallback((code) => {
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
      setLang(found.lang);
      try { localStorage.setItem('smriti-region-applied', '1'); } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [setLang]);

  const t = useCallback((path, vars) => translate(lang, path, vars), [lang]);

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
