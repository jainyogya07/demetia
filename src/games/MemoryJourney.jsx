import React, { useState, useEffect, useRef, useCallback } from 'react';
import './MemoryJourney.css';

/**
 * Default route for the "Morning Walk Memory Journey".
 * Swap this in via the `journey` prop for other sessions (e.g. "Evening Market Walk").
 *
 * Each stop supports an optional `image` (url) — if you have the illustrated
 * icons already used elsewhere in the app (like the house art in your
 * screenshot), drop the path in here and it will be used instead of the
 * emoji fallback.
 */
const DEFAULT_JOURNEY = [
  { id: 1, landmark: 'Local Shop', icon: '🏪', direction: 'straight', instruction: 'Walk straight towards the Local Shop.' },
  { id: 2, landmark: 'Neighbourhood House', icon: '🏠', direction: 'left', instruction: 'Turn left towards the Neighbourhood House.' },
  { id: 3, landmark: 'Community Park', icon: '🌳', direction: 'right', instruction: 'Turn right towards the Community Park.' },
  { id: 4, landmark: 'Hanuman Temple', icon: '🛕', direction: 'straight', instruction: 'Walk straight towards the Hanuman Temple.' },
  { id: 5, landmark: 'Back Home', icon: '🏡', direction: 'left', instruction: 'Turn left to head back home.' },
];

const LANE_OFFSET = { left: -1, straight: 0, right: 1 };
const DIRECTION_LABEL = { left: '← Going Left', straight: '↑ Going Straight', right: '→ Going Right' };

/** Speak a line with the Web Speech API, falling back gracefully if it isn't available. */
function speak(text, onEnd) {
  try {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    if (onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    if (onEnd) onEnd();
  }
}

function stopSpeaking() {
  try {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  } catch (err) {
    /* no-op */
  }
}

export default function MemoryJourney({
  journey = DEFAULT_JOURNEY,
  sessionTitle = 'Morning Walk Memory Journey',
  mode = 'Practice',
  onExit,
}) {
  const [screen, setScreen] = useState('intro'); // intro | instructions | playing | complete
  const [stepIndex, setStepIndex] = useState(0);
  const [lane, setLane] = useState(0); // -1 left, 0 center, 1 right
  const [phase, setPhase] = useState('idle'); // idle | correct | incorrect
  const [lastDirection, setLastDirection] = useState(null);
  const [visited, setVisited] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const timeoutRef = useRef(null);

  const totalSteps = journey.length;
  const currentStep = journey[stepIndex];

  const readInstruction = useCallback((text) => {
    setIsSpeaking(true);
    speak(text, () => setIsSpeaking(false));
  }, []);

  // Clean up any pending timers / speech on unmount.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      stopSpeaking();
    };
  }, []);

  // Read the welcome line once we land on the instructions screen.
  useEffect(() => {
    if (screen === 'instructions') {
      readInstruction('Welcome. Listen carefully and remember the places you see along the way.');
    }
  }, [screen, readInstruction]);

  // Read each step's instruction as it becomes current.
  useEffect(() => {
    if (screen === 'playing' && currentStep) {
      readInstruction(currentStep.instruction);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, stepIndex]);

  const goToScreen = (next) => {
    stopSpeaking();
    setScreen(next);
  };

  const handleDirection = (dir) => {
    if (phase !== 'idle' || screen !== 'playing') return; // ignore input mid-animation

    setLastDirection(dir);
    setLane(LANE_OFFSET[dir]);

    const isCorrect = dir === currentStep.direction;
    setPhase(isCorrect ? 'correct' : 'incorrect');
    speak(isCorrect ? 'Well done.' : "Let's try that again.");

    timeoutRef.current = setTimeout(() => {
      setLane(0);
      setPhase('idle');

      if (isCorrect) {
        setVisited((prev) => [...prev, currentStep.landmark]);
        if (stepIndex + 1 < totalSteps) {
          setStepIndex((i) => i + 1);
        } else {
          setScreen('complete');
        }
      }
    }, 1200);
  };

  // Optional keyboard support (arrow keys) alongside the on-screen buttons.
  useEffect(() => {
    if (screen !== 'playing') return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handleDirection('left');
      else if (e.key === 'ArrowRight') handleDirection('right');
      else if (e.key === 'ArrowUp') handleDirection('straight');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, phase, stepIndex]);

  const handleExit = () => {
    stopSpeaking();
    if (onExit) onExit();
    else setScreen('intro');
  };

  const handleRestart = () => {
    setStepIndex(0);
    setLane(0);
    setPhase('idle');
    setLastDirection(null);
    setVisited([]);
    goToScreen('intro');
  };

  return (
    <div className="mj-page">
      {screen === 'intro' && (
        <IntroCard sessionTitle={sessionTitle} onStart={() => goToScreen('instructions')} onExit={handleExit} />
      )}

      {screen === 'instructions' && (
        <InstructionsCard
          isSpeaking={isSpeaking}
          onReady={() => goToScreen('playing')}
          onHearAgain={() =>
            readInstruction('Welcome. Listen carefully and remember the places you see along the way.')
          }
        />
      )}

      {screen === 'playing' && currentStep && (
        <GameCard
          mode={mode}
          journey={journey}
          stepIndex={stepIndex}
          currentStep={currentStep}
          totalSteps={totalSteps}
          lane={lane}
          phase={phase}
          lastDirection={lastDirection}
          visited={visited}
          isSpeaking={isSpeaking}
          onDirection={handleDirection}
          onHearAgain={() => readInstruction(currentStep.instruction)}
        />
      )}

      {screen === 'complete' && (
        <CompleteCard visited={visited} onRestart={handleRestart} onExit={handleExit} />
      )}
    </div>
  );
}

