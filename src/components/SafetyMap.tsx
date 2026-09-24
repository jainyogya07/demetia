import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../spatial/LeafletSpatialMap.css';
import { getActiveDemoCity } from '../spatial/demoWalk';

const CARTO = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

function walkerIcon(heading = 0) {
  return L.divIcon({
    className: 'demo-walker-wrap',
    html: `<div class="demo-walker" style="transform:rotate(${heading}deg)"><div class="demo-walker-cone"></div><div class="demo-walker-dot"></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export default function SafetyMap({
  home,
  polygon,
  current,
  checkIns = [],
  trail = [],
  heading = 0,
  ariaLabel,
}) {
  const city = getActiveDemoCity();
  const homePin = home || city.home;
  const garden = polygon || city.polygon;
  const hostRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const walkerRef = useRef<any>(null);

  useEffect(() => {
    if (!hostRef.current || mapRef.current) return undefined;
    const map = L.map(hostRef.current, {
      scrollWheelZoom: false,
      attributionControl: false,
      zoomControl: false,
    }).setView([homePin.lat, homePin.lng], 16);
    L.tileLayer(CARTO, {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
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
  }, [homePin.lat, homePin.lng]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    L.polygon(garden, {
      color: '#176b58',
      weight: 2,
      fillColor: '#2f9e7a',
      fillOpacity: 0.16,
    }).addTo(layer);
    L.circle([homePin.lat, homePin.lng], {
      radius: homePin.radiusM || 280,
      color: '#176b58',
      weight: 1.5,
      dashArray: '6 8',
      fill: false,
    }).addTo(layer);
    L.circleMarker([homePin.lat, homePin.lng], {
      radius: 8,
      color: '#ffffff',
      weight: 2,
      fillColor: '#176b58',
      fillOpacity: 1,
    }).addTo(layer).bindPopup(homePin.label || 'Home');

    if (trail.length > 1) {
      L.polyline(trail.map((p) => [p.lat, p.lng]), {
        color: '#145a4a',
        weight: 4,
        opacity: 0.85,
      }).addTo(layer);
      trail.slice(-16).forEach((p, i, arr) => {
        L.circleMarker([p.lat, p.lng], {
          radius: 3 + (i / arr.length) * 3,
          color: '#176b58',
          fillColor: '#176b58',
          fillOpacity: 0.2 + (i / arr.length) * 0.4,
          weight: 0,
        }).addTo(layer);
      });
    }

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

    const here = current || homePin;
    if (walkerRef.current) {
      walkerRef.current.remove();
    }
    walkerRef.current = L.marker([here.lat, here.lng], { icon: walkerIcon(heading) }).addTo(layer);
    if (trail.length > 2) {
      map.panTo([here.lat, here.lng], { animate: true, duration: 0.4 });
    }
  }, [homePin, garden, current, checkIns, trail, heading]);

  return <div className="ss-leaflet" ref={hostRef} role="img" aria-label={ariaLabel || city.mapAria} />;
}
