import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Clock } from 'lucide-react';

const ITEMS = [
  { id: 'tea', emoji: '🍵', label: 'Tea' },
  { id: 'lamp', emoji: '🪔', label: 'Lamp' },
  { id: 'drum', emoji: '🪘', label: 'Dhol' },
  { id: 'keys', emoji: '🔑', label: 'Keys' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SequenceMemory({ onBack }) {
  const [phase, setPhase] = useState('ready');
  const [sequence, setSequence] = useState([]);
  const [inputIndex, setInputIndex] = useState(0);
  const [lit, setLit] = useState(null);
  const [round, setRound] = useState(1);
  const [lives, setLives] = useState(3);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const playRef = useRef(false);
  const timerRef = useRef(null);

  const totalRounds = 5;

  useEffect(() => {
    if (startTime && phase !== 'won' && phase !== 'lost') {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTime, phase]);

  const playSequence = useCallback(async (seq) => {
    playRef.current = true;
    setPhase('watch');
    setLit(null);
    await new Promise((r) => setTimeout(r, 400));
    for (let i = 0; i < seq.length; i++) {
      if (!playRef.current) return;
      setLit(seq[i]);
      await new Promise((r) => setTimeout(r, 700));
      setLit(null);
      await new Promise((r) => setTimeout(r, 220));
    }
    setPhase('repeat');
    setInputIndex(0);
  }, []);

  const beginRound = useCallback((nextRound, existing = []) => {
    const nextItem = ITEMS[Math.floor(Math.random() * ITEMS.length)].id;
    const seq = nextRound === 1 ? shuffle(ITEMS).slice(0, 3).map((x) => x.id) : [...existing, nextItem];
    setSequence(seq);
    setRound(nextRound);
    playSequence(seq);
  }, [playSequence]);

  const startGame = () => {
    playRef.current = false;
    setLives(3);
    setElapsed(0);
    setStartTime(Date.now());
    beginRound(1);
  };

  const handleTap = (id) => {
    if (phase !== 'repeat') return;
    const expected = sequence[inputIndex];
    if (id !== expected) {
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        setPhase('lost');
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }
      setPhase('watch');
      playSequence(sequence);
      return;
    }
    const next = inputIndex + 1;
    setLit(id);
    setTimeout(() => setLit(null), 180);
    if (next >= sequence.length) {
      if (round >= totalRounds) {
        setPhase('won');
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }
      beginRound(round + 1, sequence);
      return;
    }
    setInputIndex(next);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (phase === 'won' || phase === 'lost') {
    return (
      <div className="game-area">
        <div className="game-result">
          <div className="game-result-emoji">{phase === 'won' ? '🌿' : '🕯️'}</div>
          <h2>{phase === 'won' ? 'You remembered the order' : 'That sequence slipped'}</h2>
          <p>
            {phase === 'won'
              ? `Five rounds, up to ${sequence.length} steps. Quiet, steady work.`
              : 'No hurry. Watch once more when you are ready.'}
          </p>
          <div className="game-result-stats">
            <div className="game-result-stat">
              <span>Round</span>
              <strong>{Math.min(round, totalRounds)}/{totalRounds}</strong>
            </div>
            <div className="game-result-stat">
              <span>Time</span>
              <strong>{formatTime(elapsed)}</strong>
            </div>
          </div>
          <div className="game-result-actions">
            <button type="button" className="game-btn-primary" onClick={startGame}>
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
        <h2>Sequence recall</h2>
        <div className="game-stats">
          <span className="game-stat-chip">Round {phase === 'ready' ? 0 : round}/{totalRounds}</span>
          <span className="game-stat-chip">{lives} tries left</span>
          <span className="game-stat-chip"><Clock size={14} /> {formatTime(elapsed)}</span>
        </div>
      </div>
      <p className="game-soft-lead">
        {phase === 'ready' && 'Watch the order, then tap the same objects. Short sequences, unhurried.'}
        {phase === 'watch' && 'Watch the order. Do not tap yet.'}
        {phase === 'repeat' && 'Now tap in the same order.'}
      </p>
      {phase === 'ready' ? (
        <div className="game-area">
          <button type="button" className="game-btn-primary" onClick={startGame}>Start</button>
        </div>
      ) : (
        <div className="game-area seq-board">
          <div className="seq-grid">
            {ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`seq-tile ${lit === item.id ? 'lit' : ''}`}
                onClick={() => handleTap(item.id)}
                disabled={phase !== 'repeat'}
              >
                <span aria-hidden>{item.emoji}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
