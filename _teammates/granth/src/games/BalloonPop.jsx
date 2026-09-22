import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Clock, Star, Zap } from 'lucide-react';

/* ── NER items that can appear inside balloons ─────────────── */
const BALLOON_ITEMS = [
  { emoji: '🧣', label: 'Gamosa' },
  { emoji: '🍵', label: 'Assam Tea' },
  { emoji: '🪘', label: 'Dhol' },
  { emoji: '🌺', label: 'Kopou Phool' },
  { emoji: '🪔', label: 'Diya' },
  { emoji: '🍚', label: 'Rice' },
  { emoji: '🐟', label: 'Fish' },
  { emoji: '🎋', label: 'Bamboo' },
  { emoji: '🥭', label: 'Mango' },
  { emoji: '🪷', label: 'Lotus' },
  { emoji: '🕊️', label: 'Pigeon' },
  { emoji: '🌸', label: 'Flower' },
];

const COLORS = [0, 1, 2, 3, 4, 5];
const GAME_DURATION = 45; // seconds

function randomBetween(a, b) { return Math.random() * (b - a) + a; }

function createBalloon(id, skyWidth) {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const item = BALLOON_ITEMS[Math.floor(Math.random() * BALLOON_ITEMS.length)];
  return {
    id,
    x: randomBetween(8, 85),
    y: 105 + randomBetween(0, 20),
    speed: randomBetween(0.25, 0.55),
    wobbleAmp: randomBetween(0.3, 1.2),
    wobbleSpeed: randomBetween(0.01, 0.03),
    wobbleOffset: randomBetween(0, Math.PI * 2),
    color,
    item,
    popped: false,
    popTime: 0,
  };
}

