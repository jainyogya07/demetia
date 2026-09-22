import { SpatialStatus } from './SpatialTypes';

/**
 * DetectionEngine
 * Analyzes location data to detect route deviations and device separation (phone-left-behind).
 */

export const MOCK_DETECTION_STATE = {
  status: SpatialStatus.NORMAL,
  lastKnownLocation: 'Morning Park',
  lastKnownTime: '09:51',
  direction: 'Stationary',
  nearestFamiliarPlace: 'Morning Park',
  summary: 'The patient appears to be at the Morning Park.'
};

let currentState = { ...MOCK_DETECTION_STATE };
const listeners = new Set();

export function getDetectionState() {
  return currentState;
}

export function setDetectionState(newState) {
  currentState = { ...currentState, ...newState };
  listeners.forEach(fn => fn(currentState));
}

export function subscribeDetectionState(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// Simulated Detection Logic Hooks
export function simulateRouteDeviation() {
  setDetectionState({
    status: SpatialStatus.UNUSUAL,
    lastKnownLocation: 'Unknown Road near Park',
    lastKnownTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    direction: 'Northeast',
    nearestFamiliarPlace: 'Morning Park',
    summary: 'The patient has moved away from the expected route near Morning Park.'
  });
}

export function simulatePhoneLeftBehind() {
  setDetectionState({
    status: SpatialStatus.UNAVAILABLE,
    lastKnownLocation: 'Home',
    lastKnownTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    direction: 'Unknown',
    nearestFamiliarPlace: 'Home',
    summary: 'The patient\'s phone appears to remain at home. I cannot currently determine the patient\'s location.'
  });
}

export function resetDetection() {
  setDetectionState(MOCK_DETECTION_STATE);
}
