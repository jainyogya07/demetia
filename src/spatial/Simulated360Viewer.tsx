import { useEffect, useRef } from 'react';
import { Compass, X } from 'lucide-react';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';
import { panoForCity } from './ossPanoramas';
import './Simulated360Viewer.css';

function degToRad(deg: number) {
  return ((((deg % 360) + 360) % 360) * Math.PI) / 180;
}

function radToDeg(rad: number) {
  return ((rad * 180) / Math.PI + 360) % 360;
}

type Cityish = {
  theme?: string;
  id?: string;
  viewerTitle?: string;
};

export default function Simulated360Viewer({
  heading = 0,
  playing = false,
  compact = false,
  fullscreen = false,
  onClose,
  city,
}: {
  heading?: number;
  playing?: boolean;
  compact?: boolean;
  fullscreen?: boolean;
  onClose?: () => void;
  city?: Cityish;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const yawOff = useRef(0);
  const headingRef = useRef(heading);
  const applyingRef = useRef(false);
  const pano = panoForCity(city);
  const title = city?.viewerTitle || 'Simulation · 360°';

  headingRef.current = heading;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;

    let cancelled = false;
    let viewer: Viewer | null = null;
    let objUrl: string | null = null;
    let ro: ResizeObserver | null = null;
    const onPos = (e: { position?: { yaw: number } }) => {
      if (applyingRef.current) return;
      const yaw = e.position?.yaw;
      if (yaw == null) return;
      yawOff.current = radToDeg(yaw) - headingRef.current;
    };

    (async () => {
      const res = await fetch(pano.src);
      const blob = await res.blob();
      if (cancelled) return;
      objUrl = URL.createObjectURL(blob);
      if (cancelled) return;
      viewer = new Viewer({
        container: el,
        panorama: objUrl,
        navbar: false,
        useXmpData: false,
        defaultYaw: degToRad(headingRef.current),
        defaultPitch: 0,
        mousewheel: !compact,
        mousemove: true,
        touchmoveTwoFingers: false,
        loadingTxt: 'Loading 360…',
      });
      viewerRef.current = viewer;
      yawOff.current = 0;
      viewer.addEventListener('position-updated', onPos as never);
      ro = new ResizeObserver(() => viewer?.autoSize());
      ro.observe(el);
    })().catch(() => undefined);

    return () => {
      cancelled = true;
      ro?.disconnect();
      if (viewer) {
        viewer.removeEventListener('position-updated', onPos as never);
        viewer.destroy();
      }
      viewerRef.current = null;
      if (objUrl) URL.revokeObjectURL(objUrl);
    };
  }, [pano.src, compact]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return undefined;
    applyingRef.current = true;
    const yaw = degToRad(heading + yawOff.current);
    try {
      viewer.rotate({ yaw, pitch: 0 });
    } catch {
      /* viewer not ready yet */
    }
    const t = window.setTimeout(() => {
      applyingRef.current = false;
    }, 40);
    return () => window.clearTimeout(t);
  }, [heading]);

  const stage = (
    <div className={`sim360 ${compact ? 'is-compact' : ''}`}>
      <div className="sim360-stage" ref={wrapRef} />
      <div className="sim360-hud">
        <div className="sim360-chip">
          <Compass size={12} /> Simulation · 360°
        </div>
        <div className="sim360-compass" aria-hidden>
          <div className="sim360-needle" style={{ transform: `rotate(${heading}deg)` }} />
        </div>
        {!compact && (
          <div className="sim360-hint">
            <span>Drag to look around</span>
            <span>{Math.round(((heading % 360) + 360) % 360)}°</span>
          </div>
        )}
        {!compact && <div className="sim360-credit">{pano.credit}</div>}
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="sim360-fullscreen" role="dialog" aria-label="Simulation 360 look-around">
        <div className="sim360-fs-bar">
          <strong>{title}</strong>
          <button type="button" onClick={onClose} aria-label="Close 360 view">
            <X size={20} />
          </button>
        </div>
        <div className="sim360-fs-stage">{stage}</div>
      </div>
    );
  }

  return stage;
}
