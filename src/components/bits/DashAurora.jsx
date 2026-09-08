import Aurora from './Aurora';
import Particles from './Particles';

export default function DashAurora() {
  return (
    <div className="ss-aurora-layer" aria-hidden>
      <Aurora
        colorStops={['#176b58', '#2a9d8f', '#d7ebe4']}
        amplitude={0.5}
        blend={0.55}
        lightMode
        speed={0.4}
      />
      <Particles particleCount={70} particleSpread={9} speed={0.16} />
    </div>
  );
}
