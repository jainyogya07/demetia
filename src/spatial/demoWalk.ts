/**
 * Filmable spatial demo walks — Assam (Guwahati) and Delhi.
 * No API keys. City is shared across map, 360, metrics, and Safety.
 */

import type { DemoCity, DemoHome, LatLng } from '../types/app';

function offsetMetres(lat: number, lng: number, northM: number, eastM: number) {
  const dLat = northM / 111320;
  const dLng = eastM / (111320 * Math.cos((lat * Math.PI) / 180));
  return { lat: lat + dLat, lng: lng + dLng };
}

export function haversineM(a: LatLng, b: LatLng) {
  const toRad = (n) => (n * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export function bearingDeg(from: LatLng, to: LatLng) {
  const toRad = (n) => (n * Math.PI) / 180;
  const y = Math.sin(toRad(to.lng - from.lng)) * Math.cos(toRad(to.lat));
  const x =
    Math.cos(toRad(from.lat)) * Math.sin(toRad(to.lat)) -
    Math.sin(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.cos(toRad(to.lng - from.lng));
  return (Math.atan2(y, x) * 180) / Math.PI;
}

export function cardinalFromHeading(deg: number) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const i = Math.round((((deg % 360) + 360) % 360) / 45) % 8;
  return dirs[i];
}

function densify(points: LatLng[], perSeg = 8) {
  const out: LatLng[] = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    for (let s = 0; s < perSeg; s += 1) {
      const t = s / perSeg;
      out.push({
        lat: a.lat + (b.lat - a.lat) * t,
        lng: a.lng + (b.lng - a.lng) * t,
        name: t < 0.5 ? a.name : b.name,
      });
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

function polygonFromOffsets(home: DemoHome, ring: [number, number][]): [number, number][] {
  return ring.map(([n, e]) => {
    const p = offsetMetres(home.lat, home.lng, n, e);
    return [p.lat, p.lng];
  });
}

function pathFromScript(home: DemoHome, script: { n: number; e: number; name: string }[]) {
  return densify(
    script.map((p) => ({
      ...offsetMetres(home.lat, home.lng, p.n, p.e),
      name: p.name,
    })),
    10,
  );
}

function placesFromHome(
  home: DemoHome,
  extras: Array<{ id: string; name: string; n: number; e: number; radius: number; familiarity: string }>,
) {
  return [
    {
      id: 'place_home',
      name: 'Home',
      lat: home.lat,
      lng: home.lng,
      radius: home.radiusM,
      familiarity: 'High',
    },
    ...extras.map((p) => ({
      ...p,
      ...offsetMetres(home.lat, home.lng, p.n, p.e),
    })),
  ];
}

const ASSAM_HOME_DEF: DemoHome = {
  lat: 26.16952,
  lng: 91.76785,
  label: 'Home — Zoo Road, Guwahati',
  area: 'Kamrup Metropolitan, Assam',
  radiusM: 280,
};

const DELHI_HOME_DEF: DemoHome = {
  lat: 28.59155,
  lng: 77.22105,
  label: 'Home — Lodhi Colony, Delhi',
  area: 'South Delhi',
  radiusM: 280,
};

const ASSAM_SCRIPT = [
  { n: 0, e: 0, name: 'Home garden' },
  { n: 40, e: 18, name: 'Front gate' },
  { n: 95, e: 42, name: 'Zoo Road' },
  { n: 150, e: 70, name: 'Zoo Road' },
  { n: 175, e: 130, name: 'Neighbour lane' },
  { n: 140, e: 190, name: 'Tea stall' },
  { n: 90, e: 230, name: 'Park edge' },
  { n: 35, e: 250, name: 'Park path' },
  { n: -40, e: 220, name: 'Near the gate' },
  { n: -95, e: 175, name: 'Quiet lane' },
  { n: -160, e: 110, name: 'Toward the river' },
  { n: -210, e: 40, name: 'A little farther' },
  { n: -250, e: -20, name: 'A little farther' },
  { n: -220, e: -90, name: 'Turning back' },
  { n: -150, e: -140, name: 'Familiar lane' },
  { n: -70, e: -160, name: 'Temple road' },
  { n: 10, e: -145, name: 'Temple road' },
  { n: 80, e: -90, name: 'Back toward Home' },
  { n: 40, e: -30, name: 'Home lane' },
  { n: 8, e: 6, name: 'Home garden' },
];

const DELHI_SCRIPT = [
  { n: 0, e: 0, name: 'Home garden' },
  { n: 42, e: 20, name: 'Front gate' },
  { n: 95, e: 55, name: 'Lodhi Road' },
  { n: 160, e: 85, name: 'Garden gate' },
  { n: 220, e: 40, name: 'Park path' },
  { n: 250, e: -35, name: 'Rose garden' },
  { n: 200, e: -115, name: 'Tomb path' },
  { n: 120, e: -165, name: 'Shady avenue' },
  { n: 40, e: -195, name: 'Quiet lane' },
  { n: -50, e: -170, name: 'Colony lane' },
  { n: -110, e: -95, name: 'Neighbour street' },
  { n: -185, e: -20, name: 'A little farther' },
  { n: -310, e: 45, name: 'A little farther' },
  { n: -240, e: 120, name: 'Turning back' },
  { n: -130, e: 175, name: 'Market edge' },
  { n: -40, e: 195, name: 'Lodhi Road' },
  { n: 55, e: 150, name: 'Back toward Home' },
  { n: 85, e: 70, name: 'Home lane' },
  { n: 18, e: 16, name: 'Home garden' },
];

export const DEMO_CITIES: DemoCity[] = [
  {
    id: 'assam',
    shortLabel: 'Assam',
    cityLabel: 'Guwahati',
    liveChip: 'Live simulation · Assam',
    viewerTitle: 'Simulation · 360° · Assam',
    panoCaption: 'Assam · Wikimedia street photosphere',
    weather: 'Soft Assam day',
    eveningFeel: 'Calm',
    safetyIntro: 'Home garden on Zoo Road, Guwahati. Demo walk plays a gentle loop for filming; GPS is optional.',
    mapAria: 'Map of Home and the demo walk in Guwahati',
    durationMs: 75000,
    theme: 'assam',
    copyInside: 'Still close to Home on Zoo Road. Family can see this walk.',
    home: ASSAM_HOME_DEF,
    polygon: polygonFromOffsets(ASSAM_HOME_DEF, [
      [200, -140],
      [220, 70],
      [110, 210],
      [-70, 175],
      [-165, 30],
      [-150, -150],
      [-20, -200],
    ]),
    path: pathFromScript(ASSAM_HOME_DEF, ASSAM_SCRIPT),
    places: placesFromHome(ASSAM_HOME_DEF, [
      { id: 'place_park', name: 'Morning Park', n: 95, e: 235, radius: 90, familiarity: 'High' },
      { id: 'place_temple', name: 'Neighbourhood temple', n: 9, e: -150, radius: 70, familiarity: 'High' },
      { id: 'place_clinic', name: 'Clinic lane', n: -156, e: 44, radius: 60, familiarity: 'Medium' },
    ]),
  },
  {
    id: 'delhi',
    shortLabel: 'Delhi',
    cityLabel: 'Delhi',
    liveChip: 'Live simulation · Delhi',
    viewerTitle: 'Simulation · 360° · Delhi',
    panoCaption: 'Delhi · Wikimedia garden photosphere',
    weather: 'Soft Delhi evening',
    eveningFeel: 'Calm',
    safetyIntro: 'Home garden by Lodhi Garden, South Delhi. Demo walk plays a gentle loop for filming; GPS is optional.',
    mapAria: 'Map of Home and the demo walk in Delhi',
    durationMs: 80000,
    theme: 'delhi',
    copyInside: 'Still close to Home near Lodhi Garden. Family can see this walk.',
    home: DELHI_HOME_DEF,
    polygon: polygonFromOffsets(DELHI_HOME_DEF, [
      [190, -130],
      [210, 80],
      [100, 200],
      [-80, 165],
      [-170, 25],
      [-145, -145],
      [-15, -195],
    ]),
    path: pathFromScript(DELHI_HOME_DEF, DELHI_SCRIPT),
    places: placesFromHome(DELHI_HOME_DEF, [
      { id: 'place_park', name: 'Lodhi Garden', n: 230, e: -20, radius: 110, familiarity: 'High' },
      { id: 'place_temple', name: 'Tomb path', n: 185, e: -120, radius: 70, familiarity: 'High' },
      { id: 'place_clinic', name: 'Market edge', n: -125, e: 170, radius: 60, familiarity: 'Medium' },
    ]),
  },
];

export const DEFAULT_DEMO_CITY_ID = 'assam';

const CITY_KEY = 'ss-spatial-demo-city';
const cityListeners = new Set<(city: DemoCity) => void>();

function readStoredCityId() {
  try {
    const v = localStorage.getItem(CITY_KEY);
    if (DEMO_CITIES.some((c) => c.id === v)) return v;
  } catch {
    /* ignore */
  }
  return DEFAULT_DEMO_CITY_ID;
}

let activeCityId = readStoredCityId();

export function getDemoCity(id = activeCityId): DemoCity {
  return DEMO_CITIES.find((c) => c.id === id) || DEMO_CITIES[0];
}

export function getActiveDemoCityId() {
  return activeCityId;
}

export function getActiveDemoCity() {
  return getDemoCity(activeCityId);
}

export function subscribeDemoCity(callback: (city: DemoCity) => void) {
  cityListeners.add(callback);
  return () => {
    cityListeners.delete(callback);
  };
}

export function setActiveDemoCityId(id: string) {
  const next = getDemoCity(id);
  if (!next || next.id === activeCityId) return next;
  activeCityId = next.id;
  try {
    localStorage.setItem(CITY_KEY, activeCityId);
  } catch {
    /* ignore */
  }
  cityListeners.forEach((fn) => fn(next));
  return next;
}

/** Backward-compatible Assam aliases (default city). */
export const ASSAM_HOME = ASSAM_HOME_DEF;
export const HOME_POLYGON = DEMO_CITIES[0].polygon;
export const DEMO_PATH = DEMO_CITIES[0].path;
export const DEMO_DURATION_MS = DEMO_CITIES[0].durationMs;
export const ASSAM_FAMILIAR_PLACES = DEMO_CITIES[0].places;

export function sampleDemoWalk(progress01: number, city = getActiveDemoCity()) {
  const path = city.path;
  const t = ((progress01 % 1) + 1) % 1;
  const max = path.length - 1;
  const f = t * max;
  const i = Math.min(Math.floor(f), max - 1);
  const frac = f - i;
  const a = path[i];
  const b = path[i + 1] || a;
  const lat = a.lat + (b.lat - a.lat) * frac;
  const lng = a.lng + (b.lng - a.lng) * frac;
  const heading = bearingDeg(a, b);
  return { lat, lng, heading, place: frac < 0.5 ? a.name : b.name, index: i };
}

export function trailUpTo(progress01: number, city = getActiveDemoCity(), maxPoints = 48) {
  const path = city.path;
  const t = ((progress01 % 1) + 1) % 1;
  const end = Math.max(1, Math.floor(t * (path.length - 1)));
  const step = Math.max(1, Math.floor(end / maxPoints));
  const pts: LatLng[] = [];
  for (let i = 0; i <= end; i += step) pts.push(path[i]);
  pts.push(path[end]);
  return pts;
}

export function pointInPolygon(lat: number, lng: number, ring: [number, number][]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const yi = ring[i][0];
    const xi = ring[i][1];
    const yj = ring[j][0];
    const xj = ring[j][1];
    const intersect = yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi + 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function computeSpatialMetrics(
  sample: { lat: number; lng: number; heading: number; place?: string },
  trail: LatLng[],
  city = getActiveDemoCity(),
) {
  const home = city.home;
  const dist = haversineM(sample, home);
  const inPoly = pointInPolygon(sample.lat, sample.lng, city.polygon);
  const inside = inPoly || dist <= home.radiusM;
  const headings: number[] = [];
  for (let i = 1; i < Math.min(trail.length, 16); i += 1) {
    headings.push(bearingDeg(trail[i - 1], trail[i]));
  }
  const headingSpread = headings.length > 2 ? Math.max(...headings) - Math.min(...headings) : 0;

  let zoneLabel = 'Inside the Home garden';
  let copy = city.copyInside;
  let wanderingLabel = 'Calm';
  let wanderingLevel = 'low';
  let familiarity = 92;

  if (!inside) {
    zoneLabel = 'A little beyond the usual garden';
    copy = 'A little farther than the usual Home walk. Family can see the way back.';
    wanderingLabel = 'Gentle watch';
    wanderingLevel = 'watch';
    familiarity = 38;
  } else if (dist > home.radiusM * 0.62) {
    zoneLabel = 'Near the garden edge';
    copy = 'Near the usual turning point. Home is still close.';
    wanderingLabel = 'Settled';
    wanderingLevel = 'low';
    familiarity = 71;
  }

  const trajectory = headingSpread > 90 ? 'Looping near Home' : 'Along a known lane';
  const gait = inside ? 0.86 : 0.94;
  const headingCardinal = cardinalFromHeading(sample.heading);
  const lastSeen = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    distanceM: Math.round(dist),
    inside,
    zoneLabel,
    copy,
    wanderingLabel,
    wanderingLevel,
    familiarity,
    trajectory,
    gaitMs: gait,
    headingDeg: Math.round(((sample.heading % 360) + 360) % 360),
    headingCardinal,
    lastSeen,
    place: sample.place,
    predicted: headingCardinal,
  };
}
