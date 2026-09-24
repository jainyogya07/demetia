import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCcw, Clock, Eye, Lightbulb } from 'lucide-react';

/* ── Scene data — each scene is a canvas-drawn pair with differences ── */
const SCENES = [
  {
    id: 'kitchen',
    title: 'Assamese Kitchen',
    bg: '#f0ece4',
    // Objects: [x%, y%, w%, h%, color, label]
    objects: [
      { x: 8, y: 60, w: 18, h: 30, color: '#8B6914', shape: 'rect', label: 'Table' },
      { x: 30, y: 55, w: 12, h: 14, color: '#C0392B', shape: 'circle', label: 'Pot' },
      { x: 50, y: 45, w: 14, h: 20, color: '#5B7C6B', shape: 'rect', label: 'Shelf' },
      { x: 70, y: 50, w: 10, h: 12, color: '#E67E22', shape: 'circle', label: 'Bowl' },
      { x: 15, y: 20, w: 20, h: 15, color: '#3498DB', shape: 'rect', label: 'Window' },
      { x: 85, y: 65, w: 8, h: 22, color: '#7D6608', shape: 'rect', label: 'Broom' },
      { x: 60, y: 75, w: 10, h: 10, color: '#E74C3C', shape: 'circle', label: 'Apple' },
      { x: 42, y: 70, w: 12, h: 8, color: '#F39C12', shape: 'rect', label: 'Cutting Board' },
    ],
    // Differences: index of objects that are different in image B, with what changes
    differences: [
      { objIdx: 2, change: 'color', newColor: '#E67E22', hint: 'Look at the shelf!' },
      { objIdx: 4, change: 'missing', hint: 'Something is gone from the wall...' },
      { objIdx: 6, change: 'color', newColor: '#27AE60', hint: 'A fruit changed colour!' },
      { objIdx: 7, change: 'position', dx: 8, dy: -5, hint: 'Something moved on the counter.' },
    ],
  },
  {
    id: 'market',
    title: 'Village Market',
    bg: '#e8e0d0',
    objects: [
      { x: 5, y: 55, w: 22, h: 35, color: '#8E6B2D', shape: 'rect', label: 'Stall' },
      { x: 30, y: 60, w: 10, h: 10, color: '#E74C3C', shape: 'circle', label: 'Tomato' },
      { x: 42, y: 58, w: 10, h: 10, color: '#F1C40F', shape: 'circle', label: 'Lemon' },
      { x: 55, y: 50, w: 16, h: 25, color: '#5B7C6B', shape: 'rect', label: 'Vegetable Basket' },
      { x: 75, y: 55, w: 18, h: 30, color: '#C0392B', shape: 'rect', label: 'Cloth Stand' },
      { x: 20, y: 18, w: 55, h: 8, color: '#D4A017', shape: 'rect', label: 'Awning' },
      { x: 60, y: 75, w: 8, h: 8, color: '#2ECC71', shape: 'circle', label: 'Coconut' },
      { x: 10, y: 30, w: 6, h: 14, color: '#7D3C98', shape: 'rect', label: 'Pole' },
    ],
    differences: [
      { objIdx: 1, change: 'color', newColor: '#27AE60', hint: 'A vegetable changed colour!' },
      { objIdx: 3, change: 'color', newColor: '#C0392B', hint: 'Look at the basket...' },
      { objIdx: 6, change: 'missing', hint: 'Something disappeared from the ground!' },
      { objIdx: 5, change: 'color', newColor: '#3498DB', hint: 'The awning looks different.' },
    ],
  },
  {
    id: 'festival',
    title: 'Bihu Festival',
    bg: '#f5eed8',
    objects: [
      { x: 10, y: 40, w: 14, h: 28, color: '#E74C3C', shape: 'rect', label: 'Drum' },
      { x: 28, y: 35, w: 12, h: 18, color: '#F39C12', shape: 'rect', label: 'Flag' },
      { x: 45, y: 50, w: 16, h: 24, color: '#5B7C6B', shape: 'rect', label: 'Stage' },
      { x: 65, y: 45, w: 10, h: 10, color: '#9B59B6', shape: 'circle', label: 'Flower' },
      { x: 78, y: 42, w: 10, h: 10, color: '#E67E22', shape: 'circle', label: 'Lamp' },
      { x: 50, y: 15, w: 30, h: 10, color: '#F1C40F', shape: 'rect', label: 'Banner' },
      { x: 20, y: 72, w: 8, h: 8, color: '#2ECC71', shape: 'circle', label: 'Leaf' },
      { x: 85, y: 70, w: 10, h: 18, color: '#C0392B', shape: 'rect', label: 'Lantern' },
    ],
    differences: [
      { objIdx: 0, change: 'color', newColor: '#3498DB', hint: 'The drum looks different!' },
      { objIdx: 3, change: 'missing', hint: 'A flower has gone!' },
      { objIdx: 5, change: 'color', newColor: '#E74C3C', hint: 'The banner changed.' },
      { objIdx: 7, change: 'position', dx: -5, dy: 5, hint: 'Something moved at the edge.' },
    ],
  },
];

