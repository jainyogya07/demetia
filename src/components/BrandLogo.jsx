function BrandLogo({ compact = false }) {
  return (
    <div className={`ss-brand ${compact ? 'compact' : ''}`}>
      <div className="ss-brand-mark" aria-hidden="true">
        <svg viewBox="0 0 40 40" width="30" height="30">
          <circle cx="20" cy="20" r="18" fill="#5B7C6B" />
          <path
            d="M20 8c-2 4-7 7-7 13 0 4 3 8 7 8s7-4 7-8c0-6-5-9-7-13z"
            fill="#F4F7F5"
          />
          <path
            d="M13 22c2 1 4 1 7 0 3 1 5 1 7 0"
            fill="none"
            stroke="#2F5C63"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="16.5" cy="18" r="1.3" fill="#2F5C63" />
          <circle cx="23.5" cy="18" r="1.3" fill="#2F5C63" />
        </svg>
      </div>
      <div>
        <div className="ss-brand-name">Smriti Saathi</div>
        <div className="ss-brand-sub">Your Memory Companion</div>
      </div>
    </div>
  );
}

export default BrandLogo;