/* ----------------------------- Intro screen ----------------------------- */

function IntroCard({ sessionTitle, onStart, onExit }) {
  return (
    <div className="mj-card mj-intro">
      <div className="mj-icon-badge" aria-hidden="true">🧠</div>
      <h1 className="mj-title">Memory Journey</h1>
      <p className="mj-subtitle">A calm memory and navigation activity</p>
      <p className="mj-session-name">{sessionTitle}</p>

      <div className="mj-pills">
        <span className="mj-pill">🌿 Calm pace</span>
        <span className="mj-pill">🕐 Remember the route</span>
        <span className="mj-pill">🔊 Listen to instructions</span>
      </div>

      <div className="mj-actions">
        <button type="button" className="mj-btn mj-btn-primary" onClick={onStart}>Start</button>
        <button type="button" className="mj-btn mj-btn-secondary" onClick={onExit}>Exit</button>
      </div>
    </div>
  );
}

/* ------------------------- Listen carefully screen ----------------------- */

function InstructionsCard({ isSpeaking, onReady, onHearAgain }) {
  return (
    <div className="mj-card mj-instructions">
      <h1 className="mj-title">Listen Carefully</h1>

      <div className="mj-instruction-box">
        Welcome. Listen carefully and remember the places you see along the way.
      </div>

      <p className={`mj-speaking-status ${isSpeaking ? 'is-speaking' : ''}`} aria-live="polite">
        <span aria-hidden="true">🔊</span> {isSpeaking ? 'Speaking…' : 'Ready when you are'}
      </p>

      <div className="mj-actions">
        <button type="button" className="mj-btn mj-btn-primary" onClick={onReady}>I am Ready</button>
        <button type="button" className="mj-btn mj-btn-secondary" onClick={onHearAgain}>🔊 Hear Again</button>
      </div>
    </div>
  );
}

/* ------------------------------ Game screen ------------------------------ */

