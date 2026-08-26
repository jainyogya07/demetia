import heroMark from '../assets/hero.png';

function BrandLogo({ compact = false }) {
  return (
    <div className={`ss-brand ${compact ? 'compact' : ''}`}>
      <div className="ss-brand-mark" aria-hidden="true">
        <img src={heroMark} alt="" />
      </div>
      <div className="ss-brand-text">
        <div className="ss-brand-name">स्मृति साथी</div>
        <div className="ss-brand-sub">Smriti Saathi</div>
      </div>
    </div>
  );
}

export default BrandLogo;
