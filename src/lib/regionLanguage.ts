import { normalizeLang } from '../i18n';

const REGION_LANGUAGE_MAP = {
  Assam: 'as',
  'Arunachal Pradesh': 'en',
  Manipur: 'mni',
  Meghalaya: 'kha',
  Mizoram: 'lus',
  Nagaland: 'en',
  Tripura: 'bn',
  Sikkim: 'en',
  Delhi: 'hi',
  'New Delhi': 'hi',
  'Uttar Pradesh': 'hi',
  Bihar: 'hi',
  'West Bengal': 'bn',
  'Tamil Nadu': 'ta',
  Telangana: 'te',
  'Andhra Pradesh': 'te',
  Maharashtra: 'mr',
  Gujarat: 'gu',
  Karnataka: 'kn',
  Kerala: 'ml',
  Punjab: 'pa',
};

export function languageForRegion(region) {
  if (!region) return null;
  if (REGION_LANGUAGE_MAP[region]) return REGION_LANGUAGE_MAP[region];
  const hit = Object.keys(REGION_LANGUAGE_MAP).find((state) =>
    region.toLowerCase().includes(state.toLowerCase()),
  );
  return hit ? REGION_LANGUAGE_MAP[hit] : null;
}

function placeFromGeo(data) {
  const region = data.principalSubdivision || '';
  const city = data.city || data.locality || data.localityName || '';
  const unique = [...new Set([city, region].filter(Boolean))];
  return {
    city,
    region,
    place: unique.join(', ') || region || city || '',
  };
}

export async function detectIndianRegion() {
  if (typeof navigator === 'undefined' || !navigator.geolocation) return null;
  const coords = await new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 8000, maximumAge: 300000 },
    );
  });
  if (!coords) return null;
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.lat}&longitude=${coords.lng}&localityLanguage=en`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    const found = placeFromGeo(data);
    try {
      if (found.region) localStorage.setItem('smriti-region', found.region);
      if (found.city) localStorage.setItem('smriti-city', found.city);
      if (found.place) localStorage.setItem('smriti-place', found.place);
    } catch {
      /* ignore */
    }
    return found.place || found.region || null;
  } catch {
    return null;
  }
}

export async function detectAndResolveLang() {
  const region = await detectIndianRegion();
  let code = languageForRegion(region);
  if (!code && typeof navigator !== 'undefined') {
    const nav = String(navigator.language || navigator.userLanguage || '').toLowerCase();
    if (nav.startsWith('hi')) code = 'hi';
    else if (nav.startsWith('as')) code = 'as';
    else if (nav.startsWith('bn')) code = 'bn';
    else if (nav.startsWith('ta')) code = 'ta';
    else if (nav.startsWith('te')) code = 'te';
    else if (nav.startsWith('mni') || nav.includes('manipuri')) code = 'mni';
  }
  return code ? { region: region || 'browser', lang: normalizeLang(code) } : { region, lang: null };
}
