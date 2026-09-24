import logoMark from '../assets/smriti-saarthi-logo.png';

function BrandLogo({ compact = false, rail = false, logoOnly = false }) {
  return (
    <div
      className={`ss-brand ss-sidebar-identity${compact ? ' compact' : ''}${rail ? ' is-rail' : ''}${logoOnly ? ' is-logo-only' : ''}`}
    >
      <div className="ss-brand-mark">
        <img src={logoMark} alt="" draggable={false} />
      </div>
      {!logoOnly && (
        <div className="ss-brand-text">
          <div className="ss-brand-name">Smriti Saarthi</div>
          {!rail && <div className="ss-brand-sub">Always with you</div>}
        </div>
      )}
    </div>
  );
}

export default BrandLogo;
