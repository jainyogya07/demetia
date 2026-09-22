import React, { useEffect, useState } from 'react';
import { Map, AlertTriangle, PhoneOff, Smartphone, Clock, Route, Layers, View } from 'lucide-react';
import Google3DMap from '../../spatial/Google3DMap';
import LeafletSpatialMap from '../../spatial/LeafletSpatialMap';
import FamiliarRouteBuilder from '../../spatial/FamiliarRouteBuilder';
import { getDetectionState, subscribeDetectionState } from '../../spatial/DetectionEngine';
import { initializeSpatialClient, disconnectSpatialClient } from '../../spatial/spatialClient';
import { SpatialStatus } from '../../spatial/SpatialTypes';
import './SpatialPresence.css';

export default function SpatialPresence() {
  const [detectionState, setDetectionState] = useState(getDetectionState());
  const [showRouteBuilder, setShowRouteBuilder] = useState(false);

  useEffect(() => {
    // Connect to WebSocket Orchestrator for patient "P123"
    initializeSpatialClient('P123');
    
    const unsub = subscribeDetectionState(setDetectionState);
    return () => {
      unsub();
      disconnectSpatialClient('P123');
    };
  }, []);

  const getStatusBanner = () => {
    switch (detectionState.status) {
      case SpatialStatus.UNAVAILABLE:
        return (
          <div className="status-banner banner-error">
            <PhoneOff size={24} />
            <div className="banner-text">
              <strong>Device Separated</strong>
              <p>{detectionState.summary}</p>
            </div>
          </div>
        );
      case SpatialStatus.UNUSUAL:
        return (
          <div className="status-banner banner-warning">
            <Route size={24} />
            <div className="banner-text">
              <strong>Possible Route Deviation</strong>
              <p>{detectionState.summary}</p>
            </div>
            <button className="btn-action">Alert Care Circle</button>
          </div>
        );
      case SpatialStatus.ATTENTION_REQUIRED:
        return (
          <div className="status-banner banner-critical">
            <AlertTriangle size={24} />
            <div className="banner-text">
              <strong>Attention Required</strong>
              <p>Patient has moved significantly outside their configured familiar area.</p>
            </div>
            <button className="btn-action primary">Contact Patient</button>
          </div>
        );
      default:
        return (
          <div className="status-banner banner-safe">
            <Map size={24} />
            <div className="banner-text">
              <strong>Safe Route</strong>
              <p>Patient appears to be following a familiar route near {detectionState.nearestFamiliarPlace}.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="spatial-presence-dashboard">
      <div className="dashboard-sidebar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2>Spatial Presence</h2>
            <p className="subtitle" style={{ margin: 0 }}>Operational Care Dashboard</p>
          </div>
        </div>
        
        {getStatusBanner()}
        
        <div className="info-card">
          <div className="info-row">
            <Clock size={16} />
            <span>Last Known Time:</span>
            <strong>{detectionState.lastKnownTime}</strong>
          </div>
          <div className="info-row">
            <Map size={16} />
            <span>Last Location:</span>
            <strong>{detectionState.lastKnownLocation}</strong>
          </div>
          <div className="info-row">
            <Route size={16} />
            <span>Direction:</span>
            <strong>{detectionState.direction}</strong>
          </div>
          <div className="info-row">
            <Smartphone size={16} />
            <span>Device Signal:</span>
            <strong className={detectionState.status === SpatialStatus.UNAVAILABLE ? 'text-error' : 'text-success'}>
              {detectionState.status === SpatialStatus.UNAVAILABLE ? 'Unavailable' : 'Active'}
            </strong>
          </div>
        </div>

        <div className="replay-controls">
          <h3>Care Agent Summary</h3>
          <p className="ca-summary">"{detectionState.summary}"</p>
        </div>
      </div>
      
      <div className="dashboard-map-area" style={{ padding: '24px', flexGrow: 1, display: 'flex' }}>
        <div style={{ flex: 1, position: 'relative', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#000', boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)' }}>
          {/* Main Immersive View */}
          <Google3DMap />
          
          {/* Route Builder Action Button */}
          <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 20 }}>
            <button 
              className="btn-replay" 
              onClick={() => setShowRouteBuilder(true)}
              style={{ background: '#176b58', color: 'white', padding: '12px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
            >
              + Create Familiar Route
            </button>
          </div>

          {/* GTA-Style Minimap Overlay */}
          <div style={{ 
            position: 'absolute', 
            bottom: '24px', 
            right: '24px', 
            zIndex: 10,
            pointerEvents: 'none' // Let clicks pass through if needed, though dragging is disabled anyway
          }}>
            <LeafletSpatialMap />
          </div>
        </div>
      </div>
      
      {showRouteBuilder && (
        <FamiliarRouteBuilder 
          onClose={() => setShowRouteBuilder(false)} 
          onSaveRoute={(route) => {
            console.log('Saved Route to Node.js backend:', route);
            setShowRouteBuilder(false);
          }} 
        />
      )}
    </div>
  );
}
