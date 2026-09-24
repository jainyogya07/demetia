import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MapPin, ShieldCheck, Phone, Navigation, AlertTriangle,
  Clock, RefreshCw, CheckCircle2, Users,
} from 'lucide-react';
import { useAppNav } from '../AppNavContext';
import { CARE_CIRCLE, SAFETY } from '../data/patientDashboard';
import SafetyMap from '../components/SafetyMap';
import { formatWhen, loadCheckIns, recordCheckIn, subscribeLive } from '../lib/liveState';

const HOME = { lat: 26.1445, lng: 91.7362, label: 'Home — Zoo Road, Guwahati' };

function distanceM(a, b) {
  const toRad = (n) => (n * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export default function SafetyLocation() {
  const { openModule, openEmergency } = useAppNav();
  const [checkIns, setCheckIns] = useState(loadCheckIns);
  const [coords, setCoords] = useState(HOME);
  const [locLabel, setLocLabel] = useState('Inside safe zone (demo pin)');
  const [locSource, setLocSource] = useState('placeholder');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const lastCheckIn = checkIns[0]?.at || null;
  const metres = useMemo(() => Math.round(distanceM(coords, HOME)), [coords]);
  const inside = metres < 350;
  const family = CARE_CIRCLE[0];

  const applyPosition = useCallback((lat, lng, source) => {
    setCoords({ lat, lng, label: HOME.label });
    setLocSource(source);
    const m = Math.round(distanceM({ lat, lng }, HOME));
    setLocLabel(m < 350 ? 'Inside Home safe zone' : `About ${m} m from Home`);
  }, []);

  const refreshLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setNotice('This browser has no GPS. Showing the Home pin so the page still works.');
      applyPosition(HOME.lat, HOME.lng, 'placeholder');
      return;
    }
    setBusy(true);
    setNotice('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyPosition(pos.coords.latitude, pos.coords.longitude, 'gps');
        setBusy(false);
      },
      () => {
        setNotice('GPS was blocked or unavailable. Home pin is shown instead.');
        applyPosition(HOME.lat, HOME.lng, 'placeholder');
        setBusy(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 15000 },
    );
  }, [applyPosition]);

  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  const checkIn = () => {
    recordCheckIn({
      lat: coords.lat,
      lng: coords.lng,
      place: inside ? 'Home — Safe Zone' : locLabel,
    });
    setCheckIns(loadCheckIns());
  };

  useEffect(() => subscribeLive(() => setCheckIns(loadCheckIns())), []);

  useEffect(() => {
    const onControl = (event) => {
      if (event.detail?.action === 'refresh') refreshLocation();
      if (event.detail?.action === 'check-in') checkIn();
    };
    window.addEventListener('sarthi:safety-control', onControl);
    return () => window.removeEventListener('sarthi:safety-control', onControl);
  }, [refreshLocation, coords, inside, locLabel]);

  return (
    <div className="ss-safety-page">
      <header className="ss-page-head">
        <p className="ss-kicker">Safety</p>
        <h2>Safety &amp; Location</h2>
        <p>Last check-in, Home safe zone, and family call. Uses GPS when allowed; otherwise a clear Home pin.</p>
      </header>

      <div className="ss-safety-grid">
        <section className="ss-card ss-glass ss-map-card">
          <header className="ss-card-head">
            <div className="ss-card-title">
              <MapPin size={18} />
              <h3>Location</h3>
            </div>
            <button type="button" className="ss-text-btn" onClick={refreshLocation} disabled={busy}>
              <RefreshCw size={14} /> {busy ? 'Checking…' : 'Refresh'}
            </button>
          </header>
          <SafetyMap home={HOME} current={coords} checkIns={checkIns} />
          <p className="ss-map-legend">
            <span>Green — Home (Zoo Road)</span>
            <span>Gold — current pin</span>
            <span>Dark — check-ins</span>
          </p>
          {notice && <p className="ss-safety-note">{notice}</p>}
        </section>

        <div className="ss-safety-side">
          <section className="ss-card ss-glass">
            <header className="ss-card-head">
              <div className="ss-card-title">
                <ShieldCheck size={18} />
                <h3>Status</h3>
              </div>
            </header>
            <p className={`ss-safety-status ${inside ? 'ok' : 'away'}`}>
              {inside ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
              <strong>{inside ? 'All good — inside Home' : 'Outside the Home zone'}</strong>
            </p>
            <p className="ss-muted">Safe zone: {SAFETY.zone}</p>
            <p className="ss-muted">
              Last check-in: {lastCheckIn ? formatWhen(lastCheckIn) : SAFETY.lastCheckIn}
            </p>
            <p className="ss-muted">
              Pin: {locSource === 'gps' ? 'live GPS' : 'placeholder'} · {metres} m from Home
            </p>
            <button type="button" className="ss-full-btn" onClick={checkIn}>
              Check in now
            </button>
          </section>

          <section className="ss-card ss-glass">
            <header className="ss-card-head">
              <div className="ss-card-title">
                <Navigation size={18} />
                <h3>Actions</h3>
              </div>
            </header>
            <div className="ss-safety-actions">
              <a className="ss-mini-btn" href="tel:9876543210">
                <Phone size={15} /> Call Family
              </a>
              <button type="button" className="ss-mini-btn" onClick={refreshLocation}>
                <MapPin size={15} /> Check Location
              </button>
              <button type="button" className="ss-mini-btn danger" onClick={openEmergency}>
                <AlertTriangle size={15} /> Emergency Help
              </button>
            </div>
            <button type="button" className="ss-card-link" onClick={() => openModule('care-circle')}>
              <Users size={14} /> Open Care Circle
            </button>
          </section>
        </div>
      </div>

      <section className="ss-card ss-glass ss-checkin-card">
        <header className="ss-card-head">
          <div className="ss-card-title">
            <Clock size={18} />
            <h3>Recent check-ins</h3>
          </div>
        </header>
        {checkIns.length === 0 ? (
          <p className="ss-muted">No check-ins yet. Use Check in now so family can see you are safe.</p>
        ) : (
          <ul className="ss-checkin-list">
            {checkIns.map((row) => (
              <li key={row.id}>
                <CheckCircle2 size={16} />
                <span>{formatWhen(row.at)}</span>
                <span className="ss-muted">{row.place}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="ss-muted ss-family-line">
          Family contact: {family?.name} ({family?.relation}) — {family?.status}
        </p>
      </section>
    </div>
  );
}
