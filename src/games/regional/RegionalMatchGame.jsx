import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Trophy, Clock } from 'lucide-react';
import SpotlightCard from '../../components/bits/SpotlightCard';
import BlurText from '../../components/bits/BlurText';
import './RegionalGames.css';

/** RegionalMatchGame — Flip-card memory matching with regional themes */
export default function RegionalMatchGame({ data, onBack }) {
  const { title, subtitle, emoji, instruction, pairs, bgColor } = data;
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const lockRef = useRef(false);
  const timerRef = useRef(null);

  const initGame = useCallback(() => {
    const doubled = shuffle([...pairs, ...pairs].map((p, i) => ({ ...p, uid: `${p.id}-${i}` })));
    setCards(doubled);
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setStartTime(null);
    setElapsed(0);
    setFinished(false);
    lockRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
  }, [pairs]);

  useEffect(() => { initGame(); }, [initGame]);

  useEffect(() => {
    if (startTime && !finished) {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTime, finished]);

  const handleFlip = (uid) => {
    if (lockRef.current || flipped.includes(uid) || matched.has(uid)) return;

    if (!startTime) setStartTime(Date.now());

    const newFlipped = [...flipped, uid];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      lockRef.current = true;
      const [a, b] = newFlipped;
      const cardA = cards.find(c => c.uid === a);
      const cardB = cards.find(c => c.uid === b);

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

  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (finished) {
    return (
      <div className="rg-engine">
        <div className="rg-complete">
          <div className="rg-complete-emoji">🎊</div>
          <BlurText text="All Matched!" className="rg-complete-h3" delay={50} style={{ fontSize: '26px', fontWeight: 800, color: '#176b58', margin: 0 }} />
          <p>{moves} moves in {fmtTime(elapsed)}</p>
          <Trophy size={48} color="#176b58" />
          <button className="rg-play-again" onClick={initGame}><RotateCcw size={18} /> Play Again</button>
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

      <div className="rg-score-bar">
        <span>🃏 {moves} moves</span>
        <span><Clock size={14} /> {fmtTime(elapsed)}</span>
        <span>✅ {matched.size / 2} / {pairs.length}</span>
      </div>

      <div className="rg-match-grid">
        {cards.map(card => {
          const isFlipped = flipped.includes(card.uid) || matched.has(card.uid);
          const isMatched = matched.has(card.uid);
          return (
            <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.4)" key={card.uid} className="rg-match-card-wrapper" style={{ padding: 0, borderRadius: 20 }}>
              <button
                className={`rg-match-card${isFlipped ? ' is-flipped' : ''}${isMatched ? ' is-matched' : ''}`}
                onClick={() => handleFlip(card.uid)}
                disabled={isMatched}
                style={{ width: '100%', height: '100%' }}
              >
                <div className="rg-match-card-inner">
                  <div className="rg-match-card-face rg-match-card-back">🌿</div>
                  <div className="rg-match-card-face rg-match-card-front">
                    <span style={{ fontSize: 36 }}>{card.emoji}</span>
                  </div>
                </div>
              </button>
            </SpotlightCard>
          );
        })}
      </div>
    </div>
  );
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
