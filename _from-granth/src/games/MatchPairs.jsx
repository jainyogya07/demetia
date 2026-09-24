import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Clock, Zap, Trophy } from 'lucide-react';

/* ── NER-themed card data ─────────────────────────────────── */
const ALL_CARDS = [
  { id: 'gamosa', emoji: '🧣', label: 'Gamosa' },
  { id: 'tea', emoji: '🍵', label: 'Assam Tea' },
  { id: 'rice', emoji: '🍚', label: 'Rice' },
  { id: 'fish', emoji: '🐟', label: 'Fish' },
  { id: 'bamboo', emoji: '🎋', label: 'Bamboo' },
  { id: 'drum', emoji: '🪘', label: 'Dhol' },
  { id: 'flower', emoji: '🌺', label: 'Kopou Phool' },
  { id: 'lamp', emoji: '🪔', label: 'Diya' },
  { id: 'banana', emoji: '🍌', label: 'Banana Leaf' },
  { id: 'bird', emoji: '🕊️', label: 'Pigeon' },
  { id: 'lotus', emoji: '🪷', label: 'Lotus' },
  { id: 'mango', emoji: '🥭', label: 'Mango' },
];

const DIFFICULTIES = {
  easy: { pairs: 4, cols: 4, label: 'Easy (4 pairs)' },
  medium: { pairs: 6, cols: 4, label: 'Medium (6 pairs)' },
  hard: { pairs: 8, cols: 4, label: 'Hard (8 pairs)' },
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchPairs({ onBack }) {
  const [difficulty, setDifficulty] = useState('easy');
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const lockRef = useRef(false);
  const timerRef = useRef(null);

  const initGame = useCallback((diff) => {
    const config = DIFFICULTIES[diff];
    const picked = shuffle(ALL_CARDS).slice(0, config.pairs);
    const doubled = shuffle([...picked, ...picked].map((c, i) => ({ ...c, uid: `${c.id}-${i}` })));
    setCards(doubled);
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setStartTime(null);
    setElapsed(0);
    setFinished(false);
    setGameStarted(false);
    lockRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => { initGame(difficulty); }, [difficulty, initGame]);

  useEffect(() => {
    if (startTime && !finished) {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTime, finished]);

  const handleFlip = (uid) => {
    if (lockRef.current) return;
    if (flipped.includes(uid) || matched.has(uid)) return;

    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }

    const next = [...flipped, uid];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      lockRef.current = true;

      const [a, b] = next;
      const cardA = cards.find((c) => c.uid === a);
      const cardB = cards.find((c) => c.uid === b);

      if (cardA.id === cardB.id) {
        const newMatched = new Set(matched);
        newMatched.add(a);
        newMatched.add(b);
        setMatched(newMatched);
        setFlipped([]);
        lockRef.current = false;

        if (newMatched.size === cards.length) {
          setFinished(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          lockRef.current = false;
        }, 800);
      }
    }
  };

  const config = DIFFICULTIES[difficulty];
  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (finished) {
    const totalPairs = config.pairs;
    const accuracy = Math.round((totalPairs / moves) * 100);
    return (
      <div className="game-area">
        <div className="game-result">
          <div className="game-result-emoji">🎉</div>
          <h2>Well done!</h2>
          <p>You matched all {totalPairs} pairs. Great memory exercise!</p>
          <div className="game-result-stats">
            <div className="game-result-stat">
              <span>Moves</span>
              <strong>{moves}</strong>
            </div>
            <div className="game-result-stat">
              <span>Time</span>
              <strong>{formatTime(elapsed)}</strong>
            </div>
            <div className="game-result-stat">
              <span>Accuracy</span>
              <strong>{accuracy}%</strong>
            </div>
          </div>
          <div className="game-result-actions">
            <button type="button" className="game-btn-primary" onClick={() => initGame(difficulty)}>
              <RotateCcw size={15} /> Play Again
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
          🃏 Match the Pairs
        </h2>
        <div className="game-stats">
          <span className="game-stat-chip"><Zap size={14} /> {moves} moves</span>
          <span className="game-stat-chip"><Clock size={14} /> {formatTime(elapsed)}</span>
          <span className="game-stat-chip"><Trophy size={14} /> {matched.size / 2}/{config.pairs}</span>
        </div>
      </div>

      <div className="game-difficulty">
        {Object.entries(DIFFICULTIES).map(([key, val]) => (
          <button
            key={key}
            type="button"
            className={`game-diff-btn ${difficulty === key ? 'active' : ''}`}
            onClick={() => setDifficulty(key)}
          >
            {val.label}
          </button>
        ))}
      </div>

      <div className="game-area">
        <div className={`mp-grid cols-${config.cols}`} style={{ gridTemplateColumns: `repeat(${config.cols}, 1fr)` }}>
          {cards.map((card) => {
            const isFlipped = flipped.includes(card.uid);
            const isMatched = matched.has(card.uid);
            return (
              <div
                key={card.uid}
                className={`mp-card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
                onClick={() => handleFlip(card.uid)}
              >
                <div className="mp-card-inner">
                  <div className="mp-card-front" />
                  <div className="mp-card-back">
                    {card.emoji}
                    <span>{card.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
