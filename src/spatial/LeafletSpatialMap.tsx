// @ts-nocheck — leftover JS-shaped module; runtime unchanged
import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Circle, Polygon, CircleMarker, useMap } from 'react-leaflet';
import { Pause, Play, Compass } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Simulated360Viewer from './Simulated360Viewer';
import DemoCitySwitcher from './DemoCitySwitcher';
import { getActiveDemoCity } from './demoWalk';
import './LeafletSpatialMap.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const gtaPlaceIcon = L.divIcon({
  className: 'gta-place-wrapper',
  html: `<div class="gta-place-blip"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

function walkerIcon(heading) {
  return L.divIcon({
    className: 'demo-walker-wrap',
    html: `<div class="demo-walker" style="transform:rotate(${heading}deg)"><div class="demo-walker-cone"></div><div class="demo-walker-dot"></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function Follow({ lat, lng, enabled }) {
  const map = useMap();
  useEffect(() => {
    if (!enabled || lat == null) return;
    map.panTo([lat, lng], { animate: true, duration: 0.45 });
  }, [lat, lng, enabled, map]);
  return null;
}

function Invalidate() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 180);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

const CARTO = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const OSM = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

export default function LeafletSpatialMap({
  zoom = 16,
  interactive = false,
  isMinimap = true,
  centerLat,
  centerLng,
  sample,
  trail = [],
  metrics,
  playing = false,
  enabled = false,
  speed = 1,
  setSpeed,
  togglePlay,
  startDemo,
  stopDemo,
  city,
  setCity,
}) {
  const activeCity = city || getActiveDemoCity();
  const home = activeCity.home;
  const [show360Full, setShow360Full] = useState(false);
  const [tileUrl, setTileUrl] = useState(CARTO);
  const [tileFails, setTileFails] = useState(0);

  const pos = sample
    ? [sample.lat, sample.lng]
    : [centerLat || home.lat, centerLng || home.lng];
  const heading = sample?.heading ?? 0;
  const headingKey = Math.round(heading);
  const icon = useMemo(() => walkerIcon(headingKey), [headingKey]);

  useEffect(() => {
    if (tileFails > 6 && tileUrl !== OSM) setTileUrl(OSM);
  }, [tileFails, tileUrl]);

  const trailLatLng = trail.map((p) => [p.lat, p.lng]);
  const heat = trail.slice(-28);

  if (isMinimap) {
    return (
      <div className="gta-minimap-container">
        <MapContainer
          key={activeCity.id}
          center={pos}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
          dragging={false}
          touchZoom={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
        >
          <TileLayer url={tileUrl} eventHandlers={{ tileerror: () => setTileFails((n) => n + 1) }} />
          <Follow lat={pos[0]} lng={pos[1]} enabled />
          <Circle center={[home.lat, home.lng]} radius={home.radiusM} pathOptions={{ color: '#176b58', fillColor: '#176b58', fillOpacity: 0.12, weight: 1 }} />
          {trailLatLng.length > 1 && <Polyline positions={trailLatLng} color="#176b58" weight={3} opacity={0.7} />}
          <Marker position={pos} icon={icon} />
        </MapContainer>
      </div>
    );
  }

  return (
    <div className="demo-spatial-map">
      <MapContainer
        key={activeCity.id}
        center={pos}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
        dragging={interactive}
        touchZoom={interactive}
        scrollWheelZoom={interactive}
        doubleClickZoom={interactive}
        minZoom={13}
        maxZoom={19}
      >
        <TileLayer
          url={tileUrl}
          attribution='&copy; OpenStreetMap &copy; CARTO'
          eventHandlers={{ tileerror: () => setTileFails((n) => n + 1) }}
        />
        <Invalidate />
        <Follow lat={pos[0]} lng={pos[1]} enabled={enabled && playing} />

        <Polygon
          positions={activeCity.polygon}
          pathOptions={{ color: '#176b58', weight: 2, fillColor: '#2f9e7a', fillOpacity: 0.16 }}
        />
        <Circle
          center={[home.lat, home.lng]}
          radius={home.radiusM}
          pathOptions={{ color: '#176b58', dashArray: '6 8', weight: 1.5, fill: false }}
        />

        {activeCity.places.filter((p) => p.id !== 'place_home').map((place) => (
          <React.Fragment key={place.id}>
            <Circle
              center={[place.lat, place.lng]}
              radius={place.radius || 70}
              pathOptions={{ color: '#c18429', fillColor: '#c18429', fillOpacity: 0.08, weight: 1 }}
            />
            <Marker position={[place.lat, place.lng]} icon={gtaPlaceIcon} />
          </React.Fragment>
        ))}

        {heat.map((p, i) => (
          <CircleMarker
            key={`${p.lat}-${i}`}
            center={[p.lat, p.lng]}
            radius={3 + (i / heat.length) * 4}
            pathOptions={{
              color: '#176b58',
              fillColor: '#176b58',
              fillOpacity: 0.12 + (i / heat.length) * 0.45,
              weight: 0,
            }}
          />
        ))}

        {trailLatLng.length > 1 && (
          <Polyline positions={trailLatLng} color="#145a4a" weight={4} opacity={0.85} />
        )}

        <Marker position={[home.lat, home.lng]} icon={gtaPlaceIcon} />
        <Marker position={pos} icon={icon} />
      </MapContainer>

      <div className="demo-map-metrics">
        <div className="demo-map-chip">
          <span className="pulse" />
          {activeCity.liveChip}
        </div>
        <DemoCitySwitcher cityId={activeCity.id} onChange={setCity} />
        {metrics && (
          <>
            <div className="demo-metric-row">
              <span className="demo-metric-pill">{metrics.distanceM} m from Home</span>
              <span className="demo-metric-pill">{metrics.zoneLabel}</span>
              <span className={`demo-metric-pill ${metrics.wanderingLevel === 'watch' ? 'watch' : ''}`}>
                Walk feel · {metrics.wanderingLabel}
              </span>
              <span className="demo-metric-pill">
                {metrics.headingCardinal} · {metrics.headingDeg}°
              </span>
              <span className="demo-metric-pill">Last seen {metrics.lastSeen}</span>
            </div>
            <div className={`demo-copy-banner ${metrics.wanderingLevel === 'watch' ? 'watch' : ''}`}>
              {metrics.copy}
            </div>
          </>
        )}
      </div>

      <div className="demo-map-dock">
        <div className="demo-360-pip" aria-label="Simulated 360 walk view">
          <Simulated360Viewer heading={heading} playing={playing} compact city={activeCity} />
        </div>
        <div className="demo-controls">
          <button type="button" className="primary" onClick={togglePlay}>
            {playing ? <Pause size={14} /> : <Play size={14} />} {playing ? 'Pause' : 'Demo walk'}
          </button>
          <select value={speed} onChange={(e) => setSpeed?.(Number(e.target.value))} aria-label="Playback speed">
            <option value={0.5}>0.5×</option>
            <option value={1}>1×</option>
            <option value={2}>2×</option>
            <option value={4}>4×</option>
          </select>
          {enabled && (
            <button type="button" onClick={stopDemo}>Reset</button>
          )}
          {!enabled && (
            <button type="button" onClick={startDemo}>Start loop</button>
          )}
          <button type="button" onClick={() => setShow360Full(true)}>
            <Compass size={14} /> Full 360°
          </button>
        </div>
      </div>

      <div className="demo-legend">
        <span><i style={{ background: '#176b58' }} /> Home garden</span>
        <span><i style={{ background: '#c18429' }} /> Familiar places</span>
        <span><i style={{ background: '#145a4a' }} /> Walk trail</span>
      </div>

      {show360Full && (
        <Simulated360Viewer
          heading={heading}
          playing={playing}
          fullscreen
          city={activeCity}
          onClose={() => setShow360Full(false)}
        />
      )}
    </div>
  );
}
