// @ts-nocheck — leftover JS-shaped module; runtime unchanged
import React, { useState, useRef, useCallback } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import Aurora from '../../components/bits/Aurora';
import BlurText from '../../components/bits/BlurText';
import './RegionalGames.css';

/** TracingGame — Connect dots to trace traditional patterns */
export default function TracingGame({ data, onBack }) {
  const { title, subtitle, emoji, instruction, points, strokeColor, fillColor, bgColor } = data;
  const [currentDot, setCurrentDot] = useState(0);
  const [lines, setLines] = useState<unknown[]>([]);
  const [finished, setFinished] = useState(false);
  const canvasRef = useRef<any>(null);

  const handleDotClick = useCallback((index) => {
    if (finished) return;
    if (index !== currentDot) return; // Must click in order

    if (currentDot > 0) {
      setLines(prev => [...prev, { from: points[currentDot - 1], to: points[currentDot] }]);
    }

    const nextDot = currentDot + 1;
    if (nextDot >= points.length) {
      // Complete the shape
      setLines(prev => [...prev, { from: points[currentDot], to: points[0] }]);
      setFinished(true);
    }
    setCurrentDot(nextDot);
  }, [currentDot, finished, points]);

  const reset = () => {
    setCurrentDot(0);
    setLines([]);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="rg-engine">
        <div className="rg-complete">
          <div className="rg-complete-emoji">🎨</div>
          <BlurText text="Beautiful!" className="rg-complete-h3" delay={50} style={{ fontSize: '26px', fontWeight: 800, color: '#176b58', margin: 0 }} />
          <p>You traced the complete {title} pattern perfectly!</p>
          <Trophy size={48} color="#176b58" />
          <button className="rg-play-again" onClick={reset}><RotateCcw size={18} /> Play Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="rg-engine">
      <div className="rg-header">
        <div className="rg-header-emoji">{emoji}</div>
        <div className="rg-header-text">
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="rg-instruction">{instruction}</div>

      <div className="rg-trace-progress">
        Dot {Math.min(currentDot + 1, points.length)} of {points.length}
      </div>

      <div className="rg-trace-canvas-wrap" ref={canvasRef}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.6 }}>
          <Aurora colorStops={[strokeColor, fillColor, '#ffffff']} blend={0.5} amplitude={0.5} speed={0.5} />
        </div>
        {/* SVG Lines */}
        <svg
          className="rg-trace-canvas"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: 'relative', zIndex: 1 }}
        >
          {/* Completed lines */}
          {lines.map((line, i) => (
            <line
              key={i}
              x1={line.from.x} y1={line.from.y}
              x2={line.to.x} y2={line.to.y}
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.2))"
            />
          ))}

          {/* Guide lines (faint) */}
          {points.map((pt, i) => {
            if (i === 0) return null;
            const prev = points[i - 1];
            return (
              <line
                key={`guide-${i}`}
                x1={prev.x} y1={prev.y}
                x2={pt.x} y2={pt.y}
                stroke={strokeColor}
                strokeWidth="0.5"
                strokeDasharray="2,2"
                opacity="0.3"
              />
            );
          })}
        </svg>

        {/* Interactive dots */}
        {points.map((pt, i) => (
          <div
            key={i}
            className={`rg-trace-dot${i === currentDot ? ' is-active' : ''}${i < currentDot ? ' is-done' : ''}`}
            style={{
              left: `${pt.x}%`,
              top: `${pt.y}%`,
              background: i === currentDot ? strokeColor : (i < currentDot ? strokeColor : 'rgba(255,255,255,0.8)'),
              border: `2px solid ${strokeColor}`
            }}
            onClick={() => handleDotClick(i)}
          >
            {i === currentDot && (
              <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 12, color: '#fff', fontWeight: 800 }}>{i + 1}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
