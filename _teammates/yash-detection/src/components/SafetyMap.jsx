import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function SafetyMap({ home, current, checkIns = [] }) {
  const hostRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (!hostRef.current || mapRef.current) return undefined;
    const map = L.map(hostRef.current, {
      scrollWheelZoom: false,
      attributionControl: true,
    }).setView([home.lat, home.lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);
    setTimeout(onResize, 200);
    return () => {
      window.removeEventListener('resize', onResize);
      map.remove();
      mapRef.current = null;
    };
  }, [home.lat, home.lng]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    L.circle([home.lat, home.lng], {
      radius: 350,
      color: '#176b58',
      weight: 1.5,
      fillColor: '#176b58',
      fillOpacity: 0.1,
    }).addTo(layer);
    L.circleMarker([home.lat, home.lng], {
      radius: 9,
      color: '#ffffff',
      weight: 2,
      fillColor: '#176b58',
      fillOpacity: 1,
    }).addTo(layer).bindPopup(home.label);
    L.circleMarker([current.lat, current.lng], {
      radius: 8,
      color: '#ffffff',
      weight: 2,
      fillColor: '#c18429',
      fillOpacity: 1,
    }).addTo(layer).bindPopup('Current pin');
    checkIns.forEach((row) => {
      if (typeof row.lat !== 'number' || typeof row.lng !== 'number') return;
      L.circleMarker([row.lat, row.lng], {
        radius: 5,
        color: '#214d42',
        fillColor: '#214d42',
        fillOpacity: 0.85,
        weight: 1,
      }).addTo(layer).bindPopup(row.place || 'Check-in');
    });
    const points = [
      [home.lat, home.lng],
      [current.lat, current.lng],
      ...checkIns.filter((r) => typeof r.lat === 'number').map((r) => [r.lat, r.lng]),
    ];
    try {
      map.fitBounds(points, { padding: [28, 28], maxZoom: 16 });
    } catch {
      map.setView([home.lat, home.lng], 15);
    }
  }, [home, current, checkIns]);

  return <div className="ss-leaflet" ref={hostRef} role="img" aria-label="Map of Home and check-ins in Guwahati" />;
}
