/**
 * Soft UI tint packs for regional scenery + optional faith overlays.
 * Dementia-safe: calm, high-contrast text stays on --ss-ink; no flash, no sacred symbols.
 */

/** Base sage lakeside — English / no region. */
export const DEFAULT_THEME = {
  key: 'default',
  accent: '#176b58',
  accentSoft: '#2a9d8f',
  teal: '#214d42',
  ink: '#214d42',
  muted: '#60716b',
  glass: 'rgba(255, 255, 255, 0.78)',
  glassBorder: 'rgba(216, 229, 223, 0.72)',
  washA: 'rgba(246, 250, 247, 0.78)',
  washB: 'rgba(246, 250, 247, 0.42)',
  washC: 'rgba(20, 48, 42, 0.18)',
  washD: 'rgba(20, 48, 42, 0.28)',
  headerWash: 'rgba(255, 255, 255, 0.28)',
  sidebarWash: 'rgba(255, 255, 255, 0.34)',
  gold: '#c18429',
};

/**
 * Region → scenery-aligned tint (fast CSS-var swap, no images).
 * Greener Assam, warmer Bengal dusk, temple-gold Tamil, mustard Punjab, lush Kerala, etc.
 */
export const REGION_THEMES = {
  Assam: {
    key: 'assam',
    accent: '#1a7a4c',
    accentSoft: '#3d9b6a',
    teal: '#1e4d38',
    washA: 'rgba(232, 246, 236, 0.8)',
    washB: 'rgba(210, 236, 220, 0.4)',
    washC: 'rgba(18, 64, 42, 0.2)',
    washD: 'rgba(14, 48, 32, 0.3)',
    headerWash: 'rgba(236, 248, 240, 0.28)',
    sidebarWash: 'rgba(240, 250, 244, 0.36)',
    gold: '#b8872a',
  },
  'West Bengal': {
    key: 'bengal',
    accent: '#8b4a3a',
    accentSoft: '#c4785a',
    teal: '#4a342e',
    washA: 'rgba(252, 240, 228, 0.8)',
    washB: 'rgba(248, 220, 196, 0.38)',
    washC: 'rgba(72, 36, 28, 0.18)',
    washD: 'rgba(56, 28, 22, 0.28)',
    headerWash: 'rgba(255, 244, 232, 0.28)',
    sidebarWash: 'rgba(255, 246, 236, 0.36)',
    gold: '#c4903c',
  },
  Tripura: { key: 'tripura' }, // inherits Bengal via alias below
  Gujarat: {
    key: 'gujarat',
    accent: '#c47a1a',
    accentSoft: '#e0a040',
    teal: '#5a4020',
    washA: 'rgba(255, 246, 228, 0.8)',
    washB: 'rgba(255, 232, 190, 0.36)',
    washC: 'rgba(80, 48, 16, 0.16)',
    washD: 'rgba(64, 40, 12, 0.26)',
    headerWash: 'rgba(255, 248, 236, 0.28)',
    sidebarWash: 'rgba(255, 250, 240, 0.36)',
    gold: '#d4922a',
  },
  Karnataka: {
    key: 'karnataka',
    accent: '#2a6b58',
    accentSoft: '#4a9880',
    teal: '#1e4038',
    washA: 'rgba(236, 246, 242, 0.8)',
    washB: 'rgba(210, 232, 224, 0.4)',
    washC: 'rgba(24, 56, 48, 0.18)',
    washD: 'rgba(16, 40, 34, 0.28)',
    headerWash: 'rgba(240, 248, 244, 0.28)',
    sidebarWash: 'rgba(242, 250, 246, 0.36)',
    gold: '#b88830',
  },
  Meghalaya: {
    key: 'meghalaya',
    accent: '#2d6b4f',
    accentSoft: '#5a9a72',
    teal: '#1c4032',
    washA: 'rgba(230, 244, 236, 0.82)',
    washB: 'rgba(200, 228, 210, 0.4)',
    washC: 'rgba(20, 56, 40, 0.2)',
    washD: 'rgba(14, 42, 30, 0.3)',
    headerWash: 'rgba(236, 246, 240, 0.5)',
    sidebarWash: 'rgba(238, 248, 242, 0.36)',
    gold: '#a88840',
  },
  Kerala: {
    key: 'kerala',
    accent: '#0f6b4a',
    accentSoft: '#2d9a6e',
    teal: '#164034',
    washA: 'rgba(228, 246, 236, 0.82)',
    washB: 'rgba(190, 230, 210, 0.38)',
    washC: 'rgba(12, 56, 40, 0.2)',
    washD: 'rgba(8, 42, 30, 0.32)',
    headerWash: 'rgba(232, 248, 240, 0.5)',
    sidebarWash: 'rgba(234, 250, 242, 0.36)',
    gold: '#c9a227',
  },
  Manipur: {
    key: 'manipur',
    accent: '#1f6b5a',
    accentSoft: '#3d9a82',
    teal: '#1a4038',
    washA: 'rgba(232, 244, 240, 0.8)',
    washB: 'rgba(200, 228, 218, 0.4)',
    washC: 'rgba(20, 56, 48, 0.18)',
    washD: 'rgba(14, 40, 34, 0.28)',
    headerWash: 'rgba(236, 246, 242, 0.28)',
    sidebarWash: 'rgba(238, 248, 244, 0.36)',
    gold: '#b89038',
  },
  Maharashtra: {
    key: 'maharashtra',
    accent: '#8a5a28',
    accentSoft: '#c09048',
    teal: '#4a3824',
    washA: 'rgba(250, 242, 228, 0.8)',
    washB: 'rgba(236, 220, 190, 0.38)',
    washC: 'rgba(64, 44, 24, 0.16)',
    washD: 'rgba(48, 32, 18, 0.26)',
    headerWash: 'rgba(252, 246, 236, 0.28)',
    sidebarWash: 'rgba(252, 248, 240, 0.36)',
    gold: '#c89830',
  },
  Mizoram: {
    key: 'mizoram',
    accent: '#267a52',
    accentSoft: '#4a9e70',
    teal: '#1c4434',
    washA: 'rgba(230, 246, 236, 0.82)',
    washB: 'rgba(198, 228, 210, 0.4)',
    washC: 'rgba(18, 58, 42, 0.2)',
    washD: 'rgba(12, 44, 32, 0.3)',
    headerWash: 'rgba(236, 248, 240, 0.5)',
    sidebarWash: 'rgba(238, 250, 242, 0.36)',
    gold: '#a88838',
  },
  Delhi: {
    key: 'delhi',
    accent: '#3a6b7a',
    accentSoft: '#5a8a98',
    teal: '#2a4048',
    washA: 'rgba(236, 244, 248, 0.8)',
    washB: 'rgba(210, 226, 234, 0.4)',
    washC: 'rgba(32, 48, 56, 0.18)',
    washD: 'rgba(24, 36, 44, 0.28)',
    headerWash: 'rgba(240, 246, 250, 0.28)',
    sidebarWash: 'rgba(242, 248, 250, 0.36)',
    gold: '#b88840',
  },
  'New Delhi': { key: 'new_delhi' },
  'Uttar Pradesh': {
    key: 'up',
    accent: '#6b5a3a',
    accentSoft: '#9a8458',
    teal: '#403828',
    washA: 'rgba(248, 244, 232, 0.8)',
    washB: 'rgba(232, 220, 190, 0.38)',
    washC: 'rgba(56, 44, 28, 0.16)',
    washD: 'rgba(40, 32, 20, 0.26)',
    headerWash: 'rgba(250, 246, 236, 0.28)',
    sidebarWash: 'rgba(250, 248, 240, 0.36)',
    gold: '#c09030',
  },
  Bihar: { key: 'bihar' },
  Punjab: {
    key: 'punjab',
    accent: '#c9a227',
    accentSoft: '#e0bc48',
    teal: '#1a3a6b',
    washA: 'rgba(255, 248, 220, 0.8)',
    washB: 'rgba(255, 236, 170, 0.36)',
    washC: 'rgba(26, 48, 90, 0.14)',
    washD: 'rgba(20, 36, 72, 0.24)',
    headerWash: 'rgba(255, 250, 230, 0.5)',
    sidebarWash: 'rgba(255, 252, 236, 0.36)',
    gold: '#d4a820',
  },
  'Tamil Nadu': {
    key: 'tamil',
    accent: '#b8860b',
    accentSoft: '#d4a84a',
    teal: '#5a3a18',
    washA: 'rgba(255, 246, 220, 0.82)',
    washB: 'rgba(255, 228, 170, 0.36)',
    washC: 'rgba(72, 44, 16, 0.16)',
    washD: 'rgba(56, 32, 12, 0.26)',
    headerWash: 'rgba(255, 248, 228, 0.5)',
    sidebarWash: 'rgba(255, 250, 232, 0.36)',
    gold: '#daa520',
  },
  Telangana: {
    key: 'telangana',
    accent: '#8b5a2b',
    accentSoft: '#b87840',
    teal: '#4a3020',
    washA: 'rgba(250, 238, 224, 0.8)',
    washB: 'rgba(236, 210, 180, 0.36)',
    washC: 'rgba(64, 40, 24, 0.16)',
    washD: 'rgba(48, 28, 16, 0.26)',
    headerWash: 'rgba(252, 244, 232, 0.28)',
    sidebarWash: 'rgba(252, 246, 236, 0.36)',
    gold: '#c89838',
  },
  'Andhra Pradesh': { key: 'andhra' },
};

