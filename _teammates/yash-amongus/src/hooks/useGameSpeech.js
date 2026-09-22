import { useCallback, useEffect, useRef, useState } from 'react';
import {
  VOICE_EVENTS,
  notifyGameVoiceStart,
  notifyGameVoiceStop,
  onVoice,
} from '../lib/voiceBus';

export const SPEECH_BCP47 = {
  as: 'as-IN',
  hi: 'hi-IN',
  en: 'en-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  kha: 'en-IN',
  lus: 'en-IN',
  mni: 'bn-IN',
  brx: 'hi-IN',
};

const FEMALE_HINT = /female|zira|samantha|veena|heera|kalpana|kajal|vaishali|neerja|swara|sonia|moira|karen|tessa|fiona|victoria|ava|susan|hazel|linda|heera|aditi|shruti/;
const MALE_HINT = /male|david|ravi|rishi|daniel|alex|fred|george|tom|mark|guy|aaron|hemant|prabhat|pankaj/;

function langCandidates(code) {
  const primary = SPEECH_BCP47[code] || 'en-IN';
  const prefix = primary.slice(0, 2).toLowerCase();
  if (code === 'as') return [primary, 'bn-IN', 'hi-IN', 'en-IN'];
  if (code === 'mni') return ['bn-IN', 'as-IN', 'hi-IN', 'en-IN'];
  if (code === 'brx') return ['hi-IN', 'en-IN'];
  if (code === 'kha' || code === 'lus') return ['en-IN', 'en-GB', 'en-US'];
  return [primary, `${prefix}-IN`, prefix, 'en-IN'];
}

function pickVoice(voices, lang, gender) {
  const wantFemale = gender !== 'male';
  const candidates = langCandidates(lang).map((item) => item.toLowerCase());
  const scored = voices.map((voice) => {
    const voiceLang = String(voice.lang || '').toLowerCase();
    const name = String(voice.name || '').toLowerCase();
    let score = 0;
    candidates.forEach((item, index) => {
      if (voiceLang === item || voiceLang.startsWith(item)) score += 12 - index;
      else if (item.length >= 2 && voiceLang.startsWith(item.slice(0, 2))) score += 4 - index * 0.2;
    });
    if (wantFemale && (FEMALE_HINT.test(name) || /female/.test(name))) score += 8;
    if (!wantFemale && (MALE_HINT.test(name) || /male/.test(name))) score += 8;
    if (wantFemale && MALE_HINT.test(name) && !FEMALE_HINT.test(name)) score -= 5;
    if (!wantFemale && FEMALE_HINT.test(name) && !MALE_HINT.test(name)) score -= 5;
    if (/google|microsoft|apple|natural/.test(name)) score += 1;
    return { voice, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.score > 0 ? scored[0].voice : voices[0] || null;
}

function cancelSynth() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

export function useGameSpeech({ lang = 'en', gender = 'female' } = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const utteranceRef = useRef(null);
  const onEndRef = useRef(null);
  const langRef = useRef(lang);
  const genderRef = useRef(gender);
  langRef.current = lang;
  genderRef.current = gender;

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return undefined;
    const load = () => setVoices(window.speechSynthesis.getVoices() || []);
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, []);

  const stop = useCallback(() => {
    onEndRef.current = null;
    utteranceRef.current = null;
    cancelSynth();
    setIsSpeaking(false);
    notifyGameVoiceStop();
  }, []);

  const speak = useCallback((text, { onEnd, pauseMs = 0 } = {}) => {
    const cleaned = String(text || '').replace(/\s+/g, ' ').trim();
    if (!cleaned || typeof window === 'undefined' || !window.speechSynthesis) {
      onEnd?.();
      return;
    }

    cancelSynth();
    notifyGameVoiceStart();
    setIsSpeaking(true);
    onEndRef.current = onEnd;

    const run = () => {
      const utterance = new SpeechSynthesisUtterance(cleaned);
      const currentLang = langRef.current;
      utterance.lang = SPEECH_BCP47[currentLang] || langCandidates(currentLang)[0] || 'en-IN';
      utterance.rate = 0.94;
      utterance.pitch = genderRef.current === 'male' ? 0.95 : 1.0;
      utterance.volume = 1;
      const chosen = pickVoice(window.speechSynthesis.getVoices() || voices, currentLang, genderRef.current);
      if (chosen) {
        utterance.voice = chosen;
        if (chosen.lang) utterance.lang = chosen.lang;
      }
      utterance.onend = () => {
        utteranceRef.current = null;
        setIsSpeaking(false);
        const done = onEndRef.current;
        onEndRef.current = null;
        done?.();
      };
      utterance.onerror = () => {
        utteranceRef.current = null;
        setIsSpeaking(false);
        const done = onEndRef.current;
        onEndRef.current = null;
        done?.();
      };
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    window.setTimeout(run, pauseMs);
  }, [voices]);

  useEffect(() => {
    const halt = () => stop();
    const offOpen = onVoice(VOICE_EVENTS.COMPANION_OPEN, halt);
    const offStop = onVoice(VOICE_EVENTS.STOP_GAME, halt);
    return () => {
      offOpen();
      offStop();
      halt();
    };
  }, [stop]);

  return { speak, stop, isSpeaking };
}
