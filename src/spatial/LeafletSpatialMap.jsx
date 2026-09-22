import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getDetectionState, subscribeDetectionState } from './DetectionEngine';
import { getRouteHistory, subscribeRouteHistory } from './RouteEngine';
import { getFamiliarPlaces } from './FamiliarPlaces';

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const gtaPlayerIcon = L.divIcon({
  className: 'gta-player-wrapper',
  html: `<div class="gta-player-marker"><div class="gta-player-arrow"></div></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const gtaPlaceIcon = L.divIcon({
  className: 'gta-place-wrapper',
  html: `<div class="gta-place-blip"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5]
});

// Component to dynamically recenter the map smoothly
function SmoothCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.panTo(center, { animate: true, duration: 1.0 });
    }
  }, [center, map]);
  return null;
}

export default function LeafletSpatialMap({ 
  zoom = 16 
}) {
  const [detectionState, setDetectionState] = useState(getDetectionState());
  const [route, setRoute] = useState(getRouteHistory());
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    setPlaces(getFamiliarPlaces());
    const unsubDetection = subscribeDetectionState(setDetectionState);
    const unsubRoute = subscribeRouteHistory(setRoute);
    return () => {
      unsubDetection();
      unsubRoute();
    };
  }, []);

  const latestRoutePoint = route.length > 0 ? route[route.length - 1] : null;
  const currentLocation = latestRoutePoint ? [latestRoutePoint.lat, latestRoutePoint.lng] : null;
  
  // Mock expected route for GTA map
  const expectedRoute = [
    [19.0760, 72.8777],
    [19.0770, 72.8780],
    [19.0780, 72.8790]
  ];

  const center = currentLocation || expectedRoute[0] || [19.0760, 72.8777];

  return (
    <div className="gta-minimap-container">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
        dragging={false}
        touchZoom={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
      >
        {/* Dark/Desaturated GTA Vibe Tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution=""
        />

        <SmoothCenter center={center} />

        {/* Expected Route */}
        {expectedRoute && expectedRoute.length > 0 && (
          <Polyline 
            positions={expectedRoute} 
            color="#ffffff" 
            weight={3} 
            opacity={0.4}
            dashArray="10, 10" 
          />
        )}

        {/* Safe Zone Rings around familiar places */}
        {places && places.map(place => (
          <React.Fragment key={place.id}>
            <Circle 
              center={[place.lat, place.lng]} 
              radius={place.radius || 150} 
              pathOptions={{ 
                color: '#ff3366', 
                fillColor: '#ff3366', 
                fillOpacity: 0.1,
                weight: 1
              }} 
            />
            <Marker position={[place.lat, place.lng]} icon={gtaPlaceIcon} />
          </React.Fragment>
        ))}

        {/* Patient Location */}
        {currentLocation && (
          <Marker position={currentLocation} icon={gtaPlayerIcon} />
        )}
      </MapContainer>
    </div>
  );
}
