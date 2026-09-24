// @ts-nocheck — leftover JS-shaped module; runtime unchanged
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Compass, ArrowLeft, ArrowRight, ArrowUp, Volume2, VolumeX, RotateCcw,
  CheckCircle2, AlertCircle, Sparkles, MapPin, Award, Timer, Footprints,
  ShieldCheck, Settings, Play, Check, ChevronRight
} from 'lucide-react';
import {
  getMemoryJourneyConfig,
  saveMemoryJourneySession,
} from '../lib/memoryJourneyStore';
import { applyMemoryJourneyToAssessment } from '../lib/assessmentStore';
import { speakMemoryInstruction, stopMemoryVoice } from '../lib/memoryJourneyVoice';
import './MemoryJourney.css';

const DEFAULT_PATIENT_ID = 'aita';

export const DEFAULT_JOURNEY_CONFIG = {
  patientId: DEFAULT_PATIENT_ID,
  language: 'hi',
  difficulty: {
    level: 1,
    speed: 'slow',
    hesitationThresholdMs: 4500,
  },
  route: {
    id: 'default-temple-walk',
    title: 'सुबह की सैर: हनुमान मंदिर तक (Morning Temple Walk)',
    description: 'घर से निकलकर पार्क और चाय की दुकान से होते हुए मंदिर तक का शांत और परिचित रास्ता।',
    startMessage: 'नमस्ते। चलिए आज सुबह की सैर पर मंदिर चलते हैं। हर मोड़ पर ध्यान से सुनिए और सही दिशा चुनिए।',
    steps: [
      {
        id: 'step-1',
        instruction: 'घर के मुख्य द्वार से बाहर निकलें, और कॉलोनी पार्क की ओर दाईं (Right) तरफ मुड़ें।',
        instructionEn: 'Exit the main gate and turn Right towards the colony park.',
        direction: 'right',
        landmark: 'कॉलोनी पार्क (Green Park)',
        landmarkIcon: '🌳',
        landmarkDesc: 'हरे-भरे पेड़ और बेंच',
        hint: 'Turn Right (दाएँ मुड़ें)',
      },
      {
        id: 'step-2',
        instruction: 'पार्क पार करके पुराने नीम के पेड़ के पास से बाईं (Left) तरफ मुड़ें।',
        instructionEn: 'Pass the park and turn Left at the old Neem tree.',
        direction: 'left',
        landmark: 'नीम का पेड़ (Neem Tree)',
        landmarkIcon: '🌿',
        landmarkDesc: 'बड़ा पुराना छायादार पेड़',
        hint: 'Turn Left (बाएँ मुड़ें)',
      },
      {
        id: 'step-3',
        instruction: 'सामने रमेश चाय स्टॉल आ गया है। सीधे (Straight) आगे बढ़ते रहें।',
        instructionEn: 'You reached Ramesh Tea Stall. Keep walking Straight.',
        direction: 'straight',
        landmark: 'रमेश चाय स्टॉल (Tea Stall)',
        landmarkIcon: '☕',
        landmarkDesc: 'गर्म चाय और समोसे की दुकान',
        hint: 'Go Straight (सीधे चलें)',
      },
      {
        id: 'step-4',
        instruction: 'मंदिर का मुख्य द्वार आ गया है। दाईं (Right) ओर मुड़कर मंदिर में प्रवेश करें।',
        instructionEn: 'You arrived at the temple. Turn Right to enter the courtyard.',
        direction: 'right',
        landmark: 'हनुमान मंदिर (Hanuman Temple)',
        landmarkIcon: '🛕',
        landmarkDesc: 'घंटियों और पीत ध्वज वाला मंदिर',
        hint: 'Turn Right (दाएँ मुड़ें)',
      },
    ],
  },
  landmarks: [
    { id: 'lm-1', name: 'कॉलोनी पार्क (Green Park)', icon: '🌳', wasVisited: true },
    { id: 'lm-2', name: 'नीम का पेड़ (Neem Tree)', icon: '🌿', wasVisited: true },
    { id: 'lm-3', name: 'रमेश चाय स्टॉल (Tea Stall)', icon: '☕', wasVisited: true },
    { id: 'lm-4', name: 'हनुमान मंदिर (Hanuman Temple)', icon: '🛕', wasVisited: true },
    { id: 'lm-5', name: 'रेलवे स्टेशन (Railway Station)', icon: '🚆', wasVisited: false },
    { id: 'lm-6', name: 'मल्टीप्लेक्स सिनेमा (Cinema)', icon: '🎬', wasVisited: false },
  ],
};

