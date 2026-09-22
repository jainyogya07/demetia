import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { getRouteHistory } from './RouteEngine';
import './Google3DMap.css';

/**
 * Google3DMap
 * Core visual layer for the Teleportation Layer.
 * Renders the photorealistic 3D environment using Google Maps JavaScript API (maps3d).
 */
export default function Google3DMap({ centerLat = 19.0760, centerLng = 72.8777 }) {
  const containerRef = useRef(null);
  const [mapError, setMapError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      setMapError('Google Maps API key is missing. Add VITE_GOOGLE_MAPS_API_KEY to your .env file.');
      return;
    }

    let map3DElement = null;

    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: apiKey,
          version: 'alpha', // 3D maps is currently in alpha/beta for JS API
          libraries: ['maps3d']
        });

        await loader.importLibrary('maps3d');

        // Create the Map3DElement
        map3DElement = document.createElement('gmp-map-3d');
        map3DElement.setAttribute('center', `${centerLat},${centerLng},200`);
        map3DElement.setAttribute('tilt', '45');
        map3DElement.setAttribute('range', '1000'); // distance from camera
        
        // Add styling for full width/height
        map3DElement.style.width = '100%';
        map3DElement.style.height = '100%';

        if (containerRef.current) {
          containerRef.current.appendChild(map3DElement);
        }

        // Add mock route history as markers for demo
        const route = getRouteHistory();
        route.forEach(point => {
          const marker = document.createElement('gmp-marker-3d');
          marker.setAttribute('position', `${point.lat},${point.lng},0`);
          if (point.type === 'node') {
            marker.setAttribute('label', point.location);
          }
          map3DElement.appendChild(marker);
        });

        setIsLoaded(true);
      } catch (err) {
        console.error('Error loading Google 3D Maps:', err);
        setMapError('Failed to load Google 3D Maps. Make sure 3D Maps is enabled for this API key.');
      }
    };

    initMap();

    return () => {
      if (map3DElement && containerRef.current) {
        containerRef.current.removeChild(map3DElement);
      }
    };
  }, [centerLat, centerLng]);

  return (
    <div className="google-3d-map-wrapper">
      {mapError ? (
        <div className="google-3d-map-error">
          <p>⚠️ {mapError}</p>
          <div className="google-3d-mockup">
             {/* Mock visual fallback when API is missing */}
             <div className="mock-map-content">
               <span>[ 3D Maps Simulation View ]</span>
               <p>Center: {centerLat}, {centerLng}</p>
             </div>
          </div>
        </div>
      ) : (
        <div className="google-3d-map-container" ref={containerRef} />
      )}
      
      {!isLoaded && !mapError && (
        <div className="google-3d-map-loading">
          <div className="spinner"></div>
          <p>Teleporting to patient's world...</p>
        </div>
      )}
    </div>
  );
}
