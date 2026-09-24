// @ts-nocheck — leftover JS-shaped module; runtime unchanged
import { useCallback, useEffect, useState } from 'react';
import {
  MapPin, ShieldCheck, Phone, Navigation, AlertTriangle,
  Clock, RefreshCw, CheckCircle2, Users, Play, Pause,
} from 'lucide-react';
import { useAppNav } from '../AppNavContext';
import { CARE_CIRCLE, SAFETY } from '../data/patientDashboard';
import SafetyMap from '../components/SafetyMap';
import DemoCitySwitcher from '../spatial/DemoCitySwitcher';
import { formatWhen, loadCheckIns, recordCheckIn, subscribeLive } from '../lib/liveState';
import { haversineM } from '../spatial/demoWalk';
import { useDemoWalk } from '../spatial/useDemoWalk';
import { postSos } from '../lib/bff';

export default function SafetyLocation() {
  const { openModule, openEmergency } = useAppNav();
  const {
    stopDemo, togglePlay, playing, enabled, sample, trail, metrics, city, setCity, home,
  } = useDemoWalk({ autoPlay: false });
  const [checkIns, setCheckIns] = useState(loadCheckIns);
  const [coords, setCoords] = useState(home);
  const [locLabel, setLocLabel] = useState('Inside Home garden (demo)');
  const [locSource, setLocSource] = useState('simulation');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setCoords(home);
    setLocLabel('Inside Home garden (demo)');
    setLocSource('simulation');
  }, [home]);

  const liveCoords = enabled
    ? { lat: sample.lat, lng: sample.lng, label: home.label }
    : coords;
  const lastCheckIn = checkIns[0]?.at || null;
  const metres = enabled ? metrics.distanceM : Math.round(haversineM(liveCoords, home));
  const inside = enabled ? metrics.inside : metres < (home.radiusM || 280);
  const family = CARE_CIRCLE[0];

  const applyPosition = useCallback((lat, lng, source) => {
    setCoords({ lat, lng, label: home.label });
    setLocSource(source);
    const m = Math.round(haversineM({ lat, lng }, home));
    setLocLabel(m < (home.radiusM || 280) ? 'Inside Home garden' : `About ${m} m from Home`);
  }, [home]);

  const refreshLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setNotice('This browser has no GPS. Showing the Home pin so the page still works.');
      applyPosition(home.lat, home.lng, 'placeholder');
      return;
    }
    setBusy(true);
    setNotice('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        stopDemo();
        applyPosition(pos.coords.latitude, pos.coords.longitude, 'gps');
        setBusy(false);
      },
      () => {
        setNotice('GPS was blocked or unavailable. Home pin is shown instead.');
        applyPosition(home.lat, home.lng, 'placeholder');
        setBusy(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 15000 },
    );
  }, [applyPosition, stopDemo, home]);

  const checkIn = () => {
    recordCheckIn({
      lat: liveCoords.lat,
      lng: liveCoords.lng,
      place: inside ? 'Home — Safe Zone' : (enabled ? metrics.zoneLabel : locLabel),
    });
    postSos({
      kind: 'check-in',
      place: inside ? 'Home garden' : (enabled ? metrics.zoneLabel : locLabel),
      lat: liveCoords.lat,
      lng: liveCoords.lng,
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
  }, [refreshLocation, liveCoords, inside, locLabel]);

  return (
    <div className="ss-safety-page">
      <header className="ss-page-head">
        <p className="ss-kicker">Safety</p>
        <h2>Safety &amp; Location</h2>
        <p>{city.safetyIntro}</p>
        <DemoCitySwitcher cityId={city.id} onChange={setCity} />
      </header>

      <div className="ss-safety-grid">
        <section className="ss-card ss-glass ss-map-card">
          <header className="ss-card-head">
            <div className="ss-card-title">
              <MapPin size={18} />
              <h3>Location</h3>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="ss-text-btn" onClick={togglePlay}>
                {playing ? <Pause size={14} /> : <Play size={14} />} {playing ? 'Pause walk' : 'Demo walk'}
              </button>
              <button type="button" className="ss-text-btn" onClick={refreshLocation} disabled={busy}>
                <RefreshCw size={14} /> {busy ? 'Checking…' : 'GPS'}
              </button>
            </div>
          </header>
          <SafetyMap
            home={home}
            polygon={city.polygon}
            current={liveCoords}
            checkIns={checkIns}
            trail={enabled ? trail : []}
            heading={enabled ? sample.heading : 0}
            ariaLabel={city.mapAria}
          />
          <p className="ss-map-legend">
            <span>{city.liveChip}</span>
            <span>Green garden — Home</span>
            <span>Trail — demo walk</span>
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
              <strong>
                {enabled
                  ? metrics.zoneLabel
                  : inside
                    ? 'All good — inside Home'
                    : 'A little beyond the usual garden'}
              </strong>
            </p>
            <p className="ss-muted">Safe zone: {home.label}</p>
            <p className="ss-muted">
              Last check-in: {lastCheckIn ? formatWhen(lastCheckIn) : SAFETY.lastCheckIn}
            </p>
            <p className="ss-muted">
              {enabled
                ? `Demo walk · ${metres} m · facing ${metrics.headingCardinal}`
                : `${locSource === 'gps' ? 'Live GPS' : 'Home pin'} · ${metres} m from Home`}
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
              <button type="button" className="ss-mini-btn danger" onClick={() => {
                postSos({ kind: 'sos', place: locLabel, lat: liveCoords.lat, lng: liveCoords.lng });
                openEmergency();
              }}>
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
