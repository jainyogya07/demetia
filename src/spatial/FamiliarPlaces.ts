import { PlaceCategory } from './SpatialTypes';
import { getActiveDemoCity, subscribeDemoCity } from './demoWalk';

function taggedPlaces(city) {
  return city.places.map((p) => ({
    ...p,
    category: p.id === 'place_home' ? PlaceCategory.HOME
      : p.id === 'place_park' ? PlaceCategory.PARK
        : p.id === 'place_temple' ? PlaceCategory.WORSHIP
          : PlaceCategory.CLINIC,
    notes: p.id === 'place_home' ? city.home.label : `Familiar stop near ${city.home.label}.`,
  }));
}

export const DEFAULT_FAMILIAR_PLACES = taggedPlaces(getActiveDemoCity());

let currentPlaces = [...DEFAULT_FAMILIAR_PLACES];
const listeners = new Set<(places: typeof currentPlaces) => void>();

subscribeDemoCity((city) => {
  currentPlaces = taggedPlaces(city);
  listeners.forEach((fn) => fn(currentPlaces));
});

export function getFamiliarPlaces() {
  return currentPlaces;
}

export function updateFamiliarPlaces(newPlaces: typeof currentPlaces) {
  currentPlaces = newPlaces;
  listeners.forEach((fn) => fn(currentPlaces));
}

export function subscribeFamiliarPlaces(callback: (places: typeof currentPlaces) => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}
