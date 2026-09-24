import { useEffect, useRef } from 'react';
import { Compass, X } from 'lucide-react';
import './Simulated360Viewer.css';

function makeAssamPanorama(w, h, caption) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');

  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.48);
  sky.addColorStop(0, '#7ec8e3');
  sky.addColorStop(0.45, '#c5e4ef');
  sky.addColorStop(1, '#f3e6c8');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(255, 214, 120, 0.95)';
  ctx.beginPath();
  ctx.arc(w * 0.62, h * 0.18, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 236, 190, 0.35)';
  ctx.beginPath();
  ctx.arc(w * 0.62, h * 0.18, 70, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 9; i += 1) {
    const cx = (i / 9) * w;
    const peak = h * 0.34 + Math.sin(i * 1.7) * 18;
    ctx.fillStyle = i % 2 ? '#5d7a5a' : '#4a6a52';
    ctx.beginPath();
    ctx.moveTo(cx - 180, h * 0.5);
    ctx.lineTo(cx, peak);
    ctx.lineTo(cx + 180, h * 0.5);
    ctx.closePath();
    ctx.fill();
  }

  const land = ctx.createLinearGradient(0, h * 0.46, 0, h);
  land.addColorStop(0, '#8fbf6a');
  land.addColorStop(0.35, '#5e9a4e');
  land.addColorStop(0.55, '#c9b07a');
  land.addColorStop(0.72, '#4a7ea8');
  land.addColorStop(1, '#2f5f4a');
  ctx.fillStyle = land;
  ctx.fillRect(0, h * 0.46, w, h * 0.54);

  ctx.fillStyle = '#3d7ca8';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.68);
  for (let x = 0; x <= w; x += 8) {
    ctx.lineTo(x, h * 0.66 + Math.sin(x / 90) * 10);
  }
  ctx.lineTo(w, h * 0.78);
  ctx.lineTo(0, h * 0.78);
  ctx.fill();

  ctx.fillStyle = '#6b675e';
  ctx.fillRect(0, h * 0.78, w, 28);
  ctx.fillStyle = '#8a8578';
  ctx.fillRect(0, h * 0.8, w, 8);

  for (let i = 0; i < 40; i += 1) {
    const x = (i / 40) * w + (i % 3) * 12;
    const base = h * 0.78;
    const hh = 70 + (i % 5) * 16;
    ctx.fillStyle = i % 4 === 0 ? '#d9c4a0' : '#c4b089';
    ctx.fillRect(x, base - hh, 28 + (i % 3) * 6, hh);
    ctx.fillStyle = '#7a3b2e';
    ctx.fillRect(x, base - hh - 14, 34, 16);
  }

  for (let i = 0; i < 70; i += 1) {
    const x = (i * 37) % w;
    const y = h * 0.52 + (i % 7) * 8;
    ctx.fillStyle = '#2f5a32';
    ctx.beginPath();
    ctx.moveTo(x, y + 40);
    ctx.lineTo(x + 16, y);
    ctx.lineTo(x + 32, y + 40);
    ctx.fill();
    ctx.fillStyle = '#4a3a28';
    ctx.fillRect(x + 14, y + 40, 5, 18);
  }

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = 'bold 22px Georgia, serif';
  ctx.fillText(caption, 48, h * 0.14);
  return c;
}