// Lightweight aliases (share pack with a sibling region)
REGION_THEMES.Tripura = { ...REGION_THEMES['West Bengal'], key: 'tripura' };
REGION_THEMES['New Delhi'] = { ...REGION_THEMES.Delhi, key: 'new_delhi' };
REGION_THEMES.Bihar = { ...REGION_THEMES['Uttar Pradesh'], key: 'bihar' };
REGION_THEMES['Andhra Pradesh'] = { ...REGION_THEMES.Telangana, key: 'andhra' };

/** Language code → same packs as region when no explicit region. */
export const LANGUAGE_THEMES = {
  as: REGION_THEMES.Assam,
  bn: REGION_THEMES['West Bengal'],
  gu: REGION_THEMES.Gujarat,
  kn: REGION_THEMES.Karnataka,
  kh: REGION_THEMES.Meghalaya,
  kha: REGION_THEMES.Meghalaya,
  ml: REGION_THEMES.Kerala,
  mn: REGION_THEMES.Manipur,
  mni: REGION_THEMES.Manipur,
  mr: REGION_THEMES.Maharashtra,
  mz: REGION_THEMES.Mizoram,
  lus: REGION_THEMES.Mizoram,
  hi: REGION_THEMES.Delhi,
  pa: REGION_THEMES.Punjab,
  ta: REGION_THEMES['Tamil Nadu'],
  te: REGION_THEMES.Telangana,
};

