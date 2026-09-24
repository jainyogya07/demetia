// @ts-nocheck — leftover JS-shaped module; runtime unchanged
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
  // Accept either (patientId, config) or a single config object with patientId.
  if (patientId && typeof patientId === 'object' && config == null) {
    config = patientId;
    patientId = config.patientId;
  }

  if (!patientId) {
    throw new Error(
      'patientId is required'
    );
  }

  const cleanedConfig = {
    ...(config || {}),

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