function makeDelhiPanorama(w, h, caption) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');

  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.5);
  sky.addColorStop(0, '#6a9cc8');
  sky.addColorStop(0.4, '#d7c4a4');
  sky.addColorStop(1, '#f0d3a8');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(255, 176, 92, 0.92)';
  ctx.beginPath();
  ctx.arc(w * 0.28, h * 0.2, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 210, 150, 0.28)';
  ctx.beginPath();
  ctx.arc(w * 0.28, h * 0.2, 78, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(240, 236, 228, 0.55)';
  for (let i = 0; i < 6; i += 1) {
    const x = w * (0.08 + i * 0.16);
    ctx.beginPath();
    ctx.ellipse(x, h * 0.3, 90, 18, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#d8d2c6';
  ctx.beginPath();
  ctx.moveTo(w * 0.72, h * 0.48);
  ctx.lineTo(w * 0.76, h * 0.28);
  ctx.lineTo(w * 0.8, h * 0.48);
  ctx.fill();
  ctx.fillRect(w * 0.735, h * 0.4, 50, 90);

  ctx.fillStyle = '#cfc8b8';
  ctx.beginPath();
  ctx.arc(w * 0.48, h * 0.42, 42, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(w * 0.44, h * 0.42, 80, 70);

  const land = ctx.createLinearGradient(0, h * 0.46, 0, h);
  land.addColorStop(0, '#6f8f58');
  land.addColorStop(0.28, '#3f6b46');
  land.addColorStop(0.5, '#c4b496');
  land.addColorStop(0.72, '#8a8478');
  land.addColorStop(1, '#5a554c');
  ctx.fillStyle = land;
  ctx.fillRect(0, h * 0.46, w, h * 0.54);

  ctx.fillStyle = '#7a756c';
  ctx.fillRect(0, h * 0.78, w, 32);
  ctx.fillStyle = '#9a9488';
  ctx.fillRect(0, h * 0.81, w, 6);

  for (let i = 0; i < 28; i += 1) {
    const x = (i / 28) * w + (i % 2) * 10;
    const base = h * 0.78;
    const hh = 88 + (i % 4) * 22;
    ctx.fillStyle = i % 3 === 0 ? '#d4b896' : '#c9b089';
    ctx.fillRect(x, base - hh, 42 + (i % 2) * 10, hh);
    ctx.fillStyle = '#8d6a4a';
    ctx.fillRect(x, base - hh - 10, 48, 12);
    ctx.fillStyle = 'rgba(40, 28, 18, 0.35)';
    for (let r = 0; r < 3; r += 1) {
      for (let col = 0; col < 3; col += 1) {
        ctx.fillRect(x + 8 + col * 12, base - hh + 16 + r * 22, 8, 10);
      }
    }
  }

  for (let i = 0; i < 55; i += 1) {
    const x = (i * 41) % w;
    const y = h * 0.5 + (i % 6) * 7;
    ctx.fillStyle = i % 2 ? '#1f4a32' : '#2d5c3a';
    ctx.beginPath();
    ctx.ellipse(x + 18, y + 10, 22, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3d2e20';
    ctx.fillRect(x + 16, y + 34, 6, 22);
  }

  ctx.fillStyle = 'rgba(255,255,255,0.58)';
  ctx.font = 'bold 22px Georgia, serif';
  ctx.fillText(caption, 48, h * 0.14);
  return c;
}

function makePanorama(theme, caption) {
  if (theme === 'delhi') return makeDelhiPanorama(2048, 1024, caption);
  return makeAssamPanorama(2048, 1024, caption);
}

export default function Simulated360Viewer({
  heading = 0,
  playing = false,
  compact = false,
  fullscreen = false,
  onClose,
  city,
}) {
  const wrapRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  const panoRef = useRef<any>(null);
  const yawOff = useRef(0);
  const pitch = useRef(0);
  const drag = useRef<any>(null);
  const headingRef = useRef(heading);
  const playingRef = useRef(playing);
  const theme = city?.theme || 'assam';
  const caption = city?.panoCaption || 'Assam · simulated street look';
  const title = city?.viewerTitle || 'Simulated 360° walk · Assam';

  headingRef.current = heading;
  playingRef.current = playing;

  useEffect(() => {
    panoRef.current = makePanorama(theme, caption);
    yawOff.current = 0;
  }, [theme, caption]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let t0 = performance.now();

    const draw = (now) => {
      const wrap = wrapRef.current;
      if (!wrap) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const w = wrap.clientWidth || 320;
      const h = wrap.clientHeight || 180;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const pano = panoRef.current;
      if (!pano) {
        raf = requestAnimationFrame(draw);
        return;
      }

      if (playingRef.current) {
        const dt = (now - t0) / 1000;
        pitch.current = Math.sin(dt * 1.6) * 4;
      }

      const yaw = ((headingRef.current + yawOff.current) % 360 + 360) % 360;
      const bob = playingRef.current ? Math.sin((now - t0) * 0.006) * 6 : 0;
      const fov = 92;
      const srcW = pano.width * (fov / 360);
      const srcH = pano.height * 0.58;
      const srcX = ((yaw / 360) * pano.width + pano.width) % pano.width;
      const srcY = Math.max(40, Math.min(pano.height - srcH - 8, 70 + pitch.current * 3 + bob));

      ctx.fillStyle = theme === 'delhi' ? '#1a1610' : '#0d1c18';
      ctx.fillRect(0, 0, w, h);

      if (srcX + srcW <= pano.width) {
        ctx.drawImage(pano, srcX, srcY, srcW, srcH, 0, 0, w, h);
      } else {
        const w1 = pano.width - srcX;
        const r1 = w1 / srcW;
        ctx.drawImage(pano, srcX, srcY, w1, srcH, 0, 0, w * r1, h);
        ctx.drawImage(pano, 0, srcY, srcW - w1, srcH, w * r1, 0, w * (1 - r1), h);
      }

      const g = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.75);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(1, theme === 'delhi' ? 'rgba(24, 16, 8, 0.38)' : 'rgba(8, 20, 16, 0.35)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [theme]);

  const onPointerDown = (e) => {
    drag.current = { x: e.clientX, y: e.clientY, yaw: yawOff.current, pitch: pitch.current };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    yawOff.current = drag.current.yaw + (e.clientX - drag.current.x) * 0.28;
    pitch.current = Math.max(-18, Math.min(18, drag.current.pitch + (e.clientY - drag.current.y) * 0.12));
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const stage = (
    <div
      className={`sim360 sim360-${theme}`}
      ref={wrapRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <canvas ref={canvasRef} className="sim360-canvas" />
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
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="sim360-fullscreen">
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
