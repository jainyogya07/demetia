// @ts-nocheck — leftover JS-shaped module; runtime unchanged
import { useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePrefs } from '../PrefsContext';
import { resolveRegionScenery, preloadScenery, DEFAULT_SCENERY } from '../lib/regionBackgrounds';
import { applyThemeVars } from '../lib/regionThemes';

/**
 * Shared scenery + tint source for lakeside shells.
 * Updates when region, language, or optional faith preference changes.
 * Mirrors URL onto `--ss-scenery` and theme accents onto CSS vars (instant swap).
 */
export function useRegionScenery() {
  const { language, detectedRegion, regionExplicit } = useLanguage();
  const { prefs } = usePrefs();
  const faith = prefs?.profile?.faith || prefs?.profile?.religion || null;

  const scenery = useMemo(
    () => resolveRegionScenery({
      region: detectedRegion,
      language,
      faith,
      regionExplicit: Boolean(regionExplicit),
    }),
    [detectedRegion, language, faith, regionExplicit],
  );

  useEffect(() => {
    try {
      document.documentElement.style.setProperty('--ss-scenery', `url(${JSON.stringify(scenery.src)})`);
    } catch {
      /* ignore */
    }
  }, [scenery.src]);

  useEffect(() => {
    applyThemeVars(scenery.theme);
  }, [scenery.theme]);

  useEffect(() => {
    preloadScenery(DEFAULT_SCENERY);
    preloadScenery(scenery.src);
  }, [scenery.src]);

  return scenery;
}
