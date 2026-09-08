/** Browser TTS used when Gemini Live audio chunks are silent or blocked. */

let lastUtterance = null;

export function cancelSpeakFallback() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
  lastUtterance = null;
}

export function speakFallback(text, lang = 'en-IN') {
  const line = String(text || '').replace(/<<[^>]+>>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!line || typeof window === 'undefined' || !window.speechSynthesis) return false;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(line.slice(0, 420));
    utterance.lang = lang || 'en-IN';
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;
    const voices = window.speechSynthesis.getVoices() || [];
    const prefix = utterance.lang.slice(0, 2).toLowerCase();
    const voice = voices.find((item) => String(item.lang || '').toLowerCase() === utterance.lang.toLowerCase())
      || voices.find((item) => String(item.lang || '').toLowerCase().startsWith(prefix));
    if (voice) utterance.voice = voice;
    lastUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
}

export function ttsLangForName(languageName = 'English') {
  const name = String(languageName || '').toLowerCase();
  if (name.includes('hindi')) return 'hi-IN';
  if (name.includes('assamese')) return 'as-IN';
  if (name.includes('bengali') || name.includes('bangla')) return 'bn-IN';
  if (name.includes('tamil')) return 'ta-IN';
  if (name.includes('telugu')) return 'te-IN';
  if (name.includes('marathi')) return 'mr-IN';
  if (name.includes('gujarati')) return 'gu-IN';
  if (name.includes('kannada')) return 'kn-IN';
  if (name.includes('malayalam')) return 'ml-IN';
  if (name.includes('punjabi')) return 'pa-IN';
  return 'en-IN';
}
