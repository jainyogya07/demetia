import { useEffect, useRef } from 'react';
import { isWakePhrase } from '../lib/assistCatalog';

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
    let rec = null;

    try {
      rec = new SR();
      rec.continuous = true;
      rec.interimResults = true;
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

    const restart = () => {
      if (stopped || isRunning || errorCount > 3) return;
      try {
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
      if (!stopped && errorCount <= 3) {
        restartTimer = window.setTimeout(restart, 1200);
      }
    };

    rec.onerror = (event) => {
      isRunning = false;
      const err = event?.error;
      // Fatal permission or service errors - do NOT loop
      if (err === 'not-allowed' || err === 'service-not-allowed' || err === 'audio-capture') {
        stopped = true;
        return;
      }
      errorCount += 1;
      if (!stopped && errorCount <= 3) {
        window.clearTimeout(restartTimer);
        restartTimer = window.setTimeout(restart, 1500 * errorCount);
      }
    };

    const kick = () => {
      if (!isRunning && !stopped && errorCount <= 3) restart();
    };

    restart();
    window.addEventListener('pointerdown', kick, { once: true });

    return () => {
      stopped = true;
      isRunning = false;
      window.clearTimeout(restartTimer);
      window.removeEventListener('pointerdown', kick);
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
