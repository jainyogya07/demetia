import logoMark from '../assets/smriti-saarthi-logo.png';

function BrandLogo({ compact = false }) {
  return (
    <div className={`ss-brand ${compact ? 'compact' : ''}`}>
      <div className="ss-brand-mark">
        <img src={logoMark} alt="" />
      </div>
      <div className="ss-brand-text">
        <div className="ss-brand-name">स्मृति सारथी</div>
        <div className="ss-brand-sub">Smriti Saarthi</div>
      </div>
    </div>
  );
}

export default BrandLogo;
