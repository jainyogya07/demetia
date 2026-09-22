import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  getMemoryJourneyConfig,
  saveMemoryJourneySession,
} from "../lib/memoryJourneyStore";

import { applyMemoryJourneyToAssessment } from "../lib/assessmentStore";

import "./MemoryJourney.css";


const DEFAULT_PATIENT_ID = "aita";


const PHASES = {
  LOADING: "loading",
  NO_CONFIG: "no-config",
  WELCOME: "welcome",
  BRIEFING: "briefing",
  PRACTICE: "practice",
  JOURNEY: "journey",
  LANDMARK_RECALL: "landmark-recall",
  COMPLETE: "complete",
};


const DIRECTIONS = {
  LEFT: "left",
  RIGHT: "right",
  STRAIGHT: "straight",
};


function createSessionId() {
  return `memory-journey-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}


function now() {
  return Date.now();
}


function median(values) {
  const numbers = values
    .map(Number)
    .filter(Number.isFinite)
    .sort((a, b) => a - b);

  if (!numbers.length) return 0;

  const middle = Math.floor(numbers.length / 2);

  if (numbers.length % 2 === 0) {
    return Math.round(
      (numbers[middle - 1] + numbers[middle]) / 2
    );
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
  onComplete,
}) {
  const [phase, setPhase] = useState(PHASES.LOADING);

  const [config, setConfig] = useState(null);

  const [currentStepIndex, setCurrentStepIndex] =
    useState(0);

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [stepStartedAt, setStepStartedAt] =
    useState(null);

  const [practiceCompleted, setPracticeCompleted] =
    useState(false);

  const [turnTelemetry, setTurnTelemetry] =
    useState([]);

  const [landmarkTelemetry, setLandmarkTelemetry] =
    useState([]);

  const [landmarkRecallIndex, setLandmarkRecallIndex] =
    useState(0);

  const [selectedLandmark, setSelectedLandmark] =
    useState(null);

  const [result, setResult] = useState(null);

  const [sessionId] = useState(createSessionId);

  const recognitionRef = useRef(null);

  const mountedRef = useRef(true);


  useEffect(() => {
    mountedRef.current = true;

    async function loadJourney() {
      try {
        const savedConfig =
          await getMemoryJourneyConfig(patientId);

        if (!mountedRef.current) return;

        if (!savedConfig) {
          setPhase(PHASES.NO_CONFIG);
          return;
        }

        setConfig(savedConfig);
        setPhase(PHASES.WELCOME);

      } catch (error) {
        console.error(
          "Memory Journey config error:",
          error
        );

        setPhase(PHASES.NO_CONFIG);
      }
    }

    loadJourney();

    return () => {
      mountedRef.current = false;

      try {
        window.speechSynthesis?.cancel();
      } catch {
        // Ignore cleanup error
      }

      try {
        recognitionRef.current?.stop();
      } catch {
        // Ignore cleanup error
      }
    };
  }, [patientId]);


  const currentStep = useMemo(() => {
    const steps = config?.route?.steps;

    if (!Array.isArray(steps) || !steps.length) {
      return null;
    }

    return steps[currentStepIndex] || null;
  }, [config, currentStepIndex]);


  const landmarks = useMemo(() => {
    if (!Array.isArray(config?.landmarks)) {
      return [];
    }

    return config.landmarks;
  }, [config]);

  function speak(text) {
    if (!text) return;

    try {
      window.speechSynthesis?.cancel();

      const utterance =
        new SpeechSynthesisUtterance(text);

      const language =
        config?.language || "en";

      const voiceLanguageMap = {
        en: "en-IN",
        hi: "hi-IN",
        as: "as-IN",
        mni: "mni-IN",
        kh: "en-IN",
        mz: "en-IN",
      };

      utterance.lang =
        voiceLanguageMap[language] || "en-IN";

      // Calm speaking speed for elderly users
      utterance.rate = 0.78;
      utterance.pitch = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis?.speak(utterance);

    } catch (error) {
      console.warn(
        "Speech synthesis unavailable:",
        error
      );

      setIsSpeaking(false);
    }
  }


  function startBriefing() {
    setPhase(PHASES.BRIEFING);

    const message =
      config?.route?.startMessage ||
      "Let us begin the journey. Listen carefully to the directions.";

    setTimeout(() => {
      speak(message);
    }, 200);
  }

  function startPractice() {
    setCurrentStepIndex(0);

    setStepStartedAt(now());

    setPracticeCompleted(false);

    setPhase(PHASES.PRACTICE);

    const firstInstruction =
      config?.route?.steps?.[0]?.instruction || "";

    if (firstInstruction) {
      setTimeout(() => {
        speak(firstInstruction);
      }, 200);
    }
  }


  function startJourney() {
    setCurrentStepIndex(0);

    setStepStartedAt(now());

    setTurnTelemetry([]);

    setLandmarkTelemetry([]);

    setPhase(PHASES.JOURNEY);

    const firstInstruction =
      config?.route?.steps?.[0]?.instruction || "";

    if (firstInstruction) {
      setTimeout(() => {
        speak(firstInstruction);
      }, 200);
    }
  }


  function finishPractice() {
    setPracticeCompleted(true);

    setCurrentStepIndex(0);

    setStepStartedAt(now());

    setPhase(PHASES.JOURNEY);

    const firstInstruction =
      config?.route?.steps?.[0]?.instruction || "";

    if (firstInstruction) {
      setTimeout(() => {
        speak(firstInstruction);
      }, 250);
    }
  }

  function recordTurn(direction) {
    if (!currentStep) return;

    const responseTime = stepStartedAt
      ? now() - stepStartedAt
      : 0;

    const expectedDirection =
      currentStep.direction || DIRECTIONS.STRAIGHT;

    const correct =
      direction === expectedDirection;

    const hesitation =
      responseTime >=
      Number(
        config?.difficulty?.hesitationThresholdMs || 5000
      );

    const telemetry = {
      stepId:
        currentStep.id ||
        `step-${currentStepIndex + 1}`,

      instruction:
        currentStep.instruction || "",

      expectedDirection,

      chosenDirection: direction,

      correct,

      decisionTimeMs: responseTime,

      motorResponseMs: responseTime,

      assistanceUsed: false,

      repeatedInstruction: false,

      hesitation,
    };

    setTurnTelemetry((previous) => [
      ...previous,
      telemetry,
    ]);

    if (phase === PHASES.PRACTICE) {
      finishPractice();
      return;
    }

    if (
      currentStepIndex <
      config.route.steps.length - 1
    ) {
      const nextIndex =
        currentStepIndex + 1;

      setCurrentStepIndex(nextIndex);

      setStepStartedAt(now());

      const nextStep =
        config.route.steps[nextIndex];

      if (nextStep?.instruction) {
        setTimeout(() => {
          speak(nextStep.instruction);
        }, 250);
      }

      return;
    }

    finishJourney();
  }


  function finishJourney() {
    if (landmarks.length > 0) {
      setLandmarkRecallIndex(0);

      setSelectedLandmark(null);

      setStepStartedAt(now());

      setPhase(PHASES.LANDMARK_RECALL);

      return;
    }

    finishAssessment();
  }

  function handleLandmarkAnswer(landmarkId) {
    const landmark =
      landmarks[landmarkRecallIndex];

    if (!landmark) return;

    const responseTime = stepStartedAt
      ? now() - stepStartedAt
      : 0;

    const correct =
      landmarkId === landmark.id;

    const telemetry = {
      landmarkId: landmark.id,

      selectedLandmarkId: landmarkId,

      correct,

      responseTimeMs: responseTime,
    };

    const updatedLandmarkTelemetry = [
      ...landmarkTelemetry,
      telemetry,
    ];

    setLandmarkTelemetry(
      updatedLandmarkTelemetry
    );

    if (
      landmarkRecallIndex <
      landmarks.length - 1
    ) {
      setSelectedLandmark(null);

      setLandmarkRecallIndex(
        landmarkRecallIndex + 1
      );

      setStepStartedAt(now());

      return;
    }

    finishAssessment(
      updatedLandmarkTelemetry
    );
  }


  function buildAssessmentResult(
    finalLandmarkTelemetry = landmarkTelemetry
  ) {
    const totalTurns =
      turnTelemetry.length;

    const correctTurns =
      turnTelemetry.filter(
        (item) => item.correct
      ).length;

    const wrongTurns =
      turnTelemetry.filter(
        (item) => !item.correct
      ).length;

    const decisionTimes =
      turnTelemetry.map(
        (item) => item.decisionTimeMs
      );

    const motorTimes =
      turnTelemetry.map(
        (item) => item.motorResponseMs
      );

    const hesitationCount =
      turnTelemetry.filter(
        (item) => item.hesitation
      ).length;

    const landmarkTotal =
      finalLandmarkTelemetry.length;

    const landmarkCorrect =
      finalLandmarkTelemetry.filter(
        (item) => item.correct
      ).length;

    return {
      sessionId,

      patientId,

      routeId:
        config?.route?.id ||
        config?.routeId ||
        null,

      language:
        config?.language || "en",

      difficulty:
        config?.difficulty?.level ||
        "easy",

      startedAt:
        new Date().toISOString(),

      completedAt:
        new Date().toISOString(),

      completed: true,

      practiceCompleted,

      turns: turnTelemetry,

      landmarks:
        finalLandmarkTelemetry,

      summary: {
        routeAccuracy:
          calculatePercentage(
            correctTurns,
            totalTurns
          ),

        landmarkAccuracy:
          calculatePercentage(
            landmarkCorrect,
            landmarkTotal
          ),

        medianDecisionTimeMs:
          median(decisionTimes),

        medianMotorResponseMs:
          median(motorTimes),

        wrongTurns,

        hesitationCount,

        assistanceCount: 0,

        totalTurns,

        correctTurns,

        landmarkTotal,

        landmarkCorrect,
      },
    };
  }

  async function finishAssessment(
    finalLandmarkTelemetry = landmarkTelemetry
  ) {
    const resultData =
      buildAssessmentResult(
        finalLandmarkTelemetry
      );

    setResult(resultData);

    try {
      await saveMemoryJourneySession(
        patientId,
        resultData
      );
    } catch (error) {
      console.error(
        "Memory Journey session save failed:",
        error
      );
    }

    try {
      applyMemoryJourneyToAssessment(
        resultData,
        patientId
      );
    } catch (error) {
      console.warn(
        "Assessment integration failed:",
        error
      );
    }

    setPhase(PHASES.COMPLETE);

    if (typeof onComplete === "function") {
      onComplete(resultData);
    }
  }


  function handleExit() {
    try {
      window.speechSynthesis?.cancel();
    } catch {
      // Ignore cleanup error
    }

    if (typeof onExit === "function") {
      onExit();
    }
  }


  if (phase === PHASES.LOADING) {
    return (
      <div className="memory-journey-page">
        <div className="memory-journey-card">
          <h2>
            Preparing Memory Journey
          </h2>

          <p>
            Please wait while we prepare
            your journey.
          </p>
        </div>
      </div>
    );
  }


  if (phase === PHASES.NO_CONFIG) {
    return (
      <div className="memory-journey-page">
        <div className="memory-journey-card">

          <h2>
            Memory Journey is not ready
          </h2>

          <p>
            A caregiver needs to create a
            personalised journey first.
          </p>

          <button
            type="button"
            className="memory-journey-secondary-btn"
            onClick={handleExit}
          >
            Go Back
          </button>

        </div>
      </div>
    );
  }

  if (phase === PHASES.WELCOME) {
    return (
      <div className="memory-journey-page">
        <div className="memory-journey-card">

          <div className="memory-journey-icon">
            🧠
          </div>

          <h1>
            Memory Journey
          </h1>

          <p className="memory-journey-subtitle">
            A calm memory and navigation activity
          </p>

          <p>
            {config?.route?.title ||
              "Your Personal Journey"}
          </p>

          <div className="memory-journey-info">
            <span>🌿 Calm pace</span>
            <span>🧭 Remember the route</span>
            <span>🔊 Listen to instructions</span>
          </div>

          <div className="memory-journey-actions">

            <button
              type="button"
              className="memory-journey-primary-btn"
              onClick={startBriefing}
            >
              Start
            </button>

            <button
              type="button"
              className="memory-journey-secondary-btn"
              onClick={handleExit}
            >
              Exit
            </button>

          </div>

        </div>
      </div>
    );
  }


  if (phase === PHASES.BRIEFING) {
    return (
      <div className="memory-journey-page">

        <div className="memory-journey-card">

          <h1>
            Listen Carefully
          </h1>

          <div className="memory-journey-instruction">
            {config?.route?.startMessage ||
              "Listen carefully to the instructions."}
          </div>

          {isSpeaking && (
            <p className="memory-journey-speaking">
              🔊 Speaking...
            </p>
          )}

          <button
            type="button"
            className="memory-journey-primary-btn"
            onClick={startPractice}
          >
            I am Ready
          </button>

          <button
            type="button"
            className="memory-journey-secondary-btn"
            onClick={() =>
              speak(config?.route?.startMessage)
            }
          >
            🔊 Hear Again
          </button>

        </div>

      </div>
    );
  }

  if (
    phase === PHASES.PRACTICE ||
    phase === PHASES.JOURNEY
  ) {
    const isPractice =
      phase === PHASES.PRACTICE;

    return (
      <div className="memory-journey-page">

        <div className="memory-journey-game">

          <div className="memory-journey-topbar">
            <span>
              {isPractice
                ? "Practice"
                : "Memory Journey"}
            </span>

            <span>
              Step {currentStepIndex + 1} /{" "}
              {config?.route?.steps?.length || 0}
            </span>
          </div>


          <div className="memory-journey-scene">

            <div className="memory-journey-sky">
              ☁️
            </div>

            <div className="memory-journey-tree">
              🌳
            </div>

            <div className="memory-journey-character">
              🚶
            </div>

            <div className="memory-journey-path">
              ───────────────
            </div>

            <div className="memory-journey-landmark">
              📍

              <span>
                {currentStep?.landmark ||
                  currentStep?.landmarkName ||
                  "Path"}
              </span>
            </div>

          </div>


          <div className="memory-journey-instruction-panel">

            <div className="memory-journey-instruction">

              {currentStep?.instruction ||
                "Listen to the instruction."}

            </div>

            {isSpeaking && (
              <div className="memory-journey-speaking">
                🔊 Speaking...
              </div>
            )}

            <button
              type="button"
              className="memory-journey-repeat-btn"
              onClick={() =>
                speak(currentStep?.instruction)
              }
            >
              🔊 Hear Again
            </button>

          </div>


          <div className="memory-journey-controls">

            <button
              type="button"
              className="memory-journey-direction-btn"
              onClick={() =>
                recordTurn(DIRECTIONS.LEFT)
              }
              aria-label="Turn left"
            >
              <span className="direction-arrow">
                ←
              </span>

              <span>
                Left
              </span>
            </button>


            <button
              type="button"
              className="memory-journey-direction-btn"
              onClick={() =>
                recordTurn(DIRECTIONS.STRAIGHT)
              }
              aria-label="Go straight"
            >
              <span className="direction-arrow">
                ↑
              </span>

              <span>
                Straight
              </span>
            </button>


            <button
              type="button"
              className="memory-journey-direction-btn"
              onClick={() =>
                recordTurn(DIRECTIONS.RIGHT)
              }
              aria-label="Turn right"
            >
              <span className="direction-arrow">
                →
              </span>

              <span>
                Right
              </span>
            </button>

          </div>

        </div>

      </div>
    );
  }

  if (phase === PHASES.LANDMARK_RECALL) {
    return (
      <div className="memory-journey-page">

        <div className="memory-journey-card">

          <h1>
            Which landmark did you see?
          </h1>

          <p>
            Take your time. There is no timer.
          </p>

          <div className="memory-journey-landmark-options">

            {landmarks.map((landmark) => (
              <button
                key={landmark.id}
                type="button"
                className={
                  selectedLandmark === landmark.id
                    ? "memory-landmark-option selected"
                    : "memory-landmark-option"
                }
                onClick={() => {
                  setSelectedLandmark(
                    landmark.id
                  );

                  handleLandmarkAnswer(
                    landmark.id
                  );
                }}
              >

                {landmark.imageUrl ? (
                  <img
                    src={landmark.imageUrl}
                    alt=""
                  />
                ) : (
                  <span className="landmark-placeholder">
                    📍
                  </span>
                )}

                <strong>
                  {landmark.name}
                </strong>

              </button>
            ))}

          </div>

        </div>

      </div>
    );
  }


  if (phase === PHASES.COMPLETE) {
    const summary =
      result?.summary || {};

    return (
      <div className="memory-journey-page">

        <div className="memory-journey-card">

          <div className="memory-journey-success">
            ✓
          </div>

          <h1>
            Journey Complete
          </h1>

          <p>
            Well done. You completed the
            Memory Journey.
          </p>


          <div className="memory-journey-results">

            <div>
              <strong>
                {summary.routeAccuracy ?? 0}%
              </strong>

              <span>
                Route accuracy
              </span>
            </div>


            <div>
              <strong>
                {summary.landmarkAccuracy ?? 0}%
              </strong>

              <span>
                Landmark recall
              </span>
            </div>


            <div>
              <strong>
                {summary.wrongTurns ?? 0}
              </strong>

              <span>
                Wrong turns
              </span>
            </div>


            <div>
              <strong>
                {summary.medianDecisionTimeMs ?? 0}
                ms
              </strong>

              <span>
                Median decision time
              </span>
            </div>

          </div>


          <p className="memory-journey-note">
            This result is an observation from
            today's activity. It should be viewed
            together with previous sessions and
            caregiver or clinical information.
          </p>


          <button
            type="button"
            className="memory-journey-primary-btn"
            onClick={handleExit}
          >
            Done
          </button>

        </div>

      </div>
    );
  }


  return null;
}