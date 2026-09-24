/** Douglas-Peucker polyline simplify — runs in this Node process (no Rust required). */

function perpDist(p, a, b) {
  const x = p.lng - a.lng;
  const y = p.lat - a.lat;
  const dx = b.lng - a.lng;
  const dy = b.lat - a.lat;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(x, y);
  let t = (x * dx + y * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(a.lng + t * dx - p.lng, a.lat + t * dy - p.lat);
}

export function douglasPeucker(points, epsilon = 0.00012) {
  if (!Array.isArray(points) || points.length < 3) return Array.isArray(points) ? points : [];
  const rec = (pts) => {
    if (pts.length < 3) return pts;
    let maxD = 0;
    let idx = 0;
    const a = pts[0];
    const b = pts[pts.length - 1];
    for (let i = 1; i < pts.length - 1; i += 1) {
      const d = perpDist(pts[i], a, b);
      if (d > maxD) {
        maxD = d;
        idx = i;
      }
    }
    if (maxD > epsilon) {
      const left = rec(pts.slice(0, idx + 1));
      const right = rec(pts.slice(idx));
      return left.slice(0, -1).concat(right);
    }
    return [a, b];
  };
  return rec(points);
}

export function haversineM(a, b) {
  const R = 6371000;
  const toRad = (n) => (n * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

export function analyzeWandering(points, home, radiusM = 280) {
  const trail = Array.isArray(points) ? points.filter((p) => Number.isFinite(p?.lat) && Number.isFinite(p?.lng)) : [];
  const last = trail[trail.length - 1] || home;
  const dist = home ? Math.round(haversineM(last, home)) : 0;
  const inside = dist < radiusM;
  let headingDeg = 0;
  if (trail.length >= 2) {
    const a = trail[trail.length - 2];
    const b = trail[trail.length - 1];
    headingDeg = Math.round((Math.atan2(b.lng - a.lng, b.lat - a.lat) * 180) / Math.PI);
  }
  const watch = !inside && dist > radiusM * 1.15;
  return {
    distanceM: dist,
    inside,
    headingDeg,
    wanderingLevel: watch ? 'watch' : 'calm',
    wanderingLabel: watch ? 'A little farther than usual' : 'Gentle familiar walk',
    copy: watch
      ? 'Still on a known lane. Family can take a calm look — no alarm yet.'
      : 'We are with you on the walk. Home garden is close.',
    pointCount: trail.length,
  };
}