function drawScene(ctx, scene, isB = false, w, h) {
  // Background
  ctx.fillStyle = scene.bg;
  ctx.fillRect(0, 0, w, h);

  // Draw grid lines for texture
  ctx.strokeStyle = 'rgba(0,0,0,0.04)';
  ctx.lineWidth = 1;
  for (let i = 0; i < w; i += 30) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
  for (let i = 0; i < h; i += 30) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

  // Draw floor
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  ctx.fillRect(0, h * 0.85, w, h * 0.15);

  // Build diff lookup
  const diffMap = {};
  if (isB) {
    for (const d of scene.differences) {
      diffMap[d.objIdx] = d;
    }
  }

  scene.objects.forEach((obj, idx) => {
    const diff = diffMap[idx];
    if (diff && diff.change === 'missing') return; // skip in image B

    let { x, y } = obj;
    let color = obj.color;

    if (diff) {
      if (diff.change === 'color') color = diff.newColor;
      if (diff.change === 'position') {
        x = obj.x + diff.dx;
        y = obj.y + diff.dy;
      }
    }

    const px = (x / 100) * w;
    const py = (y / 100) * h;
    const pw = (obj.w / 100) * w;
    const ph = (obj.h / 100) * h;

    ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(0,0,0,0.12)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;

    if (obj.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(px + pw / 2, py + ph / 2, Math.min(pw, ph) / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.roundRect(px, py, pw, ph, 4);
      ctx.fill();
    }

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = `bold ${Math.max(10, w * 0.028)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(obj.label, px + pw / 2, py + ph + Math.max(12, h * 0.04));
  });
}

export default function SpotDifference({ onBack }) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [found, setFound] = useState(new Set());
  const [hintIdx, setHintIdx] = useState(-1);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [wrongMarker, setWrongMarker] = useState(null);

  const canvasARef = useRef(null);
  const canvasBRef = useRef(null);
  const timerRef = useRef(null);

  const scene = SCENES[sceneIdx];
  const totalDiffs = scene.differences.length;

  const drawBoth = useCallback(() => {
    const draw = (canvas, isB) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      drawScene(ctx, scene, isB, rect.width, rect.height);
    };
    draw(canvasARef.current, false);
    draw(canvasBRef.current, true);
  }, [scene]);

  useEffect(() => {
    drawBoth();
    const handleResize = () => drawBoth();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawBoth]);

  useEffect(() => {
    if (startTime && !finished) {
      timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTime, finished]);

  const checkClick = (e, canvasRef) => {
    if (finished) return;
    if (!startTime) setStartTime(Date.now());

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setMoves((m) => m + 1);

    let foundDiff = false;
    scene.differences.forEach((diff, dIdx) => {
      if (found.has(dIdx)) return;
      const obj = scene.objects[diff.objIdx];
      const cx = obj.x + obj.w / 2;
      const cy = obj.y + obj.h / 2;
      const radius = Math.max(obj.w, obj.h) * 0.8;
      const dist = Math.sqrt((clickX - cx) ** 2 + (clickY - cy) ** 2);
      if (dist <= radius) {
        const newFound = new Set(found);
        newFound.add(dIdx);
        setFound(newFound);
        setMarkers((prev) => [...prev, { x: clickX, y: clickY, id: dIdx }]);
        foundDiff = true;

        if (newFound.size === totalDiffs) {
          setFinished(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }
    });

    if (!foundDiff) {
      setWrongMarker({ x: clickX, y: clickY, id: Date.now() });
      setTimeout(() => setWrongMarker(null), 600);
    }
  };

  const resetGame = (newSceneIdx) => {
    setSceneIdx(newSceneIdx !== undefined ? newSceneIdx : sceneIdx);
    setFound(new Set());
    setHintIdx(-1);
    setMoves(0);
    setStartTime(null);
    setElapsed(0);
    setFinished(false);
    setMarkers([]);
    setWrongMarker(null);
  };

  const showHint = () => {
    const unfound = scene.differences.map((_, i) => i).filter((i) => !found.has(i));
    if (unfound.length > 0) setHintIdx(unfound[0]);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (finished) {
    return (
      <div className="game-area">
        <div className="game-result">
          <div className="game-result-emoji">🔎</div>
          <h2>All differences found!</h2>
          <p>Sharp eyes! You spotted all {totalDiffs} differences in the {scene.title} scene.</p>
          <div className="game-result-stats">
            <div className="game-result-stat">
              <span>Clicks</span>
              <strong>{moves}</strong>
            </div>
            <div className="game-result-stat">
              <span>Time</span>
              <strong>{formatTime(elapsed)}</strong>
            </div>
            <div className="game-result-stat">
              <span>Accuracy</span>
              <strong>{Math.round((totalDiffs / moves) * 100)}%</strong>
            </div>
          </div>
          <div className="game-result-actions">
            <button
              type="button"
              className="game-btn-primary"
              onClick={() => resetGame((sceneIdx + 1) % SCENES.length)}
            >
              <RotateCcw size={15} /> Next Scene
            </button>
            <button type="button" className="game-btn-secondary" onClick={onBack}>
              All Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ss-teal)', margin: 0 }}>
          🔍 Spot the Difference — {scene.title}
        </h2>
        <div className="game-stats">
          <span className="game-stat-chip"><Eye size={14} /> {found.size}/{totalDiffs}</span>
          <span className="game-stat-chip"><Clock size={14} /> {formatTime(elapsed)}</span>
        </div>
      </div>

      {/* Scene selector */}
      <div className="game-difficulty">
        {SCENES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`game-diff-btn ${sceneIdx === i ? 'active' : ''}`}
            onClick={() => resetGame(i)}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="game-area">
        <div className="sd-container">
          <p className="sd-scene-label">Tap on a difference in either image</p>

          <div className="sd-images">
            {/* Image A */}
            <div className="sd-image-wrap">
              <canvas ref={canvasARef} onClick={(e) => checkClick(e, canvasARef)} />
              {markers.map((m) => (
                <div key={m.id} className="sd-found-marker" style={{ left: `${m.x}%`, top: `${m.y}%` }} />
              ))}
            </div>

            {/* Image B */}
            <div className="sd-image-wrap">
              <canvas ref={canvasBRef} onClick={(e) => checkClick(e, canvasBRef)} />
              {markers.map((m) => (
                <div key={m.id} className="sd-found-marker" style={{ left: `${m.x}%`, top: `${m.y}%` }} />
              ))}
              {wrongMarker && (
                <div
                  className="sd-found-marker"
                  style={{
                    left: `${wrongMarker.x}%`,
                    top: `${wrongMarker.y}%`,
                    borderColor: '#E74C3C',
                    background: 'rgba(231, 76, 60, 0.15)',
                  }}
                />
              )}
            </div>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="sd-progress">
              {scene.differences.map((_, i) => (
                <div key={i} className={`sd-dot ${found.has(i) ? 'found' : ''}`} />
              ))}
            </div>
            <button type="button" className="sd-hint-btn" onClick={showHint}>
              <Lightbulb size={13} /> Hint
            </button>
          </div>

          {hintIdx >= 0 && !found.has(hintIdx) && (
            <p style={{ fontSize: 13, color: 'var(--ss-sage)', fontStyle: 'italic', margin: 0 }}>
              💡 {scene.differences[hintIdx].hint}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
