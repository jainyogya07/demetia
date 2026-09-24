import { useEffect, useRef } from 'react';
import { isWakePhrase } from '../lib/assistCatalog';

/**
 * Sparse wake-word listener. Avoids continuous mic restarts that flicker the
 * browser/OS recording indicator while the dashboard is idle.
 */
export function useSaarthiWake({ enabled, onWake }) {
  const onWakeRef = useRef(onWake);
  onWakeRef.current = onWake;

  useEffect(() => {
    if (!enabled) return undefined;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return undefined;

    let stopped = false;
    let errorCount = 0;
    let restartTimer = null;
    let isRunning = false;
    let lastStartAt = 0;
    let rec = null;

    const MIN_GAP_MS = 8000;
    const NO_SPEECH_GAP_MS = 16000;

    try {
      rec = new SR();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'hi-IN';
      rec.maxAlternatives = 1;
    } catch (e) {
      console.warn('SpeechRecognition initialization failed:', e);
      return undefined;
    }

    rec.onresult = (event) => {
      errorCount = 0;
      let text = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        text += event.results[i][0]?.transcript || '';
      }
      if (isWakePhrase(text)) {
        stopped = true;
        rec.onend = null;
        try {
          rec.stop();
        } catch {
          /* ignore */
        }
        onWakeRef.current?.();
      }
    };

    const scheduleRestart = (delay) => {
      if (stopped || errorCount > 2) return;
      window.clearTimeout(restartTimer);
      restartTimer = window.setTimeout(restart, delay);
    };

    const restart = () => {
      if (stopped || isRunning || errorCount > 2) return;
      const since = Date.now() - lastStartAt;
      if (since < MIN_GAP_MS) {
        scheduleRestart(MIN_GAP_MS - since + 50);
        return;
      }
      try {
        lastStartAt = Date.now();
        rec.start();
        isRunning = true;
      } catch {
        /* already started or busy */
      }
    };

    rec.onstart = () => {
      isRunning = true;
      errorCount = 0;
    };

    rec.onend = () => {
      isRunning = false;
      if (!stopped && errorCount <= 2) {
        scheduleRestart(MIN_GAP_MS);
      }
    };

    rec.onerror = (event) => {
      isRunning = false;
      const err = event?.error;
      if (err === 'not-allowed' || err === 'service-not-allowed' || err === 'audio-capture') {
        stopped = true;
        return;
      }
      if (err === 'no-speech' || err === 'aborted') {
        scheduleRestart(NO_SPEECH_GAP_MS);
        return;
      }
      errorCount += 1;
      if (!stopped && errorCount <= 2) {
        scheduleRestart(MIN_GAP_MS * errorCount);
      }
    };

    // Start only after a user gesture so browsers don't flash mic on cold load.
    const kick = () => {
      if (!isRunning && !stopped && errorCount <= 2) restart();
    };

    window.addEventListener('pointerdown', kick, { once: true });
    window.addEventListener('keydown', kick, { once: true });

    return () => {
      stopped = true;
      isRunning = false;
      window.clearTimeout(restartTimer);
      window.removeEventListener('pointerdown', kick);
      window.removeEventListener('keydown', kick);
      if (rec) {
        rec.onstart = null;
        rec.onend = null;
        rec.onerror = null;
        rec.onresult = null;
        try {
          rec.stop();
        } catch {
          /* ignore */
        }
      }
    };
  }, [enabled]);
}
