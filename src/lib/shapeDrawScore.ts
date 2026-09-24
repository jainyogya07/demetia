/**
 * Client-side shape drawing accuracy (no ML / no backend).
 *
 * Method:
 * 1. Rasterise the template path and the patient's strokes onto offscreen masks
 *    (generous stroke width for tremor / shaky hands).
 * 2. Sample points along both polylines.
 * 3. Combine:
 *    - coverage (template points near patient stroke) — recall
 *    - precision (patient points near template)
 *    - mask IoU of dilated outlines
 * into a 0–100 score with dementia-friendly banding + calm feedback.
 */

import { SHAPE_VIEWBOX } from '../data/shapeDrawCatalog';

const MASK_SIZE = 128;
const TEMPLATE_LINE = 7;
const DRAW_LINE = 6;
const MATCH_PX = 14; // in mask space (~generous for elderly tremor)

/**
 * @typedef {{ x: number, y: number }} Point
 * @typedef {Point[]} Stroke
 */

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

function dist(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

/** Flatten strokes → points (skip near-duplicates). */
export function flattenStrokes(strokes, minGap = 2) {
  const out = [];
  for (let s = 0; s < (strokes || []).length; s += 1) {
    const stroke = strokes[s] || [];
    for (let i = 0; i < stroke.length; i += 1) {
      const p = stroke[i];
      if (!p) continue;
      const last = out[out.length - 1];
      if (!last || dist(last, p) >= minGap) out.push({ x: p.x, y: p.y });
    }
  }
  return out;
}

/** Sample points evenly along an SVG path in viewBox coords. */
export function samplePathPoints(pathD, count = 96) {
  if (typeof document === 'undefined') return [];
  const svgNS = 'http://www.w3.org/2000/svg';
  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', pathD);
  let len = 0;
  try {
    len = path.getTotalLength();
  } catch {
    return [];
  }
  if (!Number.isFinite(len) || len <= 0) return [];
  const pts = [];
  const n = Math.max(8, count);
  for (let i = 0; i < n; i += 1) {
    const t = (i / (n - 1)) * len;
    const p = path.getPointAtLength(t);
    pts.push({ x: p.x, y: p.y });
  }
  return pts;
}

function canvasPointToViewBox(p, canvasW, canvasH) {
  const pad = 0.08;
  const usableW = canvasW * (1 - 2 * pad);
  const usableH = canvasH * (1 - 2 * pad);
  const ox = canvasW * pad;
  const oy = canvasH * pad;
  return {
    x: ((p.x - ox) / usableW) * SHAPE_VIEWBOX,
    y: ((p.y - oy) / usableH) * SHAPE_VIEWBOX,
  };
}

function viewBoxToMask(p) {
  return {
    x: (p.x / SHAPE_VIEWBOX) * MASK_SIZE,
    y: (p.y / SHAPE_VIEWBOX) * MASK_SIZE,
  };
}

function makeMask() {
  const c = document.createElement('canvas');
  c.width = MASK_SIZE;
  c.height = MASK_SIZE;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.clearRect(0, 0, MASK_SIZE, MASK_SIZE);
  return { canvas: c, ctx };
}

function strokePolyline(ctx, points, lineWidth) {
  if (!points.length) return;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

function drawTemplateMask(pathD) {
  const { canvas, ctx } = makeMask();
  const scale = MASK_SIZE / SHAPE_VIEWBOX;
  ctx.save();
  ctx.scale(scale, scale);
  const path = new Path2D(pathD);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = TEMPLATE_LINE / scale;
  ctx.stroke(path);
  ctx.restore();
  return ctx.getImageData(0, 0, MASK_SIZE, MASK_SIZE);
}

function drawUserMask(strokesVb) {
  const { ctx } = makeMask();
  const scale = MASK_SIZE / SHAPE_VIEWBOX;
  ctx.save();
  ctx.scale(scale, scale);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = DRAW_LINE / scale;
  for (let s = 0; s < strokesVb.length; s += 1) {
    const stroke = strokesVb[s];
    if (!stroke?.length) continue;
    ctx.beginPath();
    ctx.moveTo(stroke[0].x, stroke[0].y);
    for (let i = 1; i < stroke.length; i += 1) {
      ctx.lineTo(stroke[i].x, stroke[i].y);
    }
    ctx.stroke();
  }
  ctx.restore();
  return ctx.getImageData(0, 0, MASK_SIZE, MASK_SIZE);
}

function maskIoU(a, b) {
  let inter = 0;
  let uni = 0;
  const da = a.data;
  const db = b.data;
  for (let i = 3; i < da.length; i += 4) {
    const pa = da[i] > 20;
    const pb = db[i] > 20;
    if (pa || pb) uni += 1;
    if (pa && pb) inter += 1;
  }
  if (uni === 0) return 0;
  return inter / uni;
}

function nearestFraction(fromPts, toPts, threshold) {
  if (!fromPts.length || !toPts.length) return 0;
  let hit = 0;
  for (let i = 0; i < fromPts.length; i += 1) {
    const p = fromPts[i];
    let best = Infinity;
    for (let j = 0; j < toPts.length; j += 1) {
      const d = dist(p, toPts[j]);
      if (d < best) best = d;
      if (best <= threshold) break;
    }
    if (best <= threshold) hit += 1;
  }
  return hit / fromPts.length;
}

function meanHausdorffApprox(a, b) {
  if (!a.length || !b.length) return 999;
  const directed = (from, to) => {
    let sum = 0;
    for (let i = 0; i < from.length; i += 1) {
      let best = Infinity;
      for (let j = 0; j < to.length; j += 1) {
        const d = dist(from[i], to[j]);
        if (d < best) best = d;
      }
      sum += best;
    }
    return sum / from.length;
  };
  return (directed(a, b) + directed(b, a)) / 2;
}

/**
 * Map accuracy % → calm, non-shaming feedback keys / English fallbacks.
 */
export function feedbackForScore(score) {
  const s = Number(score) || 0;
  if (s >= 85) {
    return {
      key: 'shapeDraw.feedback.excellent',
      en: 'Well done — that looks lovely.',
      hi: 'बहुत अच्छा — बहुत सुंदर बना।',
      band: 'excellent',
    };
  }
  if (s >= 65) {
    return {
      key: 'shapeDraw.feedback.good',
      en: 'Nice work — you traced it well.',
      hi: 'अच्छा प्रयास — आकार ठीक बना।',
      band: 'good',
    };
  }
  if (s >= 40) {
    return {
      key: 'shapeDraw.feedback.close',
      en: 'Close — try a little slower next time.',
      hi: 'क़रीब हैं — अगली बार थोड़ा धीरे बनाइए।',
      band: 'close',
    };
  }
  return {
    key: 'shapeDraw.feedback.gentle',
    en: 'That was a good try. We can practise again gently.',
    hi: 'अच्छा प्रयास रहा। आराम से फिर अभ्यास कर सकते हैं।',
    band: 'gentle',
  };
}

/**
 * Score a drawing against a catalogue shape.
 *
 * @param {{
 *   path: string,
 *   strokes: Stroke[],
 *   canvasWidth: number,
 *   canvasHeight: number,
 * }} opts
 * @returns {{
 *   score: number,
 *   coverage: number,
 *   precision: number,
 *   iou: number,
 *   feedback: ReturnType<typeof feedbackForScore>,
 *   empty: boolean,
 * }}
 */
export function scoreShapeDrawing({ path, strokes, canvasWidth, canvasHeight }) {
  const emptyResult = {
    score: 0,
    coverage: 0,
    precision: 0,
    iou: 0,
    feedback: feedbackForScore(0),
    empty: true,
  };

  if (typeof document === 'undefined' || !path) return emptyResult;

  const w = Math.max(1, canvasWidth || 1);
  const h = Math.max(1, canvasHeight || 1);

  const strokesVb = (strokes || [])
    .map((stroke) =>
      (stroke || []).map((p) => canvasPointToViewBox(p, w, h)),
    )
    .filter((s) => s.length > 0);

  const userPts = flattenStrokes(strokesVb, 3);
  if (userPts.length < 6) {
    return { ...emptyResult, feedback: feedbackForScore(5) };
  }

  const templatePts = samplePathPoints(path, 100);
  if (!templatePts.length) return emptyResult;

  const templateMask = drawTemplateMask(path);
  const userMask = drawUserMask(strokesVb);
  const iou = maskIoU(templateMask, userMask);

  const templateMaskPts = templatePts.map(viewBoxToMask);
  const userMaskPts = userPts.map(viewBoxToMask);

  const coverage = nearestFraction(templateMaskPts, userMaskPts, MATCH_PX);
  const precision = nearestFraction(userMaskPts, templateMaskPts, MATCH_PX);
  const haus = meanHausdorffApprox(templateMaskPts, userMaskPts);
  const hausScore = clamp01(1 - haus / 40);

  // Weighted blend — coverage matters most (did they cover the shape?),
  // precision second (not too much scribble), IoU + Hausdorff refine.
  const raw =
    coverage * 0.42 +
    precision * 0.28 +
    iou * 0.18 +
    hausScore * 0.12;

  // Soft curve: elderly drawings rarely hit 100; lift mid-band gently.
  const lifted = Math.pow(clamp01(raw), 0.85);
  const score = Math.round(clamp01(lifted) * 100);

  return {
    score,
    coverage: Math.round(coverage * 100),
    precision: Math.round(precision * 100),
    iou: Math.round(iou * 100),
    feedback: feedbackForScore(score),
    empty: false,
  };
}

const STORAGE_KEY = 'smritiSaarthiShapeDrawLast';

export function saveShapeDrawSession(result) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch {
    /* ignore */
  }
}

export function loadShapeDrawSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
