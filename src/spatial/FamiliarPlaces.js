import { PlaceCategory } from './SpatialTypes';

/**
 * Manages the patient's familiar spatial locations.
 * In a real app, this would fetch from the backend. 
 * For this demo, we maintain a hardcoded/local state.
 */

export const DEFAULT_FAMILIAR_PLACES = [
  {
    id: 'place_home',
    name: 'Home',
    category: PlaceCategory.HOME,
    lat: 19.0760, // Default to Mumbai for demo if no real coordinates
    lng: 72.8777,
    familiarity: 'High',
    notes: 'Patient has lived here for 40 years.'
  },
  {
    id: 'place_park',
    name: 'Morning Park',
    category: PlaceCategory.PARK,
    lat: 19.0780,
    lng: 72.8790,
    familiarity: 'High',
    notes: 'Visits every morning at 7 AM.'
  },
  {
    id: 'place_temple',
    name: 'Local Temple',
    category: PlaceCategory.WORSHIP,
    lat: 19.0800,
    lng: 72.8750,
    familiarity: 'High',
    notes: 'Goes here every Tuesday.'
  },
  {
    id: 'place_clinic',
    name: 'Dr. Sharma Clinic',
    category: PlaceCategory.CLINIC,
    lat: 19.0740,
    lng: 72.8760,
    familiarity: 'Medium',
    notes: 'Regular checkups.'
  }
];

let currentPlaces = [...DEFAULT_FAMILIAR_PLACES];
const listeners = new Set();

export function getFamiliarPlaces() {
  return currentPlaces;
}

export function updateFamiliarPlaces(newPlaces) {
  currentPlaces = newPlaces;
  listeners.forEach(fn => fn(currentPlaces));
}

export function subscribeFamiliarPlaces(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
