/**
 * Shape Draw catalogue — normalised templates in a 200×200 viewBox.
 * Paths are closed outlines (or open for arc) centred for elderly drawing practice.
 */

function regularPolygon(sides, cx, cy, r, rotation = -Math.PI / 2) {
  const pts = [];
  for (let i = 0; i < sides; i += 1) {
    const a = rotation + (i * 2 * Math.PI) / sides;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}

function pointsToPath(pts, close = true) {
  if (!pts.length) return '';
  const [x0, y0] = pts[0];
  let d = `M ${x0.toFixed(2)} ${y0.toFixed(2)}`;
  for (let i = 1; i < pts.length; i += 1) {
    d += ` L ${pts[i][0].toFixed(2)} ${pts[i][1].toFixed(2)}`;
  }
  return close ? `${d} Z` : d;
}

function starPoints(cx, cy, outerR, innerR, points = 5) {
  const pts = [];
  const step = Math.PI / points;
  let angle = -Math.PI / 2;
  for (let i = 0; i < points * 2; i += 1) {
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    angle += step;
  }
  return pts;
}

/** Heart as cubic Bézier outline (classic cardioid-ish). */
const HEART_PATH =
  'M 100 168 C 40 118, 28 72, 62 48 C 82 34, 100 48, 100 68 C 100 48, 118 34, 138 48 C 172 72, 160 118, 100 168 Z';

/**
 * @typedef {'closed' | 'open'} ShapeKind
 * @typedef {{
 *   id: string,
 *   nameKey: string,
 *   nameEn: string,
 *   nameHi: string,
 *   path: string,
 *   kind: ShapeKind,
 *   difficulty: 'easy' | 'medium',
 * }} ShapeDef
 */

/** @type {ShapeDef[]} */
export const SHAPE_DRAW_CATALOG = [
  {
    id: 'circle',
    nameKey: 'shapeDraw.shapes.circle',
    nameEn: 'Circle',
    nameHi: 'वृत्त',
    path: 'M 100 30 A 70 70 0 1 1 99.9 30 Z',
    kind: 'closed',
    difficulty: 'easy',
  },
  {
    id: 'square',
    nameKey: 'shapeDraw.shapes.square',
    nameEn: 'Square',
    nameHi: 'वर्ग',
    path: pointsToPath([
      [45, 45],
      [155, 45],
      [155, 155],
      [45, 155],
    ]),
    kind: 'closed',
    difficulty: 'easy',
  },
  {
    id: 'triangle',
    nameKey: 'shapeDraw.shapes.triangle',
    nameEn: 'Triangle',
    nameHi: 'त्रिभुज',
    path: pointsToPath([
      [100, 32],
      [168, 162],
      [32, 162],
    ]),
    kind: 'closed',
    difficulty: 'easy',
  },
  {
    id: 'rectangle',
    nameKey: 'shapeDraw.shapes.rectangle',
    nameEn: 'Rectangle',
    nameHi: 'आयत',
    path: pointsToPath([
      [30, 55],
      [170, 55],
      [170, 145],
      [30, 145],
    ]),
    kind: 'closed',
    difficulty: 'easy',
  },
  {
    id: 'diamond',
    nameKey: 'shapeDraw.shapes.diamond',
    nameEn: 'Diamond',
    nameHi: 'हीरा',
    path: pointsToPath([
      [100, 28],
      [172, 100],
      [100, 172],
      [28, 100],
    ]),
    kind: 'closed',
    difficulty: 'easy',
  },
  {
    id: 'pentagon',
    nameKey: 'shapeDraw.shapes.pentagon',
    nameEn: 'Pentagon',
    nameHi: 'पंचभुज',
    path: pointsToPath(regularPolygon(5, 100, 105, 72)),
    kind: 'closed',
    difficulty: 'medium',
  },
  {
    id: 'hexagon',
    nameKey: 'shapeDraw.shapes.hexagon',
    nameEn: 'Hexagon',
    nameHi: 'षट्भुज',
    path: pointsToPath(regularPolygon(6, 100, 100, 72, 0)),
    kind: 'closed',
    difficulty: 'medium',
  },
  {
    id: 'star',
    nameKey: 'shapeDraw.shapes.star',
    nameEn: 'Star',
    nameHi: 'तारा',
    path: pointsToPath(starPoints(100, 105, 74, 30, 5)),
    kind: 'closed',
    difficulty: 'medium',
  },
  {
    id: 'heart',
    nameKey: 'shapeDraw.shapes.heart',
    nameEn: 'Heart',
    nameHi: 'दिल',
    path: HEART_PATH,
    kind: 'closed',
    difficulty: 'medium',
  },
  {
    id: 'oval',
    nameKey: 'shapeDraw.shapes.oval',
    nameEn: 'Oval',
    nameHi: 'अंडाकार',
    path: 'M 100 40 A 55 70 0 1 1 99.9 40 Z',
    kind: 'closed',
    difficulty: 'easy',
  },
  {
    id: 'cross',
    nameKey: 'shapeDraw.shapes.cross',
    nameEn: 'Cross',
    nameHi: 'क्रॉस',
    path: pointsToPath([
      [80, 30],
      [120, 30],
      [120, 80],
      [170, 80],
      [170, 120],
      [120, 120],
      [120, 170],
      [80, 170],
      [80, 120],
      [30, 120],
      [30, 80],
      [80, 80],
    ]),
    kind: 'closed',
    difficulty: 'medium',
  },
  {
    id: 'semicircle',
    nameKey: 'shapeDraw.shapes.semicircle',
    nameEn: 'Semicircle',
    nameHi: 'अर्धवृत्त',
    // Arc over diameter — open outline (patients draw the curve + base)
    path: 'M 30 130 A 70 70 0 0 1 170 130 L 30 130',
    kind: 'open',
    difficulty: 'medium',
  },
];

export const SHAPE_DRAW_SESSION_SIZE = 10;

export function getShapeById(id) {
  return SHAPE_DRAW_CATALOG.find((s) => s.id === id) || null;
}

/** Shuffle and take up to `count` shapes (default full session of 10). */
export function pickSessionShapes(count = SHAPE_DRAW_SESSION_SIZE, seedList = SHAPE_DRAW_CATALOG) {
  const pool = [...seedList];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}

export const SHAPE_VIEWBOX = 200;
