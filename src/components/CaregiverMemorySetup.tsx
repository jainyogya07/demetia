// @ts-nocheck — leftover JS-shaped module; runtime unchanged
import React, { useState } from "react";
import {
  saveMemoryJourneyConfig,
} from "../lib/assessmentStore";
import "./CaregiverMemorySetup.css";

const LANGUAGES = [
  {
    value: "en",
    label: "English",
    speech: "en-IN",
  },
  {
    value: "hi",
    label: "Hindi",
    speech: "hi-IN",
  },
  {
    value: "as",
    label: "Assamese",
    speech: "as-IN",
  },
  {
    value: "mni",
    label: "Manipuri",
    speech: "mni-IN",
  },
  {
    value: "kh",
    label: "Khasi",
    speech: "en-IN",
  },
  {
    value: "mz",
    label: "Mizo",
    speech: "en-IN",
  },
];

const DIRECTIONS = [
  {
    value: "left",
    label: "Left",
  },
  {
    value: "right",
    label: "Right",
  },
  {
    value: "straight",
    label: "Straight",
  },
];

function makeStep(number) {
  return {
    id: `memory-step-${Date.now()}-${number}`,
    landmark: "",
    direction: "right",
    instruction: "",
  };
}

export default function CaregiverMemorySetup({
  patientId = "latveria",
  initialPatientName = "Latveria",
  onSaved,
}: {
  patientId?: string;
  initialPatientName?: string;
  onSaved?: () => void;
}) {
  const [patientName, setPatientName] =
    useState(initialPatientName);

  const [language, setLanguage] =
    useState("en");

  const [title, setTitle] =
    useState("");

  const [startMessage, setStartMessage] =
    useState("");

  const [difficulty, setDifficulty] =
    useState("easy");

  const [voiceEnabled, setVoiceEnabled] =
    useState(true);

  const [steps, setSteps] = useState([
    makeStep(1),
    makeStep(2),
  ]);

  const [status, setStatus] =
    useState("");

  function updateStep(id, field, value) {
    setSteps((oldSteps) =>
      oldSteps.map((step) =>
        step.id === id
          ? {
              ...step,
              [field]: value,
            }
          : step
      )
    );
  }

  function addStep() {
    setSteps((oldSteps) => [
      ...oldSteps,
      makeStep(oldSteps.length + 1),
    ]);
  }

  function removeStep(id) {
    if (steps.length <= 2) return;

    setSteps((oldSteps) =>
      oldSteps.filter(
        (step) => step.id !== id
      )
    );
  }

  function saveJourney(event) {
    event.preventDefault();

    setStatus("");

    if (!patientName.trim()) {
      setStatus(
        "Please enter the patient's name."
      );
      return;
    }

    if (!title.trim()) {
      setStatus(
        "Please enter a journey name."
      );
      return;
    }

    if (!startMessage.trim()) {
      setStatus(
        "Please enter the starting instruction."
      );
      return;
    }

    if (steps.length < 2) {
      setStatus(
        "Add at least two route steps."
      );
      return;
    }

    const incomplete = steps.some(
      (step) =>
        !step.landmark.trim() ||
        !step.instruction.trim()
    );

    if (incomplete) {
      setStatus(
        "Please complete every route step."
      );
      return;
    }

    const languageObject =
      LANGUAGES.find(
        (item) =>
          item.value === language
      );

    const config = {
      patientId,

      patientName:
        patientName.trim(),

      language,

      speechLanguage:
        languageObject?.speech ||
        "en-IN",

      route: {
        title: title.trim(),

        startMessage:
          startMessage.trim(),

        steps: steps.map(
          (step, index) => ({
            id: step.id,

            order: index + 1,

            landmark:
              step.landmark.trim(),

            direction:
              step.direction,

            instruction:
              step.instruction.trim(),
          })
        ),
      },

      difficulty: {
        level: difficulty,

        speed:
          difficulty === "easy"
            ? "slow"
            : difficulty === "medium"
            ? "normal"
            : "fast",
      },

      accessibility: {
        controlMode: "buttons",

        largeControls: true,

        voiceEnabled,
      },
    };

    try {
      saveMemoryJourneyConfig(
        patientId,
        config
      );

      setStatus(
        "Memory Journey saved successfully."
      );

      onSaved?.(config);
    } catch (error) {
      console.error(error);

      setStatus(
        "Could not save Memory Journey."
      );
    }
  }

  return (
    <div className="memory-setup-page">
      <div className="memory-setup-card">

        <div className="memory-setup-heading">
          <span>
            SMRITI SAARTHI
          </span>

          <h1>
            Memory Journey Setup
          </h1>

          <p>
            Create a personalized route using
            landmarks familiar to the patient.
          </p>
        </div>

        <form onSubmit={saveJourney}>

          {/* PATIENT */}

          <section>
            <h2>
              Patient Information
            </h2>

            <div className="setup-grid">

              <label>
                Patient Name

                <input
                  value={patientName}
                  onChange={(event) =>
                    setPatientName(
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                Preferred Language

                <select
                  value={language}
                  onChange={(event) =>
                    setLanguage(
                      event.target.value
                    )
                  }
                >
                  {LANGUAGES.map(
                    (item) => (
                      <option
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </option>
                    )
                  )}
                </select>
              </label>

            </div>
          </section>

          {/* JOURNEY */}

          <section>
            <h2>
              Journey
            </h2>

            <label>
              Journey Name

              <input
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="Visit to Temple"
              />
            </label>

            <label>
              Starting Instruction

              <textarea
                value={startMessage}
                onChange={(event) =>
                  setStartMessage(
                    event.target.value
                  )
                }
                placeholder="Let us go to the temple."
              />
            </label>
          </section>

          {/* ROUTE */}

          <section>

            <div className="route-heading">
              <div>
                <h2>
                  Route Landmarks
                </h2>

                <p>
                  Use places the patient knows.
                </p>
              </div>

              <button
                type="button"
                className="add-step"
                onClick={addStep}
              >
                + Add Landmark
              </button>
            </div>

            {steps.map(
              (step, index) => (
                <div
                  className="route-form"
                  key={step.id}
                >
                  <div className="step-number">
                    {index + 1}
                  </div>

                  <div className="route-fields">

                    <label>
                      Landmark

                      <input
                        value={
                          step.landmark
                        }
                        onChange={(event) =>
                          updateStep(
                            step.id,
                            "landmark",
                            event.target.value
                          )
                        }
                        placeholder="Peepal Tree"
                      />
                    </label>

                    <label>
                      Direction

                      <select
                        value={
                          step.direction
                        }
                        onChange={(event) =>
                          updateStep(
                            step.id,
                            "direction",
                            event.target.value
                          )
                        }
                      >
                        {DIRECTIONS.map(
                          (direction) => (
                            <option
                              key={
                                direction.value
                              }
                              value={
                                direction.value
                              }
                            >
                              {
                                direction.label
                              }
                            </option>
                          )
                        )}
                      </select>
                    </label>

                    <label className="full">
                      Instruction

                      <textarea
                        value={
                          step.instruction
                        }
                        onChange={(event) =>
                          updateStep(
                            step.id,
                            "instruction",
                            event.target.value
                          )
                        }
                        placeholder="Turn right after the peepal tree."
                      />
                    </label>

                  </div>

                  {steps.length > 2 && (
                    <button
                      type="button"
                      className="remove-step"
                      onClick={() =>
                        removeStep(step.id)
                      }
                    >
                      Remove
                    </button>
                  )}
                </div>
              )
            )}

          </section>

          {/* SETTINGS */}

          <section>
            <h2>
              Assessment Settings
            </h2>

            <div className="setup-grid">

              <label>
                Difficulty

                <select
                  value={difficulty}
                  onChange={(event) =>
                    setDifficulty(
                      event.target.value
                    )
                  }
                >
                  <option value="easy">
                    Easy
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="hard">
                    Advanced
                  </option>
                </select>
              </label>

              <label className="voice-setting">
                <input
                  type="checkbox"
                  checked={voiceEnabled}
                  onChange={(event) =>
                    setVoiceEnabled(
                      event.target.checked
                    )
                  }
                />

                Voice instructions
              </label>

            </div>
          </section>

          {status && (
            <div className="setup-status">
              {status}
            </div>
          )}

          <button
            type="submit"
            className="save-journey"
          >
            Save Memory Journey
          </button>

        </form>
      </div>
    </div>
  );
}