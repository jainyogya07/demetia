import { useCallback, useEffect, useRef } from 'react';
import { voiceNameForGender } from '../data/liveVoices';
import { claimVoice, releaseVoice, VOICE_EVENTS, onVoice } from '../lib/voiceBus';
import { useGeminiLive } from './useGeminiLive';
import { useGameSpeech } from './useGameSpeech';

function speakCue(text) {
  return `Speak this memory out loud now, every sentence, in a calm human voice. Do not summarise. Do not stay silent.\n\n${text}`;
}

export function useStoryVoice({ lang = 'en', gender = 'female', languageName = 'English' } = {}) {
  const voiceName = voiceNameForGender(gender);
  const {
    connect,
    disconnect,
    sendText,
    stopGeneration,
    isConnected,
    isSpeaking,
    lastError,
  } = useGeminiLive({
    uiLanguageName: languageName,
    voiceName,
    persona: 'storyteller',
    gender,
  });
  const browser = useGameSpeech({ lang, gender });

  const pendingRef = useRef(null);
  const waitingSpeechRef = useRef(false);
  const heardSpeechRef = useRef(false);
  const startedAtRef = useRef(0);
  const minMsRef = useRef(4000);
  const fallbackTimerRef = useRef(null);
  const watchdogRef = useRef(null);
  const liveFailedRef = useRef(false);
  const sendTextRef = useRef(sendText);
  sendTextRef.current = sendText;
  const connectRef = useRef(connect);
  connectRef.current = connect;
  const disconnectRef = useRef(disconnect);
  disconnectRef.current = disconnect;
  const isSpeakingRef = useRef(isSpeaking);
  isSpeakingRef.current = isSpeaking;

  const clearTimers = () => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
  };

  const finish = useCallback(() => {
    waitingSpeechRef.current = false;
    heardSpeechRef.current = false;
    clearTimers();
    const done = pendingRef.current?.onEnd;
    pendingRef.current = null;
    done?.();
  }, []);

  const speakBrowser = useCallback((text, onEnd) => {
    liveFailedRef.current = true;
    waitingSpeechRef.current = false;
    heardSpeechRef.current = false;
    browser.speak(text, { onEnd });
  }, [browser]);

  const sendStory = useCallback((text) => {
    waitingSpeechRef.current = true;
    heardSpeechRef.current = false;
    startedAtRef.current = Date.now();
    sendTextRef.current(speakCue(text));
    watchdogRef.current = window.setTimeout(() => {
      if (waitingSpeechRef.current && !heardSpeechRef.current && !isSpeakingRef.current) {
        const pending = pendingRef.current;
        const leftover = pending?.text || text;
        const cb = pending?.onEnd;
        pendingRef.current = null;
        waitingSpeechRef.current = false;
        stopGeneration();
        speakBrowser(leftover, cb);
      }
    }, 5500);
  }, [speakBrowser, stopGeneration]);

  useEffect(() => {
    if (!isConnected || !pendingRef.current?.text) return;
    const { text } = pendingRef.current;
    pendingRef.current.text = null;
    liveFailedRef.current = false;
    sendStory(text);
  }, [isConnected, sendStory]);

  useEffect(() => {
    if (isSpeaking) heardSpeechRef.current = true;
    if (!waitingSpeechRef.current) return;
    if (isSpeaking) return;
    if (!heardSpeechRef.current) return;
    const elapsed = Date.now() - startedAtRef.current;
    const remain = Math.max(700, minMsRef.current - elapsed);
    const timer = window.setTimeout(() => {
      if (waitingSpeechRef.current && heardSpeechRef.current && !isSpeakingRef.current) {
        finish();
      }
    }, remain);
    return () => clearTimeout(timer);
  }, [isSpeaking, finish]);

  useEffect(() => {
    if (!lastError) return;
    const pending = pendingRef.current;
    if (!pending?.text && !waitingSpeechRef.current) return;
    const text = pending?.text;
    const onEnd = pending?.onEnd;
    pendingRef.current = null;
    waitingSpeechRef.current = false;
    heardSpeechRef.current = false;
    clearTimers();
    if (text) speakBrowser(text, onEnd);
    else onEnd?.();
  }, [lastError, speakBrowser]);

  const stop = useCallback(() => {
    clearTimers();
    pendingRef.current = null;
    waitingSpeechRef.current = false;
    heardSpeechRef.current = false;
    stopGeneration();
    browser.stop();
    releaseVoice('stories');
  }, [stopGeneration, browser]);

  const prepare = useCallback(() => {
    claimVoice('stories');
    liveFailedRef.current = false;
    connectRef.current({ startMic: false, mode: 'text' });
  }, []);

  const speak = useCallback((text, { onEnd, pauseMs = 0, minMs = 4000 } = {}) => {
    const cleaned = String(text || '').replace(/\s+/g, ' ').trim();
    if (!cleaned) {
      onEnd?.();
      return;
    }
    claimVoice('stories');
    browser.stop();
    clearTimers();
    minMsRef.current = minMs;

    const run = () => {
      pendingRef.current = { text: cleaned, onEnd };
      startedAtRef.current = Date.now();
      if (liveFailedRef.current) {
        pendingRef.current = { text: null, onEnd };
        speakBrowser(cleaned, onEnd);
        return;
      }
      if (isConnected) {
        pendingRef.current.text = null;
        sendStory(cleaned);
      } else {
        connectRef.current({ startMic: false, mode: 'text' });
      }
      fallbackTimerRef.current = setTimeout(() => {
        if (!waitingSpeechRef.current && pendingRef.current?.text) {
          const { text: leftover, onEnd: cb } = pendingRef.current;
          pendingRef.current = { text: null, onEnd: cb };
          speakBrowser(leftover, cb);
        }
      }, 8000);
    };

    window.setTimeout(run, pauseMs || 0);
  }, [browser, isConnected, speakBrowser, sendStory]);

  useEffect(() => {
    const dropIfNotOwner = (event) => {
      if (event.detail?.owner === 'stories') return;
      clearTimers();
      pendingRef.current = null;
      waitingSpeechRef.current = false;
      stopGeneration();
      browser.stop();
      disconnectRef.current();
    };
    return onVoice(VOICE_EVENTS.VOICE_CLAIM, dropIfNotOwner);
  }, [browser, stopGeneration]);

  useEffect(() => () => {
    clearTimers();
    stopGeneration();
    disconnect();
    releaseVoice('stories');
  }, [disconnect, stopGeneration]);

  return {
    speak,
    stop,
    prepare,
    isSpeaking: isSpeaking || browser.isSpeaking,
  };
}
