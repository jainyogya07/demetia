// @ts-nocheck — leftover JS-shaped module; runtime unchanged
import React, { useMemo } from 'react';
import './CalmNatureBackground.css';

export default function CalmNatureBackground() {
  // Precompute rich particle positions for smooth GPU performance
  const particles = useMemo(() => {
    const leaves = [
      { id: 'l1', left: '8%', delay: '0s', duration: '18s', size: 22, rotate: 35, type: 'leaf-green' },
      { id: 'l2', left: '22%', delay: '4s', duration: '24s', size: 16, rotate: -20, type: 'leaf-gold' },
      { id: 'l3', left: '38%', delay: '1s', duration: '20s', size: 24, rotate: 50, type: 'petal-peach' },
      { id: 'l4', left: '52%', delay: '7s', duration: '22s', size: 18, rotate: -35, type: 'leaf-green' },
      { id: 'l5', left: '68%', delay: '3s', duration: '26s', size: 20, rotate: 15, type: 'leaf-gold' },
      { id: 'l6', left: '82%', delay: '9s', duration: '19s', size: 22, rotate: -40, type: 'petal-peach' },
      { id: 'l7', left: '94%', delay: '5s', duration: '23s', size: 15, rotate: 30, type: 'leaf-green' },
      { id: 'l8', left: '15%', delay: '11s', duration: '25s', size: 19, rotate: -15, type: 'petal-peach' },
      { id: 'l9', left: '44%', delay: '13s', duration: '21s', size: 21, rotate: 45, type: 'leaf-gold' },
      { id: 'l10', left: '76%', delay: '15s', duration: '27s', size: 17, rotate: -25, type: 'leaf-green' },
    ];

    const fireflies = [
      { id: 'f1', left: '18%', bottom: '20%', delay: '0s', duration: '8s', size: 6 },
      { id: 'f2', left: '32%', bottom: '35%', delay: '2.5s', duration: '10s', size: 8 },
      { id: 'f3', left: '50%', bottom: '15%', delay: '1s', duration: '9s', size: 7 },
      { id: 'f4', left: '65%', bottom: '30%', delay: '3.5s', duration: '11s', size: 6 },
      { id: 'f5', left: '80%', bottom: '22%', delay: '1.8s', duration: '8.5s', size: 8 },
      { id: 'f6', left: '88%', bottom: '40%', delay: '4s', duration: '10.5s', size: 5 },
      { id: 'f7', left: '10%', bottom: '45%', delay: '2s', duration: '9.5s', size: 7 },
      { id: 'f8', left: '60%', bottom: '50%', delay: '5s', duration: '12s', size: 6 },
    ];

    return { leaves, fireflies };
  }, []);

  return (
    <div className="calm-nature-bg" aria-hidden="true">
      {/* Dynamic Sky Gradient */}
      <div className="nature-sky" />

      {/* Radiant Sun with Breathing Aura & Shifting God Rays */}
      <div className="nature-sun-system">
        <div className="nature-sun-core" />
        <div className="nature-sun-aura" />
        <div className="nature-sun-rays" />
      </div>

      {/* Layered Animated Drifting Clouds */}
      <div className="nature-clouds-layer">
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
        <div className="cloud cloud-4" />
        <div className="cloud cloud-5" />
      </div>

      {/* Animated Gliding Birds */}
      <div className="nature-birds-stream">
        <div className="bird bird-1">
          <svg viewBox="0 0 32 16" className="bird-svg">
            <path d="M0,8 Q8,0 16,8 Q24,0 32,8 Q24,6 16,10 Q8,6 0,8 Z" fill="#2D5A4C" />
          </svg>
        </div>
        <div className="bird bird-2">
          <svg viewBox="0 0 32 16" className="bird-svg">
            <path d="M0,8 Q8,0 16,8 Q24,0 32,8 Q24,6 16,10 Q8,6 0,8 Z" fill="#2D5A4C" />
          </svg>
        </div>
        <div className="bird bird-3">
          <svg viewBox="0 0 32 16" className="bird-svg">
            <path d="M0,8 Q8,0 16,8 Q24,0 32,8 Q24,6 16,10 Q8,6 0,8 Z" fill="#2D5A4C" />
          </svg>
        </div>
      </div>

      {/* Layer 1: Distant Misty Majestic Mountains */}
      <div className="nature-mountains-back">
        <svg viewBox="0 0 1440 380" preserveAspectRatio="none" className="landscape-svg">
          <path
            fill="url(#mountainGrad)"
            d="M0,220 L160,150 L320,240 L520,130 L740,260 L960,140 L1180,220 L1320,160 L1440,230 L1440,380 L0,380 Z"
          />
          <defs>
            <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#82B9A8" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#A8D4C5" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#CCEBE0" stopOpacity="0.95" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Layer 2: Midground Rolling Green Hills with Pine Silhouettes */}
      <div className="nature-hills-mid">
        <svg viewBox="0 0 1440 300" preserveAspectRatio="none" className="landscape-svg">
          <path
            fill="url(#midHillsGrad)"
            d="M0,160 C240,230 460,90 760,180 C1040,260 1260,120 1440,170 L1440,300 L0,300 Z"
          />
          {/* Subtle pine tree clusters along the ridge */}
          <g fill="#246A55" opacity="0.65">
            <path d="M120,185 L126,168 L132,185 Z M123,178 L126,160 L129,178 Z" />
            <path d="M136,188 L141,172 L146,188 Z" />
            <path d="M380,142 L386,125 L392,142 Z M383,134 L386,118 L389,134 Z" />
            <path d="M394,146 L399,131 L404,146 Z" />
            <path d="M680,165 L686,148 L692,165 Z" />
            <path d="M920,218 L926,200 L932,218 Z M923,209 L926,192 L929,209 Z" />
            <path d="M1120,160 L1126,142 L1132,160 Z" />
            <path d="M1135,164 L1140,148 L1145,164 Z" />
          </g>
          <defs>
            <linearGradient id="midHillsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#418E76" stopOpacity="0.82" />
              <stop offset="55%" stopColor="#5CA68F" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#96CBB9" stopOpacity="0.98" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Layer 3: Foreground Vibrant Lush Meadow & Wind Flow */}
      <div className="nature-meadow-fore">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="landscape-svg">
          <path
            fill="url(#foreMeadowGrad)"
            d="M0,80 C360,160 820,30 1440,100 L1440,200 L0,200 Z"
          />
          <defs>
            <linearGradient id="foreMeadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#256B55" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#37836B" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#4E9C83" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Layer 4: Swaying Botanical Fronds at Viewport Edges */}
      <div className="nature-swaying-flora left-flora">
        <svg viewBox="0 0 180 240" className="flora-svg">
          <path
            d="M20,240 Q40,140 10,70 Q45,110 35,240 Z"
            fill="#1E5C49"
            opacity="0.85"
          />
          <path
            d="M40,240 Q70,120 120,40 Q90,110 55,240 Z"
            fill="#2B7660"
            opacity="0.75"
          />
          <path
            d="M60,240 Q100,160 160,110 Q110,170 75,240 Z"
            fill="#3F8D75"
            opacity="0.7"
          />
        </svg>
      </div>

      <div className="nature-swaying-flora right-flora">
        <svg viewBox="0 0 180 240" className="flora-svg">
          <path
            d="M160,240 Q140,130 170,60 Q135,100 145,240 Z"
            fill="#1E5C49"
            opacity="0.85"
          />
          <path
            d="M140,240 Q110,120 60,35 Q90,105 125,240 Z"
            fill="#2B7660"
            opacity="0.75"
          />
          <path
            d="M120,240 Q80,150 20,100 Q70,160 105,240 Z"
            fill="#3F8D75"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Layer 5: Floating Nature Particles (Fluttering Leaves & Sakura Petals) */}
      <div className="nature-particles-layer">
        {particles.leaves.map((item) => (
          <span
            key={item.id}
            className={`nature-floating-particle ${item.type}`}
            style={{
              left: item.left,
              animationDelay: item.delay,
              animationDuration: item.duration,
              width: `${item.size}px`,
              height: `${item.size}px`,
              '--leaf-rot': `${item.rotate}deg`,
            }}
          >
            {item.type === 'petal-peach' ? (
              <svg viewBox="0 0 24 24" fill="none" className="particle-svg">
                <path
                  d="M12 2C8 6 4 12 6 18C8 22 16 22 18 18C20 12 16 6 12 2Z"
                  fill="rgba(247, 185, 160, 0.75)"
                />
              </svg>
            ) : item.type === 'leaf-gold' ? (
              <svg viewBox="0 0 24 24" fill="none" className="particle-svg">
                <path
                  d="M19.5 4.5C14.5 4.5 9 8.5 6.5 13.5C4 18.5 4.5 20.5 4.5 20.5C4.5 20.5 6.5 21 11.5 18.5C16.5 16 20.5 10.5 20.5 5.5C20.5 4.5 20 4.5 19.5 4.5Z"
                  fill="rgba(217, 155, 68, 0.72)"
                />
                <path d="M6.5 17.5L14.5 9.5" stroke="rgba(255, 255, 255, 0.55)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" className="particle-svg">
                <path
                  d="M19.5 4.5C14.5 4.5 9 8.5 6.5 13.5C4 18.5 4.5 20.5 4.5 20.5C4.5 20.5 6.5 21 11.5 18.5C16.5 16 20.5 10.5 20.5 5.5C20.5 4.5 20 4.5 19.5 4.5Z"
                  fill="rgba(42, 138, 107, 0.65)"
                />
                <path d="M6.5 17.5L14.5 9.5" stroke="rgba(255, 255, 255, 0.55)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            )}
          </span>
        ))}

        {/* Ambient Glowing Fireflies */}
        {particles.fireflies.map((ff) => (
          <span
            key={ff.id}
            className="nature-firefly"
            style={{
              left: ff.left,
              bottom: ff.bottom,
              width: `${ff.size}px`,
              height: `${ff.size}px`,
              animationDelay: ff.delay,
              animationDuration: ff.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
}
