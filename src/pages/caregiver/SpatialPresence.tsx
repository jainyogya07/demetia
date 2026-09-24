// @ts-nocheck — leftover JS-shaped module; runtime unchanged
import React, { useEffect, useState } from 'react';
import { Map, AlertTriangle, PhoneOff, Clock, Route, Activity, Crosshair, CloudLightning, Compass, Footprints, ShieldAlert, Navigation2, ThermometerSun, BrainCircuit, Radar, Play } from 'lucide-react';
import Google3DMap from '../../spatial/Google3DMap';
import LeafletSpatialMap from '../../spatial/LeafletSpatialMap';
import FamiliarRouteBuilder from '../../spatial/FamiliarRouteBuilder';
import { getDetectionState, subscribeDetectionState, simulateRouteDeviation, simulatePhoneLeftBehind, resetDetection } from '../../spatial/DetectionEngine';
import { initializeSpatialClient, disconnectSpatialClient } from '../../spatial/spatialClient';
import { SpatialStatus } from '../../spatial/SpatialTypes';
import { useDemoWalk } from '../../spatial/useDemoWalk';
import DemoCitySwitcher from '../../spatial/DemoCitySwitcher';
import { bffFetch, postSos, postTrajectory } from '../../lib/bff';
import './SpatialPresence.css';

