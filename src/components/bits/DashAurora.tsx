import { useState, useEffect } from 'react';
import Aurora from './Aurora';
import Particles from './Particles';

export default function DashAurora() {
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth <= 860 : false));

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mql = window.matchMedia('(max-width: 860px)');
    const onChange = () => setIsMobile(mql.matches);
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else if ((mql as any).addListener) (mql as any).addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else if ((mql as any).removeListener) (mql as any).removeListener(onChange);
    };
  }, []);

  if (isMobile) {
    return <div className="ss-aurora-layer ss-aurora-static-fallback" aria-hidden />;
  }

  return (
    <div className="ss-aurora-layer" aria-hidden>
      <Aurora
        colorStops={['#176b58', '#2a9d8f', '#d7ebe4']}
        amplitude={0.5}
        blend={0.55}
        lightMode
        speed={0.4}
      />
      <Particles particleCount={40} particleSpread={9} speed={0.14} />
    </div>
  );
}

