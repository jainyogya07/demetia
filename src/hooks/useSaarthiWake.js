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
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'hi-IN';
    rec.maxAlternatives = 1;

    rec.onresult = (event) => {
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
      if (stopped) return;
      try {
        rec.start();
      } catch {
        /* already started */
      }
    };

    rec.onend = restart;
    rec.onerror = () => {
      if (!stopped) window.setTimeout(restart, 400);
    };

    const kick = () => restart();
    restart();
    window.addEventListener('pointerdown', kick, { once: true });

    return () => {
      stopped = true;
      window.removeEventListener('pointerdown', kick);
      rec.onend = null;
      rec.onerror = null;
      try {
        rec.stop();
      } catch {
        /* ignore */
      }
    };
  }, [enabled]);
}
