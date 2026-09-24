import { Color, Mesh, Program, Renderer, Transform, Camera, Geometry } from 'ogl';
import { useEffect, useRef } from 'react';
import './Particles.css';

const VERT = /* glsl */ `
attribute vec3 position;
attribute vec4 random;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uSpread;
uniform float uBaseSize;
uniform float uSizeRandomness;
varying vec4 vRandom;
varying float vAlpha;
void main() {
  vRandom = random;
  vec3 pos = position * uSpread;
  pos.z *= 10.0;
  pos.y += sin(uTime * random.z + random.y * 6.28) * 0.12;
  vec4 mPos = modelMatrix * vec4(pos, 1.0);
  vec4 mvPos = viewMatrix * mPos;
  gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
  vAlpha = 0.35 + random.w * 0.45;
  gl_Position = projectionMatrix * mvPos;
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform vec3 uColor;
varying float vAlpha;
void main() {
  vec2 uv = gl_PointCoord.xy;
  float d = length(uv - vec2(0.5));
  if (d > 0.5) discard;
  float glow = smoothstep(0.5, 0.08, d);
  gl_FragColor = vec4(uColor, glow * vAlpha);
}
`;

export default function Particles({
  particleCount = 90,
  particleSpread = 8,
  speed = 0.12,
  particleColors = ['#176b58', '#2a9d8f', '#c5ddd4'],
  particleBaseSize = 90,
  className = '',
}) {
  const wrapRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;
    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 1.5), alpha: true });
    const gl = renderer.gl;
    wrap.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 18 });
    camera.position.set(0, 0, 18);
    const scene = new Transform();

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      positions[i3] = Math.random() * 2 - 1;
      positions[i3 + 1] = Math.random() * 2 - 1;
      positions[i3 + 2] = Math.random() * 2 - 1;
      const i4 = i * 4;
      randoms[i4] = Math.random();
      randoms[i4 + 1] = Math.random();
      randoms[i4 + 2] = Math.random();
      randoms[i4 + 3] = Math.random();
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
    });
    const hex = particleColors[0] || '#176b58';
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize },
        uSizeRandomness: { value: 0.9 },
        uColor: { value: new Color(hex) },
      },
      transparent: true,
      depthTest: false,
    });
    const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });
    mesh.setParent(scene);

    let raf = 0;
    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const t0 = performance.now();
    const loop = () => {
      program.uniforms.uTime.value = ((performance.now() - t0) / 1000) * speed;
      renderer.render({ scene, camera });
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (gl.canvas.parentNode === wrap) wrap.removeChild(gl.canvas);
    };
  }, [particleCount, particleSpread, speed, particleBaseSize, particleColors]);

  return <div ref={wrapRef} className={`ss-particles ${className}`.trim()} aria-hidden />;
}