export default function SpatialPresence() {
  const [detectionState, setDetectionState] = useState(getDetectionState());
  const [showRouteBuilder, setShowRouteBuilder] = useState(false);
  const demo = useDemoWalk({ autoPlay: true });
  const { metrics, sample, city, trail } = demo;

  useEffect(() => {
    initializeSpatialClient('P123');
    const unsub = subscribeDetectionState(setDetectionState);
    bffFetch(`/api/v1/spatial/wandering-analysis?city=${encodeURIComponent(city.id)}`);
    return () => {
      unsub();
      disconnectSpatialClient('P123');
    };
  }, [city.id]);

  const liveLocation = demo.enabled
    ? `${metrics.place} · ${metrics.distanceM} m`
    : detectionState.lastKnownLocation;

  const getStatusBanner = () => {
    if (demo.enabled && metrics.wanderingLevel === 'watch') {
      return (
        <div className="status-banner banner-warning">
          <Route size={24} />
          <div className="banner-text">
            <strong>A little farther than usual</strong>
            <p>{metrics.copy}</p>
          </div>
        </div>
      );
    }
    if (demo.enabled) {
      return (
        <div className="status-banner banner-safe">
          <Map size={24} />
          <div className="banner-text">
            <strong>{metrics.zoneLabel}</strong>
            <p>{metrics.copy}</p>
          </div>
        </div>
      );
    }
    switch (detectionState.status) {
      case SpatialStatus.UNAVAILABLE:
        return (
          <div className="status-banner banner-error">
            <PhoneOff size={24} />
            <div className="banner-text">
              <strong>Phone still at Home</strong>
              <p>{detectionState.summary}</p>
            </div>
          </div>
        );
      case SpatialStatus.UNUSUAL:
        return (
          <div className="status-banner banner-warning">
            <Route size={24} />
            <div className="banner-text">
              <strong>Walk looks a bit different</strong>
              <p>{detectionState.summary}</p>
            </div>
            <button type="button" className="btn-action">Gently alert care circle</button>
          </div>
        );
      case SpatialStatus.ATTENTION_REQUIRED:
        return (
          <div className="status-banner banner-critical">
            <AlertTriangle size={24} />
            <div className="banner-text">
              <strong>Family should take a look</strong>
              <p>The walk has gone farther than the usual Home garden.</p>
            </div>
            <button type="button" className="btn-action primary">Call family</button>
          </div>
        );
      default:
        return (
          <div className="status-banner banner-safe">
            <Map size={24} />
            <div className="banner-text">
              <strong>Safe near Home</strong>
              <p>Following a familiar lane near {detectionState.nearestFamiliarPlace}.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="spatial-presence-dashboard">
      <div className="dashboard-sidebar">
        <div style={{ marginBottom: 24 }}>
          <h2 className="safe-journey-title">Safe Journey</h2>
          <p className="subtitle safe-journey-sub">We’re with you on the walk · {city.shortLabel}</p>
          <DemoCitySwitcher cityId={city.id} onChange={demo.setCity} />
        </div>

        {getStatusBanner()}

        <div className="info-card">
          <div className="info-row">
            <Clock size={16} />
            <span>Last seen:</span>
            <strong>{demo.enabled ? metrics.lastSeen : detectionState.lastKnownTime}</strong>
          </div>
          <div className="info-row">
            <Map size={16} />
            <span>Place:</span>
            <strong>{liveLocation}</strong>
          </div>
          <div className="info-row">
            <Route size={16} />
            <span>Heading:</span>
            <strong>
              {demo.enabled ? `${metrics.headingCardinal} · ${metrics.headingDeg}°` : detectionState.direction}
            </strong>
          </div>
          <div className="info-row">
            <ShieldAlert size={16} />
            <span>Home distance:</span>
            <strong>{demo.enabled ? `${metrics.distanceM} m` : '—'}</strong>
          </div>
        </div>

        <div style={{ background: '#0a1914', borderRadius: '12px', padding: '16px', color: '#e8f5e9', marginBottom: '24px', border: '1px solid #176b58', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <BrainCircuit size={18} color="#4ade80" />
            <h3 style={{ margin: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: '#4ade80' }}>How the walk feels</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="spatial-metric-box">
              <Activity size={14} color={metrics.wanderingLevel === 'watch' ? '#fbbf24' : '#4ade80'} />
              <div><span className="metric-label">Walk feel</span><br /><strong>{metrics.wanderingLabel}</strong></div>
            </div>
            <div className="spatial-metric-box">
              <Footprints size={14} color="#60a5fa" />
              <div><span className="metric-label">Pace</span><br /><strong>{metrics.gaitMs.toFixed(2)} m/s</strong></div>
            </div>
            <div className="spatial-metric-box">
              <Compass size={14} color="#a78bfa" />
              <div><span className="metric-label">Path</span><br /><strong>{metrics.trajectory}</strong></div>
            </div>
            <div className="spatial-metric-box">
              <ShieldAlert size={14} color={metrics.inside ? '#34d399' : '#fbbf24'} />
              <div><span className="metric-label">Garden</span><br /><strong>{metrics.inside ? 'Inside' : 'Just outside'}</strong></div>
            </div>
            <div className="spatial-metric-box">
              <Crosshair size={14} color="#34d399" />
              <div><span className="metric-label">Back-home</span><br /><strong>{Math.max(1, Math.round(metrics.distanceM / 55))} min walk</strong></div>
            </div>
            <div className="spatial-metric-box">
              <ThermometerSun size={14} color="#fb923c" />
              <div><span className="metric-label">Weather</span><br /><strong>{city.weather}</strong></div>
            </div>
            <div className="spatial-metric-box">
              <CloudLightning size={14} color="#818cf8" />
              <div><span className="metric-label">Evening feel</span><br /><strong>{city.eveningFeel}</strong></div>
            </div>
            <div className="spatial-metric-box">
              <Radar size={14} color="#a3e635" />
              <div><span className="metric-label">Motion</span><br /><strong>{demo.playing ? 'Walking' : 'Paused'}</strong></div>
            </div>
            <div className="spatial-metric-box">
              <Map size={14} color="#2dd4bf" />
              <div><span className="metric-label">Known place</span><br /><strong>{metrics.familiarity}%</strong></div>
            </div>
            <div className="spatial-metric-box">
              <Navigation2 size={14} color="#f472b6" />
              <div><span className="metric-label">Facing</span><br /><strong>{metrics.headingCardinal}</strong></div>
            </div>
          </div>
        </div>

        <div className="replay-controls" style={{ marginTop: 0 }}>
          <h3 style={{ fontSize: '13px', color: '#176b58', marginBottom: '8px' }}>Care note</h3>
          <p className="ca-summary">&ldquo;{demo.enabled ? metrics.copy : detectionState.summary}&rdquo;</p>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
          <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#176b58', letterSpacing: '1px', marginBottom: '12px', fontWeight: 'bold' }}>Demo controls</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              className="sj-ctrl-btn sj-ctrl-primary"
              onClick={() => {
                if (demo.playing) postTrajectory(trail, city.id);
                demo.togglePlay();
              }}
            >
              <Play size={16} /> {demo.playing ? 'Pause the walk' : 'Start a gentle walk'}
            </button>
            <button
              type="button"
              className="sj-ctrl-btn"
              onClick={() => postSos({ kind: 'sos', place: metrics.place || city.shortLabel, lat: sample?.lat, lng: sample?.lng })}
            >
              Tell family I’m here
            </button>
            <button
              type="button"
              onClick={() => setShowRouteBuilder(true)}
              style={{ background: 'rgba(23,107,88,0.1)', color: '#176b58', border: '1px solid rgba(23,107,88,0.3)', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Create familiar route
            </button>
            <button
              type="button"
              onClick={() => simulateRouteDeviation()}
              style={{ background: 'rgba(23,107,88,0.1)', color: '#176b58', border: '1px solid rgba(23,107,88,0.3)', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Simulate a different turn
            </button>
            <button
              type="button"
              onClick={() => simulatePhoneLeftBehind()}
              style={{ background: 'rgba(23,107,88,0.1)', color: '#176b58', border: '1px solid rgba(23,107,88,0.3)', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Phone still at Home
            </button>
            <button
              type="button"
              onClick={() => { resetDetection(); demo.startDemo(); }}
              style={{ background: '#176b58', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '4px' }}
            >
              Reset to gentle walk
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-map-area" style={{ padding: '0px', flexGrow: 1, display: 'flex' }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#e7efe6' }}>
          <Google3DMap
            centerLat={sample?.lat || city.home.lat}
            centerLng={sample?.lng || city.home.lng}
            sample={sample}
            trail={demo.trail}
            metrics={metrics}
            playing={demo.playing}
            enabled={demo.enabled}
            speed={demo.speed}
            setSpeed={demo.setSpeed}
            togglePlay={demo.togglePlay}
            startDemo={demo.startDemo}
            stopDemo={demo.stopDemo}
            city={city}
            setCity={demo.setCity}
          />

          <div className="spatial-minimap-wrap">
            <LeafletSpatialMap
              isMinimap
              centerLat={sample?.lat}
              centerLng={sample?.lng}
              sample={sample}
              trail={demo.trail}
              playing={demo.playing}
              enabled={demo.enabled}
              city={city}
            />
          </div>
        </div>
      </div>

      {showRouteBuilder && (
        <FamiliarRouteBuilder
          onClose={() => setShowRouteBuilder(false)}
          onSaveRoute={() => setShowRouteBuilder(false)}
        />
      )}
    </div>
  );
}
