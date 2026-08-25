import React, { useCallback, useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';

const OBJECTS = [
  { id: 'kettle', emoji: '🫖', label: 'Kettle' },
  { id: 'glasses', emoji: '👓', label: 'Glasses' },
  { id: 'medicine', emoji: '💊', label: 'Medicine' },
  { id: 'keys', emoji: '🔑', label: 'Keys' },
  { id: 'slippers', emoji: '🩴', label: 'Slippers' },
  { id: 'umbrella', emoji: '☂️', label: 'Umbrella' },
  { id: 'cup', emoji: '🍵', label: 'Tea cup' },
  { id: 'radio', emoji: '📻', label: 'Radio' },
  { id: 'gamosa', emoji: '🧣', label: 'Gamosa' },
  { id: 'stick', emoji: '🦯', label: 'Walking stick' },
  { id: 'clock', emoji: '🕰️', label: 'Clock' },
  { id: 'frame', emoji: '🖼️', label: 'Photo frame' },
];

const ROUNDS = 8;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ObjectFind({ onBack }) {
  const [order, setOrder] = useState(() => shuffle(OBJECTS).slice(0, ROUNDS));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [miss, setMiss] = useState(null);
  const [finished, setFinished] = useState(false);
  const [layoutSeed, setLayoutSeed] = useState(0);

  const layout = useMemo(() => shuffle(OBJECTS), [layoutSeed, index]);
  const target = order[index];

  const reset = useCallback(() => {
    setOrder(shuffle(OBJECTS).slice(0, ROUNDS));
    setIndex(0);
    setScore(0);
    setMiss(null);
    setFinished(false);
    setLayoutSeed((s) => s + 1);
  }, []);

  const pick = (id) => {
    if (finished || !target) return;
    if (id !== target.id) {
      setMiss(id);
      setTimeout(() => setMiss(null), 450);
      return;
    }
    setScore((s) => s + 1);
    const next = index + 1;
    if (next >= order.length) {
      setFinished(true);
      return;
    }
    setIndex(next);
    setMiss(null);
  };

  if (finished) {
    return (
      <div className="game-area">
        <div className="game-result">
          <div className="game-result-emoji">🏠</div>
          <h2>You found them</h2>
          <p>Daily things around the house — kettle, keys, glasses — at an easy pace.</p>
          <div className="game-result-stats">
            <div className="game-result-stat">
              <span>Found</span>
              <strong>{score}/{ROUNDS}</strong>
            </div>
          </div>
          <div className="game-result-actions">
            <button type="button" className="game-btn-primary" onClick={reset}>
              <RotateCcw size={15} /> Play again
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
      <div className="game-inline-head">
        <h2>Find the object</h2>
        <div className="game-stats">
          <span className="game-stat-chip">{index + 1}/{ROUNDS}</span>
          <span className="game-stat-chip">{score} found</span>
        </div>
      </div>
      <p className="game-soft-lead">
        Look for the <strong>{target.label}</strong> on the table.
      </p>
      <div className="game-area find-board">
        <div className="find-grid">
          {layout.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`find-tile ${miss === item.id ? 'miss' : ''}`}
              onClick={() => pick(item.id)}
            >
              <span aria-hidden>{item.emoji}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