/**
 * Culturally respectful soft accent overlays for major Indian traditions.
 * Optional only — never doctrinal UI, no symbols. Ready for prefs.profile.faith.
 */
export const RELIGION_THEMES = {
  hindu: {
    key: 'hindu',
    label: 'Warm saffron / cream',
    accentMix: '#d4782a',
    washTint: 'rgba(255, 236, 210, 0.22)',
    gold: '#e0a040',
  },
  muslim: {
    key: 'muslim',
    label: 'Soft green / teal',
    accentMix: '#2a8a6a',
    washTint: 'rgba(210, 240, 228, 0.22)',
    gold: '#3d9b7a',
  },
  sikh: {
    key: 'sikh',
    label: 'Mustard / deep blue hints',
    accentMix: '#c9a227',
    washTint: 'rgba(255, 244, 200, 0.2)',
    gold: '#1a3a6b',
  },
  christian: {
    key: 'christian',
    label: 'Soft blue / white',
    accentMix: '#4a7a9a',
    washTint: 'rgba(220, 236, 248, 0.24)',
    gold: '#6a90b0',
  },
  buddhist: {
    key: 'buddhist',
    label: 'Saffron / maroon soft',
    accentMix: '#c45c2a',
    washTint: 'rgba(248, 228, 210, 0.22)',
    gold: '#8b3a2a',
  },
  jain: {
    key: 'jain',
    label: 'White / cream calm',
    accentMix: '#8a8a78',
    washTint: 'rgba(252, 250, 242, 0.28)',
    gold: '#b8a878',
  },
  secular: {
    key: 'secular',
    label: 'Sage lakeside (default)',
    accentMix: null,
    washTint: null,
    gold: null,
  },
};

/**
 * Optional soft cultural color lean by geography when no faith prefs exist.
 * These are design tints only — not demographic or doctrinal assignment.
 * Prefer prefs.profile.faith when present; otherwise keep region pack as-is
 * (region themes already encode Assam green, Bengal dusk, Tamil gold, etc.).
 */
