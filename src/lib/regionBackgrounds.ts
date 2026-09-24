import defaultScenery from '../assets/hero-calm-lake.png';
import assamScenery from '../assets/backgrounds/assam_scenery.jpg';
import bengalScenery from '../assets/backgrounds/bengal_scenery.jpg';
import gujaratiScenery from '../assets/backgrounds/gujarati_scenery.jpg';
import kannadaScenery from '../assets/backgrounds/kannada_scenery.jpg';
import khasiScenery from '../assets/backgrounds/khasi_scenery.jpg';
import malayalamScenery from '../assets/backgrounds/malayalam_scenery.jpg';
import manipuriScenery from '../assets/backgrounds/manipuri_scenery.jpg';
import marathiScenery from '../assets/backgrounds/marathi_scenery.jpg';
import mizoScenery from '../assets/backgrounds/mizo_scenery.jpg';
import northIndiaScenery from '../assets/backgrounds/north_india_scenery.jpg';
import punjabiScenery from '../assets/backgrounds/punjabi_scenery.jpg';
import tamilScenery from '../assets/backgrounds/tamil_scenery.jpg';
import teluguScenery from '../assets/backgrounds/telugu_scenery.jpg';
import { resolveRegionTheme } from './regionThemes';

/** Default lakeside — used for English UI and when no region/language scenery applies. */
export const DEFAULT_SCENERY = defaultScenery;

/**
 * Filename → region / language mapping (DEMO_REGIONS + common Hindi-belt states).
 * Prefer explicit/detected `region` when known; language only for non-English; else lake.
 */
export const REGION_SCENERY = {
  Assam: assamScenery,
  'West Bengal': bengalScenery,
  Tripura: bengalScenery,
  Gujarat: gujaratiScenery,
  Karnataka: kannadaScenery,
  Meghalaya: khasiScenery,
  Kerala: malayalamScenery,
  Manipur: manipuriScenery,
  Maharashtra: marathiScenery,
  Mizoram: mizoScenery,
  Delhi: northIndiaScenery,
  'New Delhi': northIndiaScenery,
  'Uttar Pradesh': northIndiaScenery,
  Bihar: northIndiaScenery,
  Punjab: punjabiScenery,
  'Tamil Nadu': tamilScenery,
  Telangana: teluguScenery,
  'Andhra Pradesh': teluguScenery,
};

/**
 * Non-English dashboard / i18n language codes → scenery.
 * Includes both app forms (kn) and i18n aliases (kha/lus/mni).
 * English never uses these.
 */
export const LANGUAGE_SCENERY = {
  as: assamScenery,
  bn: bengalScenery,
  gu: gujaratiScenery,
  kn: kannadaScenery,
  kh: khasiScenery,
  kha: khasiScenery,
  ml: malayalamScenery,
  mn: manipuriScenery,
  mni: manipuriScenery,
  mr: marathiScenery,
  mz: mizoScenery,
  lus: mizoScenery,
  hi: northIndiaScenery,
  pa: punjabiScenery,
  ta: tamilScenery,
  te: teluguScenery,
};

/** Every file under src/assets/backgrounds (for inventory checks). */
export const BACKGROUND_FILES = {
  'assam_scenery.jpg': assamScenery,
  'bengal_scenery.jpg': bengalScenery,
  'gujarati_scenery.jpg': gujaratiScenery,
  'kannada_scenery.jpg': kannadaScenery,
  'khasi_scenery.jpg': khasiScenery,
  'malayalam_scenery.jpg': malayalamScenery,
  'manipuri_scenery.jpg': manipuriScenery,
  'marathi_scenery.jpg': marathiScenery,
  'mizo_scenery.jpg': mizoScenery,
  'north_india_scenery.jpg': northIndiaScenery,
  'punjabi_scenery.jpg': punjabiScenery,
  'tamil_scenery.jpg': tamilScenery,
  'telugu_scenery.jpg': teluguScenery,
};

const preloadCache = new Map();

export function normalizeRegionKey(region) {
  if (!region || typeof region !== 'string') return '';
  const trimmed = region.trim();
  if (REGION_SCENERY[trimmed]) return trimmed;
  const lower = trimmed.toLowerCase();
  const hit = Object.keys(REGION_SCENERY).find((key) => lower.includes(key.toLowerCase()));
  return hit || '';
}

/**
 * Resolve scenery URL for the current region/language preference.
 *
 * Order:
 * 1. Explicit region pick (demo / Detect region) → region scenery (even with English)
 * 2. English (`en`) or empty lang → calm lake
 * 3. Non-English language with a mapped scenery → language scenery
 * 4. Default lakeside
 *
 * Stale `detectedRegion` leftovers never override language/English unless `regionExplicit`.
 */
export function resolveRegionScenery({
  region = '',
  language = '',
  faith = null,
  regionExplicit = false,
} = {}) {
  const regionKey = normalizeRegionKey(region);
  const lang = String(language || '').toLowerCase().trim();
  const isEnglish = !lang || lang === 'en';

  // Only an intentional region lock may beat language-driven scenery.
  if (regionExplicit && regionKey && REGION_SCENERY[regionKey]) {
    const key = `region:${regionKey}`;
    return {
      src: REGION_SCENERY[regionKey],
      key,
      regionKey,
      theme: resolveRegionTheme({ region: regionKey, language, faith, sceneryKey: key }),
    };
  }

  if (isEnglish) {
    return {
      src: DEFAULT_SCENERY,
      key: 'default',
      regionKey: '',
      theme: resolveRegionTheme({ region: '', language: 'en', faith, sceneryKey: 'default' }),
    };
  }

  if (LANGUAGE_SCENERY[lang]) {
    const key = `lang:${lang}`;
    return {
      src: LANGUAGE_SCENERY[lang],
      key,
      regionKey: '',
      theme: resolveRegionTheme({ region: '', language: lang, faith, sceneryKey: key }),
    };
  }

  return {
    src: DEFAULT_SCENERY,
    key: 'default',
    regionKey: '',
    theme: resolveRegionTheme({ region: '', language: lang, faith, sceneryKey: 'default' }),
  };
}

/** Decode image once; resolves immediately if already cached. */
export function preloadScenery(src) {
  if (!src || typeof window === 'undefined') return Promise.resolve(src);
  if (preloadCache.has(src)) return preloadCache.get(src);

  const promise = new Promise((resolve) => {
    const img = new Image();
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve(src);
    };
    img.onload = done;
    img.onerror = done;
    img.src = src;
    if (img.complete) done();
    // Don't block UI forever if decode stalls
    window.setTimeout(done, 800);
  });

  preloadCache.set(src, promise);
  return promise;
}

/** Warm a few likely next images without awaiting. */
export function warmSceneryUrls(urls = []) {
  urls.filter(Boolean).forEach((url) => {
    preloadScenery(url);
  });
}
