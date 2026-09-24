// @ts-nocheck — leftover JS-shaped module; runtime unchanged
import { useSceneryCrossfade } from '../hooks/useSceneryCrossfade';
import { useRegionScenery } from '../hooks/useRegionScenery';
import './RegionSceneryBackground.css';

/**
 * Fixed dual-layer scenery behind lakeside shells.
 * Base layer stays visible; overlay fades in only after decode — no remount / blank frame.
 *
 * Lock rules (see resolveRegionScenery + LanguageContext):
 * - Detect / demo region → regionExplicit lock → region scenery wins (even with English)
 * - Manual language pick → clears lock → language scenery (English → calm lake)
 */
export default function RegionSceneryBackground() {
  const { src, key } = useRegionScenery();
  const { base, overlay, overlayOn, commitOverlay, fadeMs } = useSceneryCrossfade(src, key);

  return (
    <div className="ss-region-scenery" aria-hidden>
      <div
        className="ss-region-scenery-layer is-base"
        style={{ backgroundImage: `url(${base.src})` }}
      />
      {overlay ? (
        <div
          className={`ss-region-scenery-layer is-overlay${overlayOn ? ' is-visible' : ''}`}
          style={{
            backgroundImage: `url(${overlay.src})`,
            transitionDuration: `${fadeMs}ms`,
          }}
          onTransitionEnd={commitOverlay}
        />
      ) : null}
    </div>
  );
}