export default function BalloonPop({ onBack }) {
  const [score, setScore] = useState(0);
  const [popped, setPopped] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState('ready'); // ready | playing | finished
  const [balloons, setBalloons] = useState([]);
  const [floatingScores, setFloatingScores] = useState([]);
  const [lastItem, setLastItem] = useState(null);

  const skyRef = useRef(null);
  const animRef = useRef(null);
  const balloonsRef = useRef([]);
  const nextIdRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const gameStateRef = useRef(gameState);

  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  const spawnBalloon = useCallback(() => {
    const b = createBalloon(nextIdRef.current++, 600);
    balloonsRef.current.push(b);
  }, []);

  const startGame = useCallback(() => {
    balloonsRef.current = [];
    nextIdRef.current = 0;
    lastSpawnRef.current = 0;
    setScore(0);
    setPopped(0);
    setTimeLeft(GAME_DURATION);
    setGameState('playing');
    setFloatingScores([]);
    setLastItem(null);

    // Spawn initial balloons
    for (let i = 0; i < 5; i++) {
      const b = createBalloon(nextIdRef.current++, 600);
      b.y = randomBetween(20, 90);
      balloonsRef.current.push(b);
    }
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let lastTime = performance.now();
    let timerAcc = 0;

    const loop = (now) => {
      if (gameStateRef.current !== 'playing') return;

      const dt = (now - lastTime) / 16.67; // normalize to ~60fps
      lastTime = now;
      timerAcc += now - lastTime;

      // Move balloons
      const bals = balloonsRef.current;
      for (const b of bals) {
        if (b.popped) continue;
        b.y -= b.speed * dt;
        b.x += Math.sin(now * b.wobbleSpeed + b.wobbleOffset) * b.wobbleAmp * 0.15;
      }

      // Remove off-screen or old popped balloons
      balloonsRef.current = bals.filter((b) => {
        if (b.popped && now - b.popTime > 400) return false;
        if (!b.popped && b.y < -10) return false;
        return true;
      });

      // Spawn new balloons periodically
      lastSpawnRef.current += dt;
      if (lastSpawnRef.current > 45) {
        spawnBalloon();
        lastSpawnRef.current = 0;
      }

      // Update state for render
      setBalloons([...balloonsRef.current]);

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [gameState, spawnBalloon]);

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameState('finished');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  const popBalloon = (id, e) => {
    e.stopPropagation();
    const b = balloonsRef.current.find((bl) => bl.id === id);
    if (!b || b.popped) return;

    b.popped = true;
    b.popTime = performance.now();

    const points = 10;
    setScore((s) => s + points);
    setPopped((p) => p + 1);
    setLastItem(b.item);

    // Show floating score
    const rect = skyRef.current.getBoundingClientRect();
    setFloatingScores((prev) => [
      ...prev.slice(-8),
      { id: Date.now(), x: b.x, y: b.y, text: `+${points}`, emoji: b.item.emoji },
    ]);

    setTimeout(() => {
      setFloatingScores((prev) => prev.filter((f) => f.id !== Date.now()));
    }, 900);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // Ready state
  if (gameState === 'ready') {
    return (
      <>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ss-teal)', margin: 0 }}>
          🎈 Balloon Pop
        </h2>
        <div className="game-area" style={{ textAlign: 'center' }}>
          <div style={{ maxWidth: 360 }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🎈</div>
            <h2 style={{ fontSize: 22, color: 'var(--ss-teal)', margin: '0 0 8px' }}>Ready to Pop?</h2>
            <p style={{ fontSize: 14, color: 'var(--ss-sage)', margin: '0 0 20px', lineHeight: 1.5 }}>
              Tap the balloons as they float up! Each one holds a surprise from the North-East.
              No wrong answers — just enjoy!
            </p>
            <button type="button" className="game-btn-primary" onClick={startGame}>
              Start Game — {GAME_DURATION}s
            </button>
          </div>
        </div>
      </>
    );
  }

  // Finished state
  if (gameState === 'finished') {
    return (
      <div className="game-area">
        <div className="game-result">
          <div className="game-result-emoji">🎉</div>
          <h2>Great popping!</h2>
          <p>You popped {popped} balloons and scored {score} points!</p>
          <div className="game-result-stats">
            <div className="game-result-stat">
              <span>Score</span>
              <strong>{score}</strong>
            </div>
            <div className="game-result-stat">
              <span>Popped</span>
              <strong>{popped}</strong>
            </div>
            <div className="game-result-stat">
              <span>Per Second</span>
              <strong>{(popped / GAME_DURATION).toFixed(1)}</strong>
            </div>
          </div>
          <div className="game-result-actions">
            <button type="button" className="game-btn-primary" onClick={startGame}>
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

  // Playing state
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ss-teal)', margin: 0 }}>
          🎈 Balloon Pop
        </h2>
        <div className="game-stats">
          <span className="game-stat-chip"><Star size={14} /> {score} pts</span>
          <span className="game-stat-chip"><Zap size={14} /> {popped} popped</span>
          <span className="game-stat-chip" style={timeLeft <= 10 ? { color: '#E74C3C', borderColor: '#E74C3C' } : {}}>
            <Clock size={14} /> {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {lastItem && (
        <div style={{
          textAlign: 'center',
          fontSize: 13,
          color: 'var(--ss-sage)',
          fontWeight: 650,
          padding: '4px 0',
        }}>
          {lastItem.emoji} {lastItem.label}
        </div>
      )}

      <div className="game-area" style={{ padding: 0, overflow: 'hidden', borderRadius: 18 }}>
        <div className="bp-sky" ref={skyRef}>
          {/* Clouds */}
          <div className="bp-cloud c1" />
          <div className="bp-cloud c2" />
          <div className="bp-cloud c3" />

          {/* Balloons */}
          {balloons.map((b) => (
            <div
              key={b.id}
              className={`bp-balloon ${b.popped ? 'bp-pop' : ''}`}
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={(e) => popBalloon(b.id, e)}
            >
              <div className={`bp-balloon-body bp-color-${b.color}`}>
                {b.item.emoji}
              </div>
              {!b.popped && <div className="bp-balloon-string" />}
            </div>
          ))}

          {/* Floating scores */}
          {floatingScores.map((f) => (
            <div
              key={f.id}
              className="bp-score-float"
              style={{ left: `${f.x}%`, top: `${f.y}%` }}
            >
              {f.emoji} +10
            </div>
          ))}

          {/* Ground */}
          <div className="bp-ground" />
        </div>
      </div>
    </>
  );
}
