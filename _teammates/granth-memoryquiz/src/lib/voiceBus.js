/** Game TTS and Gemini Live must never speak at the same time. */

export const VOICE_EVENTS = {
  GAME_START: 'smriti:game-voice-start',
  GAME_STOP: 'smriti:game-voice-stop',
  COMPANION_OPEN: 'smriti:companion-open',
  STOP_GAME: 'smriti:stop-game-voice',
};

export function emitVoice(type) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(type));
}

export function onVoice(type, handler) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(type, handler);
  return () => window.removeEventListener(type, handler);
}

export function notifyGameVoiceStart() {
  emitVoice(VOICE_EVENTS.GAME_START);
}

export function notifyGameVoiceStop() {
  emitVoice(VOICE_EVENTS.GAME_STOP);
}

export function notifyCompanionOpen() {
  emitVoice(VOICE_EVENTS.COMPANION_OPEN);
  emitVoice(VOICE_EVENTS.STOP_GAME);
}

export function requestStopGameVoice() {
  emitVoice(VOICE_EVENTS.STOP_GAME);
}
