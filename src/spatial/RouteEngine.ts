import { getActiveDemoCity, subscribeDemoCity } from './demoWalk';

function historyFor(city) {
  const h = city.home;
  const park = city.places.find((p) => p.id === 'place_park') || h;
  return [
    { time: '09:41', location: 'Home', lat: h.lat, lng: h.lng, type: 'node' },
    { time: '09:44', location: city.path[2]?.name || 'Lane', lat: city.path[2]?.lat ?? h.lat, lng: city.path[2]?.lng ?? h.lng, type: 'path' },
    { time: '09:48', location: city.path[5]?.name || 'Park', lat: city.path[5]?.lat ?? h.lat, lng: city.path[5]?.lng ?? h.lng, type: 'path' },
    { time: '09:51', location: park.name, lat: park.lat, lng: park.lng, type: 'node' },
  ];
}

export const MOCK_ROUTE_HISTORY = historyFor(getActiveDemoCity());

let currentRoute = [...MOCK_ROUTE_HISTORY];
const listeners = new Set<(route: typeof currentRoute) => void>();

subscribeDemoCity((city) => {
  currentRoute = historyFor(city);
  listeners.forEach((fn) => fn(currentRoute));
});

export function getRouteHistory() {
  return currentRoute;
}

export function addRoutePoint(point: (typeof currentRoute)[number]) {
  currentRoute = [...currentRoute, point];
  listeners.forEach((fn) => fn(currentRoute));
}

export function subscribeRouteHistory(callback: (route: typeof currentRoute) => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}
