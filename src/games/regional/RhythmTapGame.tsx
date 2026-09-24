// @ts-nocheck — leftover JS-shaped module; runtime unchanged
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import Particles from '../../components/bits/Particles';
import BlurText from '../../components/bits/BlurText';
import './RegionalGames.css';

/** RhythmTapGame — Tap in time with falling beat notes */
export default function RhythmTapGame({ data, onBack }) {
  const { title, subtitle, emoji, instruction, bpm, pattern, beatEmoji, missEmoji, accentColor, bgColor } = data;
  const [gameState, setGameState] = useState('ready'); // ready | playing | finished
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [misses, setMisses] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [feedback, setFeedback] = useState('');
  const [hitFlash, setHitFlash] = useState(false);
  const totalBeats = pattern.filter(b => b === 1).length;
  const beatInterval = (60 / bpm) * 1000;
  const timerRef = useRef<any>(null);
  const beatIndexRef = useRef(0);
  const windowRef = useRef(false);

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setMisses(0);
    setCurrentBeat(-1);
    setFeedback('');
    beatIndexRef.current = 0;
    windowRef.current = false;
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;
    timerRef.current = setInterval(() => {
      const idx = beatIndexRef.current;
      if (idx >= pattern.length) {
        clearInterval(timerRef.current);
        setGameState('finished');
        return;
      }
      setCurrentBeat(idx);
      windowRef.current = pattern[idx] === 1;
      if (pattern[idx] === 1) {
        // Auto-miss if not tapped within the window
        setTimeout(() => {
          if (windowRef.current) {
            windowRef.current = false;
            setMisses(m => m + 1);
            setCombo(0);
            setFeedback(missEmoji + ' Miss');
            setTimeout(() => setFeedback(''), 400);
          }
        }, beatInterval * 0.8);
      }
      beatIndexRef.current = idx + 1;
    }, beatInterval);

    return () => clearInterval(timerRef.current);
  }, [gameState, pattern, beatInterval, missEmoji]);

  const handleTap = useCallback(() => {
    if (gameState === 'ready') { startGame(); return; }
    if (gameState !== 'playing') return;

    if (windowRef.current) {
      windowRef.current = false;
      setScore(s => s + 1);
      setCombo(c => {
        const nc = c + 1;
        setMaxCombo(m => Math.max(m, nc));
        return nc;
      });
      setFeedback('🎯 Perfect!');
      setHitFlash(true);
      setTimeout(() => { setHitFlash(false); setFeedback(''); }, 300);
    } else {
      setMisses(m => m + 1);
      setCombo(0);
      setFeedback('😅 Off-beat');
      setTimeout(() => setFeedback(''), 400);
    }
  }, [gameState, startGame]);

  const reset = () => {
    clearInterval(timerRef.current);
    setGameState('ready');
    setCurrentBeat(-1);
    beatIndexRef.current = 0;
  };

  if (gameState === 'finished') {
    const pct = Math.round((score / totalBeats) * 100);
    return (
      <div className="rg-engine">
        <div className="rg-complete">
          <div className="rg-complete-emoji">{pct >= 70 ? '🌟' : '👏'}</div>
          <BlurText text={pct >= 70 ? 'Amazing Rhythm!' : 'Good Effort!'} className="rg-complete-h3" delay={50} style={{ fontSize: '26px', fontWeight: 800, color: '#176b58', margin: 0 }} />
          <p>{score} / {totalBeats} beats hit · Best combo: {maxCombo}x</p>
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

      {gameState === 'playing' && (
        <div className="rg-score-bar">
          <span>🎯 {score}</span>
          <span>🔥 {combo}x</span>
          <span>Beat {Math.min(beatIndexRef.current, pattern.length)}/{pattern.length}</span>
        </div>
      )}

      <div className="rg-rhythm-area">
        {/* Visual beat indicator */}
        <div className="rg-rhythm-track" style={{ borderColor: accentColor }}>
          <Particles
            particleColors={['#ffffff', accentColor]}
            particleCount={hitFlash ? 80 : 30}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            alphaParticles={true}
            disableRotation={false}
          />
          <div className="rg-rhythm-lane">
            {gameState === 'playing' && currentBeat >= 0 && pattern[currentBeat] === 1 && (
              <div className="rg-rhythm-note" style={{ top: '30%', fontSize: '48px' }}>{beatEmoji}</div>
            )}
          </div>
          <div className={`rg-rhythm-hitzone${hitFlash ? ' is-hit' : ''}`} style={{ borderColor: accentColor }}>
            {beatEmoji}
          </div>
        </div>

        <div className="rg-rhythm-feedback" style={{ color: accentColor }}>{feedback}</div>

        <button
          className="rg-tap-btn"
          style={{ background: accentColor, color: '#fff' }}
          onClick={handleTap}
        >
          {gameState === 'ready' ? '▶️' : beatEmoji}
        </button>

        {gameState === 'ready' && (
          <p style={{ fontSize: 14, color: '#60716b', textAlign: 'center', fontWeight: 600, background: 'rgba(255,255,255,0.4)', padding: '6px 12px', borderRadius: 20 }}>Tap the button to start!</p>
        )}
      </div>
    </div>
  );
}
