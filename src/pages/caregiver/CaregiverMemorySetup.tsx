// @ts-nocheck — leftover JS-shaped module; runtime unchanged
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMemoryJourneyConfig,
  saveMemoryJourneyConfig,
} from "../../lib/memoryJourneyStore";
import MemoryJourney, { DEFAULT_JOURNEY_CONFIG } from "../../games/MemoryJourney";

import "./CaregiverMemorySetup.css";


const DEFAULT_PATIENT_ID = "aita";


const LANGUAGES = [
  {
    id: "en",
    name: "English",
  },
  {
    id: "hi",
    name: "Hindi",
  },
  {
    id: "as",
    name: "Assamese",
  },
  {
    id: "mni",
    name: "Manipuri",
  },
  {
    id: "kh",
    name: "Khasi",
  },
  {
    id: "mz",
    name: "Mizo",
  },
];


const DIRECTIONS = [
  {
    id: "left",
    name: "Left",
  },
  {
    id: "right",
    name: "Right",
  },
  {
    id: "straight",
    name: "Straight",
  },
];


function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}


export default function CaregiverMemorySetup({
  patientId = DEFAULT_PATIENT_ID,
  onBack,
  onSaved,
}: {
  patientId?: string;
  onBack?: () => void;
  onSaved?: (config: unknown) => void;
}) {
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [routeTitle, setRouteTitle] = useState("");

  const [startMessage, setStartMessage] = useState("");

  const [language, setLanguage] = useState("en");

  const [difficulty, setDifficulty] = useState("easy");

  const [controlMode, setControlMode] =
    useState("buttons");

  const [voiceEnabled, setVoiceEnabled] =
    useState(true);

  const [steps, setSteps] = useState<unknown[]>([]);

  const [landmarks, setLandmarks] =
    useState<unknown[]>([]);


  useEffect(() => {
    async function loadExistingConfig() {
      try {
        const existing =
          await getMemoryJourneyConfig(patientId);

        if (existing) {
          setRouteTitle(
            existing.route?.title || DEFAULT_JOURNEY_CONFIG.route.title
          );

          setStartMessage(
            existing.route?.startMessage || DEFAULT_JOURNEY_CONFIG.route.startMessage
          );

          setLanguage(
            existing.language || "hi"
          );

          setDifficulty(
            existing.difficulty?.level || "easy"
          );

          setControlMode(
            existing.accessibility?.controlMode ||
              "buttons"
          );

          setVoiceEnabled(
            existing.accessibility?.voiceEnabled ??
              true
          );

          setSteps(
            existing.route?.steps?.length
              ? existing.route.steps
              : DEFAULT_JOURNEY_CONFIG.route.steps
          );

          setLandmarks(
            existing.landmarks?.length
              ? existing.landmarks
              : DEFAULT_JOURNEY_CONFIG.landmarks
          );
        } else {
          setRouteTitle(DEFAULT_JOURNEY_CONFIG.route.title);
          setStartMessage(DEFAULT_JOURNEY_CONFIG.route.startMessage);
          setLanguage(DEFAULT_JOURNEY_CONFIG.language || "hi");
          setSteps(DEFAULT_JOURNEY_CONFIG.route.steps);
          setLandmarks(DEFAULT_JOURNEY_CONFIG.landmarks);
        }
      } catch (error) {
        console.error(
          "Unable to load Memory Journey configuration:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadExistingConfig();
  }, [patientId]);


  const goBack = () => {
    if (typeof onBack === "function") onBack();
    else navigate("/caregiver");
  };

  if (playing) {
    return (
      <MemoryJourney
        patientId={patientId}
        onExit={() => setPlaying(false)}
        onBack={() => setPlaying(false)}
      />
    );
  }

  if (loading) {
    return (
      <div className="caregiver-memory-setup">
        <div className="caregiver-memory-card">
          Loading Memory Journey setup...
        </div>
      </div>
    );
  }

  function addStep() {
    setSteps((previous) => [
      ...previous,
      {
        id: createId("step"),
        landmarkId: "",
        landmarkName: "",
        direction: "left",
        instruction: "",
      },
    ]);
  }


  function updateStep(index, field, value) {
    setSteps((previous) =>
      previous.map((step, stepIndex) =>
        stepIndex === index
          ? {
              ...step,
              [field]: value,
            }
          : step
      )
    );
  }


  function removeStep(index) {
    setSteps((previous) =>
      previous.filter(
        (_, stepIndex) => stepIndex !== index
      )
    );
  }


  function addLandmark() {
    setLandmarks((previous) => [
      ...previous,
      {
        id: createId("landmark"),
        name: "",
        imageUrl: "",
      },
    ]);
  }


  function updateLandmark(index, field, value) {
    setLandmarks((previous) =>
      previous.map((landmark, landmarkIndex) =>
        landmarkIndex === index
          ? {
              ...landmark,
              [field]: value,
            }
          : landmark
      )
    );
  }


  function removeLandmark(index) {
    setLandmarks((previous) =>
      previous.filter(
        (_, landmarkIndex) =>
          landmarkIndex !== index
      )
    );
  }

  async function handleSave() {
    setMessage("");

    if (!routeTitle.trim()) {
      setMessage("Please enter a journey name.");
      return;
    }

    if (!steps.length) {
      setMessage("Please add at least one route step.");
      return;
    }

    const incompleteStep = steps.some(
      (step) =>
        !step.instruction?.trim() ||
        !step.direction
    );

    if (incompleteStep) {
      setMessage(
        "Please complete every route step."
      );
      return;
    }

    setSaving(true);

    const journeyConfig = {
      patientId,

      route: {
        id: `route-${patientId}`,
        title: routeTitle.trim(),

        startMessage:
          startMessage.trim() ||
          "Let us begin the journey. Listen carefully to the directions.",

        steps: steps.map((step, index) => ({
          id:
            step.id ||
            `step-${index + 1}`,

          landmarkId:
            step.landmarkId || "",

          landmarkName:
            step.landmarkName || "",

          direction:
            step.direction,

          instruction:
            step.instruction.trim(),
        })),
      },

      landmarks: landmarks
        .filter(
          (landmark) =>
            landmark.name?.trim()
        )
        .map((landmark) => ({
          id:
            landmark.id ||
            createId("landmark"),

          name:
            landmark.name.trim(),

          imageUrl:
            landmark.imageUrl?.trim() || "",
        })),

      language,

      difficulty: {
        level: difficulty,

        hesitationThresholdMs:
          difficulty === "easy"
            ? 6000
            : difficulty === "medium"
              ? 5000
              : 4000,
      },

      accessibility: {
        controlMode,

        textSize: "large",

        voiceEnabled,
      },

      updatedAt:
        new Date().toISOString(),
    };

    try {
      await saveMemoryJourneyConfig(
        patientId,
        journeyConfig
      );

      setMessage(
        "Memory Journey configuration saved successfully."
      );

      if (typeof onSaved === "function") {
        onSaved(journeyConfig);
      }

    } catch (error) {
      console.error(
        "Unable to save Memory Journey:",
        error
      );

      setMessage(
        "Unable to save the journey. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }


  return (
    <div className="caregiver-memory-setup">

      <div className="caregiver-memory-header">

        <button
          type="button"
          className="caregiver-back-btn"
          onClick={goBack}
        >
          ← Back
        </button>

        <div>
          <h1>
            Memory Journey Setup
          </h1>

          <p>
            Create a personalised route
            for the patient.
          </p>
        </div>

      </div>


      <div className="caregiver-memory-card">

        <div className="setup-section">

          <h2>
            1. Journey Details
          </h2>

          <label>
            Journey Name
          </label>

          <input
            type="text"
            value={routeTitle}
            onChange={(event) =>
              setRouteTitle(event.target.value)
            }
            placeholder="Example: Home to Temple"
          />


          <label>
            Starting Message
          </label>

          <textarea
            value={startMessage}
            onChange={(event) =>
              setStartMessage(event.target.value)
            }
            placeholder="Example: Chalo mandir chalte hain. Dhyan se directions sunna."
            rows={3}
          />

        </div>


        <div className="setup-section">

          <h2>
            2. Language & Accessibility
          </h2>

          <label>
            Preferred Language
          </label>

          <select
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value)
            }
          >
            {LANGUAGES.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            ))}
          </select>


          <label>
            Difficulty
          </label>

          <select
            value={difficulty}
            onChange={(event) =>
              setDifficulty(event.target.value)
            }
          >
            <option value="easy">
              Easy
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="hard">
              Hard
            </option>
          </select>


          <label>
            Control Mode
          </label>

          <select
            value={controlMode}
            onChange={(event) =>
              setControlMode(event.target.value)
            }
          >
            <option value="buttons">
              Large Buttons
            </option>

            <option value="swipe">
              Swipe
            </option>
          </select>


          <label className="setup-checkbox">

            <input
              type="checkbox"
              checked={voiceEnabled}
              onChange={(event) =>
                setVoiceEnabled(
                  event.target.checked
                )
              }
            />

            <span>
              Enable voice instructions
            </span>

          </label>

        </div>

        <div className="setup-section">

          <div className="setup-section-heading">
            <div>
              <h2>
                3. Route Instructions
              </h2>

              <p>
                Add the turns the patient should
                remember during the journey.
              </p>
            </div>

            <button
              type="button"
              className="setup-add-btn"
              onClick={addStep}
            >
              + Add Step
            </button>
          </div>


          {steps.length === 0 && (
            <div className="setup-empty">
              No route steps added yet.
            </div>
          )}


          {steps.map((step, index) => (
            <div
              className="route-step-card"
              key={step.id}
            >

              <div className="route-step-header">

                <strong>
                  Step {index + 1}
                </strong>

                <button
                  type="button"
                  className="setup-remove-btn"
                  onClick={() =>
                    removeStep(index)
                  }
                >
                  Remove
                </button>

              </div>


              <label>
                Landmark / Location
              </label>

              <input
                type="text"
                value={
                  step.landmarkName || ""
                }
                onChange={(event) =>
                  updateStep(
                    index,
                    "landmarkName",
                    event.target.value
                  )
                }
                placeholder="Example: Peepal tree"
              />


              <label>
                Direction
              </label>

              <select
                value={step.direction}
                onChange={(event) =>
                  updateStep(
                    index,
                    "direction",
                    event.target.value
                  )
                }
              >
                {DIRECTIONS.map((direction) => (
                  <option
                    key={direction.id}
                    value={direction.id}
                  >
                    {direction.name}
                  </option>
                ))}
              </select>


              <label>
                Voice / Visual Instruction
              </label>

              <textarea
                value={
                  step.instruction || ""
                }
                onChange={(event) =>
                  updateStep(
                    index,
                    "instruction",
                    event.target.value
                  )
                }
                placeholder="Example: Peepal ke pedh se right mudna hai."
                rows={3}
              />

            </div>
          ))}

        </div>


        <div className="setup-section">

          <div className="setup-section-heading">

            <div>
              <h2>
                4. Familiar Landmarks
              </h2>

              <p>
                Add landmarks that the patient
                may recognise after the journey.
              </p>
            </div>

            <button
              type="button"
              className="setup-add-btn"
              onClick={addLandmark}
            >
              + Add Landmark
            </button>

          </div>


          {landmarks.length === 0 && (
            <div className="setup-empty">
              No landmarks added yet.
            </div>
          )}


          {landmarks.map(
            (landmark, index) => (
              <div
                className="landmark-setup-card"
                key={landmark.id}
              >

                <div className="route-step-header">

                  <strong>
                    Landmark {index + 1}
                  </strong>

                  <button
                    type="button"
                    className="setup-remove-btn"
                    onClick={() =>
                      removeLandmark(index)
                    }
                  >
                    Remove
                  </button>

                </div>


                <label>
                  Landmark Name
                </label>

                <input
                  type="text"
                  value={
                    landmark.name || ""
                  }
                  onChange={(event) =>
                    updateLandmark(
                      index,
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="Example: Local temple"
                />


                <label>
                  Landmark Image URL
                </label>

                <input
                  type="url"
                  value={
                    landmark.imageUrl || ""
                  }
                  onChange={(event) =>
                    updateLandmark(
                      index,
                      "imageUrl",
                      event.target.value
                    )
                  }
                  placeholder="Optional image URL"
                />

              </div>
            )
          )}

        </div>

        <div className="setup-actions">
          <button
            type="button"
            className="caregiver-secondary-btn"
            onClick={goBack}
          >
            Cancel
          </button>

          <button
            type="button"
            className="caregiver-primary-btn"
            onClick={async () => {
              await handleSave();
              setPlaying(true);
            }}
          >
            Play journey
          </button>

          <button
            type="button"
            className="caregiver-primary-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Memory Journey"}
          </button>
        </div>

        {message && (
          <div className="setup-message" role="status">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}