function GameCard({
  mode,
  journey,
  stepIndex,
  currentStep,
  totalSteps,
  lane,
  phase,
  lastDirection,
  visited,
  isSpeaking,
  onDirection,
  onHearAgain,
}) {
  const locked = phase !== 'idle';

  return (
    <div className="mj-card mj-game">
      <div className="mj-game-topbar">
        <span className="mj-mode-pill">{mode}</span>
        <span className="mj-remembered-pill">🌟 Remembered {visited.length}/{totalSteps}</span>
        <span className="mj-step-pill">Step {stepIndex + 1} / {totalSteps}</span>
      </div>

      <div className="mj-game-body">
        <RoutePanel journey={journey} stepIndex={stepIndex} />

        <div className="mj-play-area">
          <Scene
            step={currentStep}
            lane={lane}
            phase={phase}
            lastDirection={lastDirection}
          />

          <p className="mj-instruction-text" aria-live="polite">
            {phase === 'incorrect' ? "Let's try again — " : ''}
            {currentStep.instruction}
          </p>

          <div className="mj-controls-row">
            <button type="button" className="mj-btn mj-btn-secondary mj-hear-again" onClick={onHearAgain}>
              {isSpeaking ? '🔊 Speaking…' : '🔊 Hear Again'}
            </button>
          </div>

          <div className="mj-direction-controls" role="group" aria-label="Choose a direction">
            <button
              type="button"
              className="mj-dir-btn"
              disabled={locked}
              onClick={() => onDirection('left')}
            >
              <span className="mj-dir-arrow" aria-hidden="true">←</span>
              <span>Left</span>
            </button>
            <button
              type="button"
              className="mj-dir-btn mj-dir-btn-straight"
              disabled={locked}
              onClick={() => onDirection('straight')}
            >
              <span className="mj-dir-arrow" aria-hidden="true">↑</span>
              <span>Straight</span>
            </button>
            <button
              type="button"
              className="mj-dir-btn"
              disabled={locked}
              onClick={() => onDirection('right')}
            >
              <span className="mj-dir-arrow" aria-hidden="true">→</span>
              <span>Right</span>
            </button>
          </div>

          <div className="mj-progress-dots">
            {journey.map((step, i) => (
              <span
                key={step.id}
                className={
                  'mj-dot' +
                  (i < stepIndex ? ' is-visited' : '') +
                  (i === stepIndex ? ' is-current' : '')
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Left-hand "your route" panel — a simple vertical line map, never overlapping. */
function RoutePanel({ journey, stepIndex }) {
  return (
    <aside className="mj-route-panel" aria-label="Your route">
      <h2 className="mj-route-title">Your Route</h2>
      <ul className="mj-route-list">
        {journey.map((step, i) => {
          const state = i < stepIndex ? 'visited' : i === stepIndex ? 'current' : 'upcoming';
          return (
            <li key={step.id} className={`mj-route-item is-${state}`}>
              <span className="mj-route-dot" aria-hidden="true">
                {state === 'visited' ? '✓' : ''}
              </span>
              <span className="mj-route-icon" aria-hidden="true">
                {step.image ? <img src={step.image} alt="" /> : step.icon || '📍'}
              </span>
              <span className="mj-route-label">{step.landmark}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

/** The pseudo-3D road scene, avatar, and destination banner. */
function Scene({ step, lane, phase, lastDirection }) {
  const roadClass =
    'mj-road' +
    (phase === 'correct' && lastDirection === 'left' ? ' mj-road--bend-left' : '') +
    (phase === 'correct' && lastDirection === 'right' ? ' mj-road--bend-right' : '');

  const avatarClass =
    'mj-avatar' +
    (phase === 'correct' ? ' mj-avatar--success' : '') +
    (phase === 'incorrect' ? ' mj-avatar--retry' : '');

  return (
    <div className="mj-scene">
      <div className="mj-destination-banner">
        <span aria-hidden="true">📍</span> {step.landmark}
      </div>

      <span className="mj-direction-badge">
        {lastDirection ? DIRECTION_LABEL[lastDirection] : '↑ Ready to walk'}
      </span>

      <div className="mj-sky">
        <div className="mj-sun" aria-hidden="true" />
        <div className="mj-cloud mj-cloud-1" aria-hidden="true" />
        <div className="mj-cloud mj-cloud-2" aria-hidden="true" />
      </div>

      <div className="mj-ground">
        <span className="mj-tree mj-tree-1" aria-hidden="true">🌲</span>
        <span className="mj-tree mj-tree-2" aria-hidden="true">🌳</span>
        <span className="mj-tree mj-tree-3" aria-hidden="true">🌳</span>
        <span className="mj-tree mj-tree-4" aria-hidden="true">🌲</span>

        <div className={roadClass}>
          <span className="mj-road-line" />
        </div>

        <div className="mj-landmark-icon" aria-hidden="true">
          {step.image ? <img src={step.image} alt="" /> : step.icon || '📍'}
        </div>

        <div
          className={avatarClass}
          style={{ '--mj-lane': lane }}
        >
          <div className="mj-avatar-glow" aria-hidden="true" />
          <svg className="mj-avatar-svg" viewBox="0 0 100 120" width="64" height="78" aria-hidden="true">
            <g className="mj-leg mj-leg-left">
              <rect x="38" y="78" width="10" height="34" rx="5" />
            </g>
            <g className="mj-leg mj-leg-right">
              <rect x="52" y="78" width="10" height="34" rx="5" />
            </g>
            <rect className="mj-body" x="30" y="46" width="40" height="40" rx="16" />
            <circle className="mj-head" cx="50" cy="30" r="22" />
            <circle className="mj-eye" cx="42" cy="28" r="3" />
            <circle className="mj-eye" cx="58" cy="28" r="3" />
            <path className="mj-smile" d="M40 36 Q50 44 60 36" fill="none" strokeLinecap="round" />
          </svg>
          <span className="mj-avatar-tag">You</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Complete screen ---------------------------- */

function CompleteCard({ visited, onRestart, onExit }) {
  return (
    <div className="mj-card mj-complete">
      <div className="mj-icon-badge" aria-hidden="true">🎉</div>
      <h1 className="mj-title">Journey Complete</h1>
      <p className="mj-subtitle">Here is the route you just walked and remembered.</p>

      <ol className="mj-recap-list">
        {visited.map((landmark, i) => (
          <li key={landmark + i} className="mj-recap-item">
            <span className="mj-recap-check" aria-hidden="true">✓</span> {landmark}
          </li>
        ))}
      </ol>

      <div className="mj-actions">
        <button type="button" className="mj-btn mj-btn-primary" onClick={onRestart}>Walk Again</button>
        <button type="button" className="mj-btn mj-btn-secondary" onClick={onExit}>Back to Games</button>
      </div>
    </div>
  );
}