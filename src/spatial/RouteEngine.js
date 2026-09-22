/**
 * RouteEngine
 * Tracks simplified route history rather than raw GPS points.
 */

export const MOCK_ROUTE_HISTORY = [
  { time: '09:41', location: 'Home', lat: 19.0760, lng: 72.8777, type: 'node' },
  { time: '09:44', location: 'Main Road', lat: 19.0770, lng: 72.8780, type: 'path' },
  { time: '09:48', location: 'Park Road', lat: 19.0775, lng: 72.8785, type: 'path' },
  { time: '09:51', location: 'Morning Park', lat: 19.0780, lng: 72.8790, type: 'node' }
];

let currentRoute = [...MOCK_ROUTE_HISTORY];
const listeners = new Set();

export function getRouteHistory() {
  return currentRoute;
}

export function addRoutePoint(point) {
  currentRoute = [...currentRoute, point];
  listeners.forEach(fn => fn(currentRoute));
}

export function subscribeRouteHistory(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