const PHASES = {
  LOADING: 'loading',
  WELCOME: 'welcome',
  BRIEFING: 'briefing',
  JOURNEY: 'journey',
  FEEDBACK: 'feedback',
  LANDMARK_RECALL: 'landmark-recall',
  COMPLETE: 'complete',
};

const DIRECTIONS = {
  LEFT: 'left',
  STRAIGHT: 'straight',
  RIGHT: 'right',
};

function createSessionId() {
  return `mj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function now() {
  return Date.now();
}

function median(values) {
  const numbers = values.map(Number).filter(Number.isFinite).sort((a, b) => a - b);
  if (!numbers.length) return 0;
  const middle = Math.floor(numbers.length / 2);
  if (numbers.length % 2 === 0) {
    return Math.round((numbers[middle - 1] + numbers[middle]) / 2);
  }
  return Math.round(numbers[middle]);
}

function calculatePercentage(correct, total) {
  if (!total) return 0;
  return Math.round((correct / total) * 100);
}

export default function MemoryJourney({
  patientId = DEFAULT_PATIENT_ID,
  onExit,
  onBack,
  onComplete,
}) {
  const [phase, setPhase] = useState(PHASES.LOADING);
  const [config, setConfig] = useState<unknown>(null);
  const [isCustomConfig, setIsCustomConfig] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [stepStartedAt, setStepStartedAt] = useState<unknown>(null);
  const [lastTurnFeedback, setLastTurnFeedback] = useState<unknown>(null); // { correct, direction, expected }
  const [turnTelemetry, setTurnTelemetry] = useState<unknown[]>([]);
  const [landmarkTelemetry, setLandmarkTelemetry] = useState<unknown[]>([]);
  const [recallIndex, setRecallIndex] = useState(0);
  const [selectedLandmarkAnswer, setSelectedLandmarkAnswer] = useState<unknown>(null);
  const [result, setResult] = useState<unknown>(null);
  const [sessionId] = useState(createSessionId);

  const mountedRef = useRef(true);

  const handleClose = () => {
    stopMemoryVoice();
    if (typeof onExit === 'function') onExit();
    else if (typeof onBack === 'function') onBack();
  };

  // Safe voice synthesis wrapper
  const speak = (text) => {
    if (!text || voiceMuted) return;
    try {
      setIsSpeaking(true);
      speakMemoryInstruction(text, config?.language || 'hi');
      const duration = Math.min(6000, Math.max(2000, text.length * 75));
      setTimeout(() => {
        if (mountedRef.current) setIsSpeaking(false);
      }, duration);
    } catch {
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    async function loadJourney() {
      try {
        const saved = await getMemoryJourneyConfig(patientId);
        if (!mountedRef.current) return;

        const steps = saved?.route?.steps;
        const playable = Array.isArray(steps)
          && steps.filter((step) => step && (step.direction || step.instruction)).length >= 2;
        if (playable) {
          setConfig(saved);
          setIsCustomConfig(true);
        } else {
          setConfig(DEFAULT_JOURNEY_CONFIG);
          setIsCustomConfig(false);
        }
        setPhase(PHASES.WELCOME);
      } catch (err) {
        console.warn('[MemoryJourney] Config load error, falling back to default:', err);
        setConfig(DEFAULT_JOURNEY_CONFIG);
        setIsCustomConfig(false);
        setPhase(PHASES.WELCOME);
      }
    }

    loadJourney();

    return () => {
      mountedRef.current = false;
      stopMemoryVoice();
    };
  }, [patientId]);

  const steps = config?.route?.steps || DEFAULT_JOURNEY_CONFIG.route.steps;
  const currentStep = steps[currentStepIndex] || steps[0];
  const totalSteps = steps.length;

  const recallItems = useMemo(() => {
    if (config?.landmarks && config.landmarks.length > 0) {
      return config.landmarks;
    }
    return DEFAULT_JOURNEY_CONFIG.landmarks;
  }, [config]);

  // Start Briefing
  const startBriefing = () => {
    setPhase(PHASES.BRIEFING);
    const msg = config?.route?.startMessage || DEFAULT_JOURNEY_CONFIG.route.startMessage;
    speak(msg);
  };

  // Start Active Journey
  const startJourney = () => {
    setCurrentStepIndex(0);
    setTurnTelemetry([]);
    setLandmarkTelemetry([]);
    setPhase(PHASES.JOURNEY);
    setStepStartedAt(now());

    const first = steps[0];
    if (first?.instruction) {
      setTimeout(() => speak(first.instruction), 300);
    }
  };

  // Handle Player Turn Selection
  const handleTurnChoice = (chosenDirection) => {
    if (!currentStep) return;

    const responseTime = stepStartedAt ? now() - stepStartedAt : 800;
    const expected = currentStep.direction || DIRECTIONS.STRAIGHT;
    const isCorrect = chosenDirection === expected;
    const hesitation = responseTime >= (config?.difficulty?.hesitationThresholdMs || 4500);

    const stepRecord = {
      stepId: currentStep.id || `step-${currentStepIndex + 1}`,
      instruction: currentStep.instruction || '',
      expectedDirection: expected,
      chosenDirection,
      correct: isCorrect,
      decisionTimeMs: responseTime,
      motorResponseMs: responseTime,
      hesitation,
      landmark: currentStep.landmark || '',
    };

    const nextTurns = [...turnTelemetry, stepRecord];
    setTurnTelemetry(nextTurns);

    // Show instant visual & auditory feedback
    setLastTurnFeedback({
      correct: isCorrect,
      chosen: chosenDirection,
      expected,
      landmark: currentStep.landmark,
    });

    if (isCorrect) {
      speak('बहुत अच्छा! सही दिशा चुनी।');
    } else {
      speak(`कोई बात नहीं, सही रास्ता ${expected === 'right' ? 'दायाँ' : expected === 'left' ? 'बायाँ' : 'सीधा'} था।`);
    }

    // Advance after brief pause
    setTimeout(() => {
      setLastTurnFeedback(null);

      if (currentStepIndex < totalSteps - 1) {
        const nextIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextIndex);
        setStepStartedAt(now());

        const nextStep = steps[nextIndex];
        if (nextStep?.instruction) {
          setTimeout(() => speak(nextStep.instruction), 200);
        }
      } else {
        // Finished all route steps -> Go to Landmark Recall
        startLandmarkRecall();
      }
    }, 1500);
  };

  // Start Landmark Recall Phase
  const startLandmarkRecall = () => {
    setRecallIndex(0);
    setSelectedLandmarkAnswer(null);
    setStepStartedAt(now());
    setPhase(PHASES.LANDMARK_RECALL);
    speak('सैर पूरी हुई! अब बताइए, क्या आपने यह जगह रास्ते में देखी थी?');
  };

  // Answer for Landmark Recall
  const handleRecallAnswer = (wasSeenAnswer) => {
    const currentItem = recallItems[recallIndex];
    if (!currentItem) return;

    const responseTime = stepStartedAt ? now() - stepStartedAt : 600;
    const isCorrect = wasSeenAnswer === Boolean(currentItem.wasVisited ?? true);

    const record = {
      landmarkId: currentItem.id,
      name: currentItem.name,
      chosenSeen: wasSeenAnswer,
      actuallyVisited: Boolean(currentItem.wasVisited ?? true),
      correct: isCorrect,
      responseTimeMs: responseTime,
    };

    const updated = [...landmarkTelemetry, record];
    setLandmarkTelemetry(updated);
    setSelectedLandmarkAnswer(wasSeenAnswer);

    setTimeout(() => {
      setSelectedLandmarkAnswer(null);
      if (recallIndex < recallItems.length - 1) {
        setRecallIndex(recallIndex + 1);
        setStepStartedAt(now());
      } else {
        finishFullSession(updated);
      }
    }, 600);
  };

  // Complete and calculate clinical telemetry
  const finishFullSession = (finalLandmarks) => {
    const validTurns = turnTelemetry;
    const correctTurns = validTurns.filter((t) => t.correct).length;
    const wrongTurns = validTurns.filter((t) => !t.correct).length;
    const routeAccuracy = calculatePercentage(correctTurns, Math.max(1, validTurns.length));

    const decisionTimes = validTurns.map((t) => t.decisionTimeMs);
    const medianDecisionTime = median(decisionTimes);

    const landmarkCorrect = finalLandmarks.filter((l) => l.correct).length;
    const landmarkAccuracy = calculatePercentage(landmarkCorrect, Math.max(1, finalLandmarks.length));

    const summaryData = {
      routeAccuracy,
      landmarkAccuracy,
      wrongTurns,
      correctTurns,
      totalTurns: validTurns.length,
      medianDecisionTimeMs: medianDecisionTime,
      medianMotorResponseMs: medianDecisionTime,
    };

    const sessionPayload = {
      sessionId,
      patientId,
      completedAt: new Date().toISOString(),
      language: config?.language || 'hi',
      routeId: config?.route?.id || 'default-temple-walk',
      turns: validTurns,
      landmarks: finalLandmarks,
      summary: summaryData,
    };

    setResult(sessionPayload);
    setPhase(PHASES.COMPLETE);

    // Save to local session store
    try {
      saveMemoryJourneySession(patientId, sessionPayload);
    } catch (err) {
      console.warn('[MemoryJourney] Save session error:', err);
    }

    // Push into clinical detection store
    try {
      applyMemoryJourneyToAssessment(sessionPayload, patientId);
    } catch (err) {
      console.warn('[MemoryJourney] Telemetry sync error:', err);
    }

    if (typeof onComplete === 'function') {
      onComplete(sessionPayload);
    }
  };

  /* -------------------------------------------------------------
     RENDER: Phase Loading
  ------------------------------------------------------------- */
  if (phase === PHASES.LOADING) {
    return (
      <div className="mj-wrapper">
        <div className="mj-card mj-loading-box">
          <div className="mj-pulse-circle">
            <Compass className="mj-spin-slow" size={44} />
          </div>
          <h2>Preparing Memory Journey…</h2>
          <p>Loading familiar route and landmarks.</p>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     RENDER: Phase 1 - Welcome Screen
  ------------------------------------------------------------- */
  if (phase === PHASES.WELCOME) {
    return (
      <div className="mj-wrapper">
        <div className="mj-card mj-welcome-card">
          <div className="mj-badge-pill">
            <Sparkles size={14} /> Cognitive Route Navigation · 5 min
          </div>

          <div className="mj-hero-icon-wrap">
            <Compass size={56} className="mj-icon-emerald" />
          </div>

          <h1 className="mj-title">{config?.route?.title || 'Memory Journey'}</h1>
          <p className="mj-subtitle">
            {config?.route?.description || 'Follow a calm familiar route, make turns, and recall landmarks along the way.'}
          </p>

          <div className="mj-highlights-row">
            <div className="mj-highlight-chip">
              <span className="mj-chip-emoji">🌿</span>
              <span>Calm, No Timer</span>
            </div>
            <div className="mj-highlight-chip">
              <span className="mj-chip-emoji">🔊</span>
              <span>Spoken Voice Guidance</span>
            </div>
            <div className="mj-highlight-chip">
              <span className="mj-chip-emoji">🛕</span>
              <span>{totalSteps} Familiar Waypoints</span>
            </div>
          </div>

          {!isCustomConfig && (
            <div className="mj-notice-banner">
              <ShieldCheck size={16} />
              <span>Loaded default demo route. Caregivers can customize personal landmarks anytime in the Caregiver Portal.</span>
            </div>
          )}

          <div className="mj-btn-row">
            <button type="button" className="mj-btn-primary" onClick={startBriefing}>
              <Play size={18} /> Start Journey (सैर शुरू करें)
            </button>
            <button type="button" className="mj-btn-ghost" onClick={handleClose}>
              <ArrowLeft size={16} /> Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     RENDER: Phase 2 - Briefing Screen
  ------------------------------------------------------------- */
  if (phase === PHASES.BRIEFING) {
    return (
      <div className="mj-wrapper">
        <div className="mj-card mj-briefing-card">
          <div className="mj-badge-pill">
            <Volume2 size={14} /> Listen Carefully
          </div>

          <div className="mj-audio-avatar">
            <div className={`mj-sound-ring ${isSpeaking ? 'is-pulsing' : ''}`}>
              <Compass size={52} />
            </div>
          </div>

          <h2 className="mj-briefing-title">आज का लक्ष्य (Today's Destination)</h2>
          <div className="mj-speech-bubble">
            <p className="mj-speech-text">
              "{config?.route?.startMessage || DEFAULT_JOURNEY_CONFIG.route.startMessage}"
            </p>
          </div>

          <div className="mj-waypoints-preview">
            <p className="mj-preview-label">मार्ग के मुख्य पड़ाव (Route Stops):</p>
            <div className="mj-waypoints-pills">
              {steps.map((st, i) => (
                <div key={st.id || i} className="mj-waypoint-pill">
                  <span className="mj-wp-idx">{i + 1}</span>
                  <span className="mj-wp-icon">{st.landmarkIcon || '📍'}</span>
                  <span className="mj-wp-name">{st.landmark}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mj-btn-row">
            <button type="button" className="mj-btn-primary" onClick={startJourney}>
              I am Ready (मैं तैयार हूँ) <ChevronRight size={18} />
            </button>
            <button
              type="button"
              className="mj-btn-secondary"
              onClick={() => speak(config?.route?.startMessage || DEFAULT_JOURNEY_CONFIG.route.startMessage)}
            >
              <RotateCcw size={16} /> Listen Again (दोबारा सुनें)
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     RENDER: Phase 3 - Active Journey / Runner Navigation
  ------------------------------------------------------------- */
  if (phase === PHASES.JOURNEY) {
    const progressPct = Math.round(((currentStepIndex) / totalSteps) * 100);

    return (
      <div className="mj-wrapper mj-gameplay-wrapper">
        {/* Top Floating Dashboard */}
        <div className="mj-hud-bar">
          <button type="button" className="mj-hud-exit" onClick={handleClose} title="Exit Game">
            <ArrowLeft size={16} /> Exit
          </button>

          <div className="mj-hud-progress">
            <div className="mj-hud-step-text">
              Step <strong>{currentStepIndex + 1}</strong> of {totalSteps}
            </div>
            <div className="mj-progress-track">
              <div className="mj-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          <button
            type="button"
            className={`mj-hud-voice ${voiceMuted ? 'is-muted' : ''}`}
            onClick={() => {
              if (voiceMuted) {
                setVoiceMuted(false);
                speak(currentStep.instruction);
              } else {
                stopMemoryVoice();
                setVoiceMuted(true);
              }
            }}
            title={voiceMuted ? 'Unmute voice' : 'Mute voice'}
          >
            {voiceMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        {/* Visual 2.5D Route Perspective */}
        <div className="mj-stage-viewport">
          <div className="mj-road-perspective">
            {/* Horizon and Sky */}
            <div className="mj-skyline">
              <div className="mj-cloud c1">☁️</div>
              <div className="mj-cloud c2">☁️</div>
              <div className="mj-sun">☀️</div>
            </div>

            {/* Landmark Billboard at Horizon */}
            <div className="mj-landmark-billboard">
              <div className="mj-billboard-inner">
                <span className="mj-billboard-icon">{currentStep.landmarkIcon || '📍'}</span>
                <div className="mj-billboard-copy">
                  <span className="mj-billboard-tag">Approaching Landmark</span>
                  <h4 className="mj-billboard-title">{currentStep.landmark}</h4>
                  {currentStep.landmarkDesc && (
                    <p className="mj-billboard-desc">{currentStep.landmarkDesc}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Perspective Animated Road with Fork Markers */}
            <div className="mj-road-canvas">
              <div className="mj-road-stripes" />
              <div className="mj-fork-guide">
                <div className="mj-fork-branch left">
                  <span>← बायाँ</span>
                </div>
                <div className="mj-fork-branch straight">
                  <span>↑ सीधा</span>
                </div>
                <div className="mj-fork-branch right">
                  <span>दायाँ →</span>
                </div>
              </div>

              {/* Character Avatar */}
              <div className={`mj-walker-avatar ${lastTurnFeedback ? 'is-turning' : ''}`}>
                <div className="mj-walker-shadow" />
                <div className="mj-walker-sprite">🚶‍♂️</div>
              </div>
            </div>

            {/* Instant Turn Feedback Overlay */}
            {lastTurnFeedback && (
              <div className={`mj-feedback-splash ${lastTurnFeedback.correct ? 'is-success' : 'is-warning'}`}>
                {lastTurnFeedback.correct ? (
                  <>
                    <CheckCircle2 size={36} />
                    <span>शाबाश! सही मोड़ लिया</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={36} />
                    <span>
                      मोड़ नोट किया: सही दिशा{' '}
                      <strong>
                        {lastTurnFeedback.expected === 'right' ? 'दायाँ (Right)' : lastTurnFeedback.expected === 'left' ? 'बायाँ (Left)' : 'सीधा (Straight)'}
                      </strong>{' '}
                      थी
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Audio Instruction & Tactile Direction Controls */}
        <div className="mj-controls-panel">
          <div className="mj-instruction-strip">
            <div className="mj-instruction-text">
              <strong>निर्देश (Instruction):</strong> {currentStep.instruction}
            </div>
            <button
              type="button"
              className="mj-repeat-voice-btn"
              onClick={() => speak(currentStep.instruction)}
            >
              <Volume2 size={16} /> <span>Hear Again (दोबारा सुनें)</span>
            </button>
          </div>

          <div className="mj-directions-grid">
            <button
              type="button"
              className="mj-dir-btn btn-left"
              onClick={() => handleTurnChoice(DIRECTIONS.LEFT)}
              disabled={Boolean(lastTurnFeedback)}
            >
              <div className="mj-dir-arrow"><ArrowLeft size={36} /></div>
              <div className="mj-dir-label">
                <strong>Turn Left</strong>
                <span>बाईं ओर मुड़ें</span>
              </div>
            </button>

            <button
              type="button"
              className="mj-dir-btn btn-straight"
              onClick={() => handleTurnChoice(DIRECTIONS.STRAIGHT)}
              disabled={Boolean(lastTurnFeedback)}
            >
              <div className="mj-dir-arrow"><ArrowUp size={36} /></div>
              <div className="mj-dir-label">
                <strong>Go Straight</strong>
                <span>सीधे चलें</span>
              </div>
            </button>

            <button
              type="button"
              className="mj-dir-btn btn-right"
              onClick={() => handleTurnChoice(DIRECTIONS.RIGHT)}
              disabled={Boolean(lastTurnFeedback)}
            >
              <div className="mj-dir-arrow"><ArrowRight size={36} /></div>
              <div className="mj-dir-label">
                <strong>Turn Right</strong>
                <span>दाईं ओर मुड़ें</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     RENDER: Phase 4 - Landmark Memory Recall
  ------------------------------------------------------------- */
  if (phase === PHASES.LANDMARK_RECALL) {
    const item = recallItems[recallIndex] || recallItems[0];
    const recallProgress = Math.round(((recallIndex + 1) / recallItems.length) * 100);

    return (
      <div className="mj-wrapper">
        <div className="mj-card mj-recall-card">
          <div className="mj-badge-pill">
            <MapPin size={14} /> स्मृति पहचान (Landmark Recall) · {recallIndex + 1} / {recallItems.length}
          </div>

          <h2 className="mj-recall-title">क्या आपने यह जगह आज की सैर में देखी थी?</h2>
          <p className="mj-recall-subtitle">Did you pass this landmark during your walk?</p>

          <div className="mj-recall-target-box">
            <div className="mj-target-icon">{item.icon || '📍'}</div>
            <h3 className="mj-target-name">{item.name}</h3>
            {item.desc && <p className="mj-target-desc">{item.desc}</p>}
          </div>

          <div className="mj-recall-choices">
            <button
              type="button"
              className={`mj-recall-btn btn-yes ${selectedLandmarkAnswer === true ? 'is-selected' : ''}`}
              onClick={() => handleRecallAnswer(true)}
              disabled={selectedLandmarkAnswer !== null}
            >
              <Check size={28} />
              <div>
                <strong>हाँ, देखा था</strong>
                <span>Yes, I saw this</span>
              </div>
            </button>

            <button
              type="button"
              className={`mj-recall-btn btn-no ${selectedLandmarkAnswer === false ? 'is-selected' : ''}`}
              onClick={() => handleRecallAnswer(false)}
              disabled={selectedLandmarkAnswer !== null}
            >
              <AlertCircle size={28} />
              <div>
                <strong>नहीं, नहीं देखा</strong>
                <span>No, didn't see</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     RENDER: Phase 5 - Completed & Clinical Telemetry Screen
  ------------------------------------------------------------- */
  if (phase === PHASES.COMPLETE) {
    const summary = result?.summary || {};

    return (
      <div className="mj-wrapper">
        <div className="mj-card mj-complete-card">
          <div className="mj-complete-trophy">
            <Award size={54} className="mj-gold-trophy" />
          </div>

          <h1 className="mj-complete-title">सैर पूरी हुई! (Journey Complete)</h1>
          <p className="mj-complete-lead">
            शानदार! आपने आज की मेमोरी वॉक सफलता पूर्वक पूरी की।
          </p>

          {/* Clinical Telemetry Metric Cards */}
          <div className="mj-metrics-grid">
            <div className="mj-metric-card primary">
              <div className="mj-metric-val">{summary.routeAccuracy ?? 100}%</div>
              <div className="mj-metric-lbl">
                <Compass size={14} /> Route Accuracy (रास्ता शुद्धता)
              </div>
              <div className="mj-metric-sub">
                {summary.correctTurns} of {summary.totalTurns} correct turns
              </div>
            </div>

            <div className="mj-metric-card">
              <div className="mj-metric-val">{summary.landmarkAccuracy ?? 100}%</div>
              <div className="mj-metric-lbl">
                <MapPin size={14} /> Landmark Recall (स्थान स्मृति)
              </div>
              <div className="mj-metric-sub">Familiar recognition</div>
            </div>

            <div className="mj-metric-card">
              <div className="mj-metric-val">{summary.medianDecisionTimeMs ?? 1200} ms</div>
              <div className="mj-metric-lbl">
                <Timer size={14} /> Decision Speed (निर्णय गति)
              </div>
              <div className="mj-metric-sub">Motor-cognitive latency</div>
            </div>

            <div className="mj-metric-card">
              <div className="mj-metric-val">{summary.wrongTurns ?? 0}</div>
              <div className="mj-metric-lbl">
                <Footprints size={14} /> Wrong Turns (गलत मोड़)
              </div>
              <div className="mj-metric-sub">Preserved route memory</div>
            </div>
          </div>

          <div className="mj-clinical-sync-badge">
            <ShieldCheck size={16} />
            <span>
              ✓ Navigation Telemetry synced with Caregiver Dashboard and Doctor CDS Panel.
            </span>
          </div>

          <div className="mj-btn-row">
            <button type="button" className="mj-btn-primary" onClick={handleClose}>
              <Check size={18} /> Done (समाप्त करें)
            </button>
            <button type="button" className="mj-btn-secondary" onClick={startBriefing}>
              <RotateCcw size={16} /> Play Again (दोबारा खेलें)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}