import { SpatialStatus } from './SpatialTypes';
import { getActiveDemoCity, subscribeDemoCity } from './demoWalk';
import type { DemoCity } from '../types/app';

function mockFor(city: DemoCity) {
  return {
    status: SpatialStatus.NORMAL,
    lastKnownLocation: `Home garden, ${city.cityLabel}`,
    lastKnownTime: '09:51',
    direction: 'Stationary',
    nearestFamiliarPlace: 'Home',
    summary: city.copyInside,
  };
}

export const MOCK_DETECTION_STATE = mockFor(getActiveDemoCity());

let currentState = { ...MOCK_DETECTION_STATE };
const listeners = new Set<(state: typeof currentState) => void>();

subscribeDemoCity((city) => {
  currentState = mockFor(city);
  listeners.forEach((fn) => fn(currentState));
});

export function getDetectionState() {
  return currentState;
}

export function setDetectionState(newState: Partial<typeof currentState>) {
  currentState = { ...currentState, ...newState };
  listeners.forEach((fn) => fn(currentState));
}

export function subscribeDetectionState(callback: (state: typeof currentState) => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function simulateRouteDeviation() {
  const city = getActiveDemoCity();
  const park = city.places.find((p) => p.id === 'place_park');
  setDetectionState({
    status: SpatialStatus.UNUSUAL,
    lastKnownLocation: park ? `Quiet lane near ${park.name}` : 'Quiet lane near the park',
    lastKnownTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    direction: 'Northeast',
    nearestFamiliarPlace: park?.name || 'Park',
    summary: 'The walk turned a little differently near the park. Home is still close.',
  });
}

export function simulatePhoneLeftBehind() {
  setDetectionState({
    status: SpatialStatus.UNAVAILABLE,
    lastKnownLocation: 'Home',
    lastKnownTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    direction: 'Unknown',
    nearestFamiliarPlace: 'Home',
    summary: 'The phone still looks like it is at Home. We cannot see the walk right now.',
  });
}

export function resetDetection() {
  setDetectionState(mockFor(getActiveDemoCity()));
}
