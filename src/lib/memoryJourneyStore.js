/**
 * SMRITI SAARTHI
 * Memory Journey Local Store
 *
 * Stores:
 * 1. Caregiver-created route configuration
 * 2. Memory Journey telemetry sessions
 *
 * Offline-first:
 * Everything is initially stored locally.
 */

const CONFIG_PREFIX =
  'ss-memory-journey-config-v1-';

const SESSION_PREFIX =
  'ss-memory-journey-session-v1-';

function readJson(key, fallback = null) {
  try {
    const raw =
      localStorage.getItem(key);

    return raw
      ? JSON.parse(raw)
      : fallback;
  } catch (error) {
    console.warn(
      '[MemoryJourneyStore] Read failed:',
      error
    );

    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

    return true;
  } catch (error) {
    console.warn(
      '[MemoryJourneyStore] Write failed:',
      error
    );

    return false;
  }
}

export function saveMemoryJourneyConfig(
  patientId,
  config
) {
  if (!patientId) {
    throw new Error(
      'patientId is required'
    );
  }

  const cleanedConfig = {
    ...config,

    patientId,

    updatedAt:
      new Date().toISOString(),

    route: {
      ...(config.route || {}),

      steps: Array.isArray(
        config.route?.steps
      )
        ? config.route.steps
        : [],
    },

    accessibility: {
      voiceEnabled: true,
      controlMode: 'buttons',
      largeText: true,
      ...(config.accessibility || {}),
    },

    difficulty: {
      level: 1,
      speed: 'slow',
      ...(config.difficulty || {}),
    },
  };

  writeJson(
    `${CONFIG_PREFIX}${patientId}`,
    cleanedConfig
  );

  window.dispatchEvent(
    new CustomEvent(
      'ss-memory-journey-config-updated',
      {
        detail: { patientId },
      }
    )
  );

  return cleanedConfig;
}

function createDemoMemoryJourneyConfig(patientId) {
  return {
    patientId,

    language: "en",

    routeId: "demo-town-route",

    route: {
      id: "demo-town-route",

      title: "Morning Walk Memory Journey",

      startMessage:
        "Welcome. Listen carefully and remember the places you see along the way.",

      steps: [
        {
          id: "demo-step-1",
          instruction:
            "Walk straight towards the Hanuman Temple.",
          direction: "straight",
          landmark: "Hanuman Temple",
        },

        {
          id: "demo-step-2",
          instruction:
            "At the park, turn left.",
          direction: "left",
          landmark: "Community Park",
        },

        {
          id: "demo-step-3",
          instruction:
            "Continue straight past the local shop.",
          direction: "straight",
          landmark: "Local Shop",
        },

        {
          id: "demo-step-4",
          instruction:
            "At the next junction, turn right.",
          direction: "right",
          landmark: "Neighbourhood House",
        },

        {
          id: "demo-step-5",
          instruction:
            "Continue straight to complete the journey.",
          direction: "straight",
          landmark: "Community Park",
        },
      ],
    },

    landmarks: [
      {
        id: "hanuman-temple",
        name: "Hanuman Temple",
        type: "temple",
        side: "left",
      },

      {
        id: "community-park",
        name: "Community Park",
        type: "park",
        side: "right",
      },

      {
        id: "local-shop",
        name: "Local Shop",
        type: "shop",
        side: "right",
      },

      {
        id: "neighbourhood-house",
        name: "Neighbourhood House",
        type: "house",
        side: "left",
      },
    ],

    accessibility: {
      voiceEnabled: true,
      controlMode: "buttons",
      largeText: true,
    },

    difficulty: {
      level: 1,
      speed: "slow",
      hesitationThresholdMs: 5000,
    },

    isDemo: true,

    updatedAt:
      new Date().toISOString(),
  };
}

export { createDemoMemoryJourneyConfig };

export function getMemoryJourneyConfig(
  patientId
) {
  if (!patientId) return null;

  return readJson(
    `${CONFIG_PREFIX}${patientId}`,
    null
  );
}

export function deleteMemoryJourneyConfig(
  patientId
) {
  if (!patientId) return;

  try {
    localStorage.removeItem(
      `${CONFIG_PREFIX}${patientId}`
    );
  } catch {
    // Ignore
  }
}

export function createMemoryJourneySession(
  patientId,
  metadata = {}
) {
  return {
    sessionId:
      `mj-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,

    patientId,

    startedAt:
      new Date().toISOString(),

    completedAt: null,

    language:
      metadata.language || '',

    routeId:
      metadata.routeId || '',

    difficulty:
      metadata.difficulty || 1,

    turns: [],

    landmarks: [],

    obstacles: [],

    completed: false,
  };
}

export function saveMemoryJourneySession(
  patientId,
  session
) {
  if (!patientId || !session) {
    return null;
  }

  const key =
    `${SESSION_PREFIX}${patientId}`;

  const sessions =
    readJson(key, []);

  const updatedSessions =
    Array.isArray(sessions)
      ? [...sessions, session]
      : [session];

  writeJson(
    key,
    updatedSessions
  );

  window.dispatchEvent(
    new CustomEvent(
      'ss-memory-journey-session-updated',
      {
        detail: {
          patientId,
          session,
        },
      }
    )
  );

  return session;
}

export function getMemoryJourneySessions(
  patientId
) {
  if (!patientId) return [];

  const sessions = readJson(
    `${SESSION_PREFIX}${patientId}`,
    []
  );

  return Array.isArray(sessions)
    ? sessions
    : [];
}

export function getLatestMemoryJourneySession(
  patientId
) {
  const sessions =
    getMemoryJourneySessions(patientId);

  if (!sessions.length) {
    return null;
  }

  return sessions[
    sessions.length - 1
  ];
}

export function subscribeMemoryJourneyChange(
  onChange
) {
  const handler = (event) => {
    onChange(event.detail);
  };

  window.addEventListener(
    'ss-memory-journey-session-updated',
    handler
  );

  window.addEventListener(
    'ss-memory-journey-config-updated',
    handler
  );

  return () => {
    window.removeEventListener(
      'ss-memory-journey-session-updated',
      handler
    );

    window.removeEventListener(
      'ss-memory-journey-config-updated',
      handler
    );
  };
}