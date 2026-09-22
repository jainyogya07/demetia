import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Eraser, RotateCcw, Undo2, Volume2 } from 'lucide-react';
import { useI18n } from '../I18nContext';
import { useGameSpeech } from '../hooks/useGameSpeech';
import {
  SHAPE_DRAW_CATALOG,
  SHAPE_DRAW_SESSION_SIZE,
  SHAPE_VIEWBOX,
  pickSessionShapes,
} from '../data/shapeDrawCatalog';
import {
  feedbackForScore,
  loadShapeDrawSession,
  saveShapeDrawSession,
  scoreShapeDrawing,
} from '../lib/shapeDrawScore';
import { applyDrawingResultToAssessment } from '../lib/assessmentStore';
import './ShapeDraw.css';

const INK = 'rgba(23, 107, 88, 0.92)';
const INK_WIDTH = 5;

function shapeLabel(shape, lang, t) {
  if (!shape) return '';
  const translated = t(shape.nameKey);
  if (translated && translated !== shape.nameKey) return translated;
  return lang === 'hi' ? shape.nameHi : shape.nameEn;
}

function feedbackText(fb, lang, t) {
  if (!fb) return '';
  const translated = t(fb.key);
  if (translated && translated !== fb.key) return translated;
  return lang === 'hi' ? fb.hi : fb.en;
}