export const REGION_CULTURE_LEAN = {
  // Intentionally sparse: avoid forcing faith overlays from state names.
  // Punjab mustard/blue is already in REGION_THEMES.Punjab.
  // Hook for future: map a region here only if product wants a gentle lean.
};

function mergeTheme(base, patch = {}) {
  return { ...base, ...patch, key: patch.key || base.key };
}

function mixAccent(baseHex, mixHex, amount = 0.18) {
  if (!mixHex) return baseHex;
  // Keep simple: prefer base accent; lighten toward mix via CSS color-mix at apply time.
  return `color-mix(in srgb, ${baseHex} ${Math.round((1 - amount) * 100)}%, ${mixHex})`;
}

/**
 * Resolve full theme from scenery key + optional faith preference.
 * @param {{ region?: string, language?: string, faith?: string|null, sceneryKey?: string }} opts
 */
export function resolveRegionTheme({
  region = '',
  language = '',
  faith = null,
  sceneryKey = '',
} = {}) {
  let pack = DEFAULT_THEME;

  if (sceneryKey.startsWith('region:')) {
    const rk = sceneryKey.slice(7);
    if (REGION_THEMES[rk]) pack = mergeTheme(DEFAULT_THEME, REGION_THEMES[rk]);
  } else if (sceneryKey.startsWith('lang:')) {
    const lk = sceneryKey.slice(5);
    if (LANGUAGE_THEMES[lk]) pack = mergeTheme(DEFAULT_THEME, LANGUAGE_THEMES[lk]);
  } else if (region && REGION_THEMES[region]) {
    pack = mergeTheme(DEFAULT_THEME, REGION_THEMES[region]);
  } else {
    const lang = String(language || '').toLowerCase().trim();
    if (lang && lang !== 'en' && LANGUAGE_THEMES[lang]) {
      pack = mergeTheme(DEFAULT_THEME, LANGUAGE_THEMES[lang]);
    }
  }

  const faithKey = String(faith || '').toLowerCase().trim();
  let religion = null;
  if (faithKey && RELIGION_THEMES[faithKey] && faithKey !== 'secular') {
    religion = RELIGION_THEMES[faithKey];
  } else {
    const leanKey = REGION_CULTURE_LEAN[region] || null;
    if (leanKey && leanKey !== 'secular' && sceneryKey && sceneryKey !== 'default') {
      religion = RELIGION_THEMES[leanKey];
    }
  }

  if (religion?.accentMix) {
    pack = {
      ...pack,
      accent: mixAccent(pack.accent, religion.accentMix, 0.16),
      gold: religion.gold || pack.gold,
      faithWash: religion.washTint,
      faithKey: religion.key,
    };
  } else {
    pack = { ...pack, faithWash: null, faithKey: 'secular' };
  }

  return pack;
}

/** Apply theme as CSS custom properties on documentElement (instant, no hang). */
export function applyThemeVars(theme, root = typeof document !== 'undefined' ? document.documentElement : null) {
  if (!root || !theme) return;
  const set = (k, v) => {
    if (v != null && v !== '') root.style.setProperty(k, v);
  };
  set('--ss-sage', theme.accent);
  set('--ss-accent', theme.accent);
  set('--ss-accent-soft', theme.accentSoft);
  set('--ss-teal', theme.teal);
  set('--ss-ink', theme.ink || theme.teal);
  set('--ss-muted', theme.muted || DEFAULT_THEME.muted);
  set('--ss-gold', theme.gold);
  set('--ss-glass', theme.glass || DEFAULT_THEME.glass);
  set('--ss-glass-border', theme.glassBorder || DEFAULT_THEME.glassBorder);
  set('--ss-wash-a', theme.washA);
  set('--ss-wash-b', theme.washB);
  set('--ss-wash-c', theme.washC);
  set('--ss-wash-d', theme.washD);
  set('--ss-header-wash', theme.headerWash);
  set('--ss-sidebar-wash', theme.sidebarWash);
  set('--ss-faith-wash', theme.faithWash || 'transparent');
  root.dataset.ssTheme = theme.key || 'default';
  root.dataset.ssFaith = theme.faithKey || 'secular';
}
