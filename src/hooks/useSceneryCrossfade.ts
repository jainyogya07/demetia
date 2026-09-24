// @ts-nocheck — leftover JS-shaped module; runtime unchanged
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { preloadScenery } from '../lib/regionBackgrounds';

const FADE_MS = 320;

/**
 * Dual-layer crossfade for scenery URLs.
 *
 * Important: do NOT list `overlay` in the effect deps. Setting overlay used to
 * re-run the effect, cancel the rAF that sets opacity→1, then early-return —
 * leaving the new image stuck at opacity 0 (visible scenery never changed).
 */
export function useSceneryCrossfade(src, key) {
  const reduceMotion = useReducedMotion();
  const [base, setBase] = useState({ src, key });
  const [overlay, setOverlay] = useState<unknown>(null);
  const [overlayOn, setOverlayOn] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    if (key === base.key) return undefined;

    const id = ++requestId.current;
    let cancelled = false;
    let showRaf = 0;
    let fallbackTimer = 0;

    preloadScenery(src).then(() => {
      if (cancelled || requestId.current !== id) return;

      if (reduceMotion) {
        setBase({ src, key });
        setOverlay(null);
        setOverlayOn(false);
        return;
      }

      setOverlay({ src, key });
      setOverlayOn(false);
      showRaf = window.requestAnimationFrame(() => {
        showRaf = window.requestAnimationFrame(() => {
          if (cancelled || requestId.current !== id) return;
          setOverlayOn(true);
        });
      });
      // Commit even if transitionend is skipped (tab backgrounded, etc.)
      fallbackTimer = window.setTimeout(() => {
        if (cancelled || requestId.current !== id) return;
        setBase({ src, key });
        setOverlay(null);
        setOverlayOn(false);
      }, FADE_MS + 120);
    });

    return () => {
      cancelled = true;
      if (showRaf) window.cancelAnimationFrame(showRaf);
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
    };
  }, [src, key, base.key, reduceMotion]);

  const commitOverlay = () => {
    if (!overlay || !overlayOn) return;
    setBase(overlay);
    setOverlay(null);
    setOverlayOn(false);
  };

  return { base, overlay, overlayOn, commitOverlay, fadeMs: FADE_MS };
}