export default function ShapeDraw({ onBack }) {
  const { t, lang } = useI18n();
  const { speak, stop: stopSpeech } = useGameSpeech({ lang });
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const strokesRef = useRef([]);
  const currentStrokeRef = useRef(null);

  const [phase, setPhase] = useState('ready'); // ready | draw | scored | done
  const [session, setSession] = useState([]);
  const [index, setIndex] = useState(0);
  const [strokes, setStrokes] = useState([]);
  const [lastScore, setLastScore] = useState(null);
  const [scores, setScores] = useState([]);
  const [lastSession, setLastSession] = useState(() => loadShapeDrawSession());

  const shape = session[index] || null;

  const redraw = useCallback((nextStrokes) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    ctx.clearRect(0, 0, cssW, cssH);

    // Soft guide: faint template
    if (shape?.path) {
      const pad = 0.08;
      const ox = cssW * pad;
      const oy = cssH * pad;
      const scale = Math.min(cssW, cssH) * (1 - 2 * pad) / SHAPE_VIEWBOX;
      ctx.save();
      ctx.translate(ox, oy);
      ctx.scale(scale, scale);
      const path = new Path2D(shape.path);
      ctx.strokeStyle = 'rgba(23, 107, 88, 0.14)';
      ctx.lineWidth = 3 / scale;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke(path);
      ctx.restore();
    }

    ctx.strokeStyle = INK;
    ctx.lineWidth = INK_WIDTH;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const list = nextStrokes || strokesRef.current;
    for (let s = 0; s < list.length; s += 1) {
      const stroke = list[s];
      if (!stroke?.length) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i += 1) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    }
  }, [shape]);

  useEffect(() => {
    strokesRef.current = strokes;
    redraw(strokes);
  }, [strokes, redraw, phase, index]);

  useEffect(() => {
    const onResize = () => redraw(strokesRef.current);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [redraw]);

  useEffect(() => () => stopSpeech(), [stopSpeech]);

  const pointerPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const onPointerDown = (e) => {
    if (phase !== 'draw') return;
    e.preventDefault();
    const p = pointerPos(e);
    if (!p) return;
    canvasRef.current?.setPointerCapture?.(e.pointerId);
    drawingRef.current = true;
    currentStrokeRef.current = [p];
    const next = [...strokesRef.current, currentStrokeRef.current];
    strokesRef.current = next;
    setStrokes(next);
  };

  const onPointerMove = (e) => {
    if (!drawingRef.current || phase !== 'draw') return;
    e.preventDefault();
    const p = pointerPos(e);
    if (!p || !currentStrokeRef.current) return;
    currentStrokeRef.current.push(p);
    redraw(strokesRef.current);
  };

  const endStroke = (e) => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    currentStrokeRef.current = null;
    try {
      canvasRef.current?.releasePointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }
    setStrokes([...strokesRef.current]);
  };

  const clearCanvas = () => {
    strokesRef.current = [];
    currentStrokeRef.current = null;
    setStrokes([]);
    setLastScore(null);
    if (phase === 'scored') setPhase('draw');
  };

  const undoStroke = () => {
    const next = strokesRef.current.slice(0, -1);
    strokesRef.current = next;
    setStrokes(next);
    setLastScore(null);
    if (phase === 'scored') setPhase('draw');
  };

  const startSession = () => {
    stopSpeech();
    const picked = pickSessionShapes(SHAPE_DRAW_SESSION_SIZE);
    setSession(picked);
    setIndex(0);
    setScores([]);
    setLastScore(null);
    strokesRef.current = [];
    setStrokes([]);
    setPhase('draw');
    const first = picked[0];
    if (first) {
      const name = shapeLabel(first, lang, t);
      const prompt = lang === 'hi'
        ? `${name} बनाइए। आराम से, धीरे।`
        : `Please draw a ${name}. Take your time.`;
      speak(prompt);
    }
  };

  const hearPrompt = () => {
    if (!shape) return;
    const name = shapeLabel(shape, lang, t);
    const prompt = lang === 'hi'
      ? `यह ${name} है। कृपया इसे बड़ी जगह पर बनाइए।`
      : `This is a ${name}. Please draw it on the big area.`;
    speak(prompt);
  };

  const submitDrawing = () => {
    if (!shape || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const result = scoreShapeDrawing({
      path: shape.path,
      strokes: strokesRef.current,
      canvasWidth: canvas.clientWidth,
      canvasHeight: canvas.clientHeight,
    });
    setLastScore(result);
    setPhase('scored');
    speak(feedbackText(result.feedback, lang, t));
  };

  const goNext = () => {
    if (!shape || !lastScore) return;
    const entry = {
      shapeId: shape.id,
      score: lastScore.score,
      band: lastScore.feedback?.band,
    };
    const nextScores = [...scores, entry];
    setScores(nextScores);

    if (index + 1 >= session.length) {
      finishSession(nextScores);
      return;
    }

    setIndex(index + 1);
    strokesRef.current = [];
    setStrokes([]);
    setLastScore(null);
    setPhase('draw');
    const nextShape = session[index + 1];
    const name = shapeLabel(nextShape, lang, t);
    speak(lang === 'hi' ? `अगला — ${name} बनाइए।` : `Next — please draw a ${name}.`);
  };

  const finishSession = (finalScores) => {
    const avg = finalScores.length
      ? Math.round(finalScores.reduce((s, r) => s + r.score, 0) / finalScores.length)
      : 0;
    const payload = {
      averageScore: avg,
      shapeCount: finalScores.length,
      scores: finalScores,
      completedAt: new Date().toISOString(),
      feedback: feedbackForScore(avg),
    };
    saveShapeDrawSession(payload);
    setLastSession(payload);
    applyDrawingResultToAssessment(payload, 'aita');
    setPhase('done');
    speak(feedbackText(payload.feedback, lang, t));
  };

  if (phase === 'ready') {
    return (
      <div className="game-area sd-shell">
        <div className="game-inline-head">
          <h2>{t('shapeDraw.title')}</h2>
        </div>
        <p className="game-soft-lead">{t('shapeDraw.lead')}</p>
        {lastSession?.averageScore != null && (
          <p className="sd-last">
            {t('shapeDraw.lastScore', { score: lastSession.averageScore })}
          </p>
        )}
        <div className="sd-preview-row" aria-hidden>
          {SHAPE_DRAW_CATALOG.slice(0, 6).map((s) => (
            <svg key={s.id} viewBox={`0 0 ${SHAPE_VIEWBOX} ${SHAPE_VIEWBOX}`} className="sd-mini">
              <path d={s.path} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ))}
        </div>
        <button type="button" className="game-btn-primary sd-start" onClick={startSession}>
          {t('shapeDraw.start')}
        </button>
        <p className="sd-hint">{t('shapeDraw.sessionHint', { count: SHAPE_DRAW_SESSION_SIZE })}</p>
      </div>
    );
  }

  if (phase === 'done') {
    const avg = lastSession?.averageScore ?? 0;
    const fb = lastSession?.feedback || feedbackForScore(avg);
    return (
      <div className="game-area">
        <div className="game-result">
          <div className="game-result-emoji" aria-hidden>🌿</div>
          <h2>{t('shapeDraw.sessionDone')}</h2>
          <p>{feedbackText(fb, lang, t)}</p>
          <div className="game-result-stats">
            <div className="game-result-stat">
              <span>{t('shapeDraw.avgAccuracy')}</span>
              <strong>{avg}%</strong>
            </div>
            <div className="game-result-stat">
              <span>{t('shapeDraw.shapesDone')}</span>
              <strong>
                {lastSession?.shapeCount ?? scores.length}
                /
                {session.length || SHAPE_DRAW_SESSION_SIZE}
              </strong>
            </div>
          </div>
          <div className="game-result-actions">
            <button type="button" className="game-btn-primary" onClick={startSession}>
              <RotateCcw size={15} /> {t('shapeDraw.playAgain')}
            </button>
            <button type="button" className="game-btn-secondary" onClick={onBack}>
              {t('shapeDraw.allGames')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressLabel = `${index + 1} / ${session.length}`;

  return (
    <div className="sd-play">
      <div className="game-inline-head">
        <h2>{t('shapeDraw.title')}</h2>
        <div className="game-stats">
          <span className="game-stat-chip">{progressLabel}</span>
          {lastScore && (
            <span className="game-stat-chip sd-score-chip">{lastScore.score}%</span>
          )}
        </div>
      </div>

      <div className="sd-prompt-row">
        <div className="sd-target" aria-hidden>
          {shape && (
            <svg viewBox={`0 0 ${SHAPE_VIEWBOX} ${SHAPE_VIEWBOX}`}>
              <path
                d={shape.path}
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <div className="sd-prompt-copy">
          <p className="sd-shape-name">{shapeLabel(shape, lang, t)}</p>
          <p className="game-soft-lead sd-instruction">
            {phase === 'scored'
              ? feedbackText(lastScore?.feedback, lang, t)
              : t('shapeDraw.drawPrompt')}
          </p>
          <button type="button" className="sd-hear" onClick={hearPrompt}>
            <Volume2 size={16} /> {t('shapeDraw.hear')}
          </button>
        </div>
      </div>

      <div className="sd-canvas-wrap">
        <canvas
          ref={canvasRef}
          className="sd-canvas"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
          onPointerLeave={endStroke}
        />
      </div>

      <div className="sd-toolbar">
        <button type="button" className="sd-tool" onClick={undoStroke} disabled={!strokes.length}>
          <Undo2 size={18} /> {t('shapeDraw.undo')}
        </button>
        <button type="button" className="sd-tool" onClick={clearCanvas} disabled={!strokes.length}>
          <Eraser size={18} /> {t('shapeDraw.clear')}
        </button>
        {phase === 'draw' ? (
          <button
            type="button"
            className="game-btn-primary sd-done"
            onClick={submitDrawing}
            disabled={strokes.length === 0}
          >
            <Check size={16} /> {t('shapeDraw.check')}
          </button>
        ) : (
          <button type="button" className="game-btn-primary sd-done" onClick={goNext}>
            {index + 1 >= session.length ? t('shapeDraw.finish') : t('shapeDraw.next')}
          </button>
        )}
      </div>
    </div>
  );
}
