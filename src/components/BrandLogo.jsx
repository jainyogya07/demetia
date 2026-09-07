import logoMark from '../assets/smriti-saarthi-logo.png';

function BrandLogo({ compact = false, rail = false }) {
  return (
    <div className={`ss-brand${compact ? ' compact' : ''}${rail ? ' is-rail' : ''}`}>
      <div className="ss-brand-mark">
        <img src={logoMark} alt="" />
      </div>
      <div className="ss-brand-text">
        <div className="ss-brand-name">Smriti Saarthi</div>
        {!rail && <div className="ss-brand-sub">स्मृति सारथी</div>}
      </div>
    </div>
  );
}

export default BrandLogo;
