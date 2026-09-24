/** At most one Gemini Live session: companion | assist | stories | null. */

let voiceOwner = null;

export const VOICE_EVENTS = {
  GAME_START: 'smriti:game-voice-start',
  GAME_STOP: 'smriti:game-voice-stop',
  COMPANION_OPEN: 'smriti:companion-open',
  STOP_GAME: 'smriti:stop-game-voice',
  VOICE_CLAIM: 'smriti:voice-claim',
};

export function emitVoice(type, detail) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(type, { detail }));
}

export function onVoice(type, handler) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(type, handler);
  return () => window.removeEventListener(type, handler);
}

export function getVoiceOwner() {
  return voiceOwner;
}

/**
 * Exclusive Gemini Live lock. Listeners must drop their session when owner !== them.
 * @param {'companion' | 'assist' | 'stories'} owner
 */
export function claimVoice(owner) {
  if (!owner) return voiceOwner;
  const prev = voiceOwner;
  voiceOwner = owner;
  emitVoice(VOICE_EVENTS.VOICE_CLAIM, { owner, prev });
  if (owner === 'companion') {
    emitVoice(VOICE_EVENTS.COMPANION_OPEN);
    emitVoice(VOICE_EVENTS.STOP_GAME);
  }
  if (owner === 'stories') {
    emitVoice(VOICE_EVENTS.GAME_START);
  }
  if (owner === 'assist') {
    emitVoice(VOICE_EVENTS.STOP_GAME);
  }
  return owner;
}

export function releaseVoice(owner) {
  if (voiceOwner !== owner) return;
  voiceOwner = null;
  if (owner === 'stories') emitVoice(VOICE_EVENTS.GAME_STOP);
}

export function notifyGameVoiceStart() {
  emitVoice(VOICE_EVENTS.GAME_START);
}

export function notifyGameVoiceStop() {
  emitVoice(VOICE_EVENTS.GAME_STOP);
}

export function notifyCompanionOpen() {
  claimVoice('companion');
}

export function requestStopGameVoice() {
  emitVoice(VOICE_EVENTS.STOP_GAME);
}
