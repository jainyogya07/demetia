// @ts-nocheck — leftover JS-shaped module; runtime unchanged
import React, { useEffect, useState } from 'react';
import { MapPin, Plus, Trash2, Home, TreePine, Cross, ShoppingBag, Stethoscope, Users } from 'lucide-react';
import { getFamiliarPlaces, updateFamiliarPlaces, subscribeFamiliarPlaces } from '../../spatial/FamiliarPlaces';
import { PlaceCategory } from '../../spatial/SpatialTypes';
import { bffFetch, bffSilent } from '../../lib/bff';
import './SpatialConfig.css';

const ICONS = {
  [PlaceCategory.HOME]: Home,
  [PlaceCategory.PARK]: TreePine,
  [PlaceCategory.WORSHIP]: Cross,
  [PlaceCategory.SHOP]: ShoppingBag,
  [PlaceCategory.CLINIC]: Stethoscope,
  [PlaceCategory.RELATIVE]: Users,
  [PlaceCategory.OTHER]: MapPin,
};

export default function SpatialConfig() {
  const [places, setPlaces] = useState<unknown[]>([]);

  useEffect(() => {
    setPlaces(getFamiliarPlaces());
    bffFetch('/api/v1/places/familiar');
    return subscribeFamiliarPlaces(setPlaces);
  }, []);

  const handleRemove = (id) => {
    const updated = places.filter(p => p.id !== id);
    updateFamiliarPlaces(updated);
    bffSilent('POST', '/api/v1/places/familiar', { places: updated });
  };

  return (
    <div className="spatial-config">
      <div className="config-header">
        <h2>Safe Journey places</h2>
        <p>Home garden and known lanes — so family can walk with you, calmly.</p>
      </div>

      <div className="places-list">
        {places.map(place => {
          const Icon = ICONS[place.category] || MapPin;
          return (
            <div key={place.id} className="place-card">
              <div className="place-icon">
                <Icon size={24} />
              </div>
              <div className="place-details">
                <h3>{place.name}</h3>
                <span className={`tag tag-${place.familiarity.toLowerCase()}`}>{place.familiarity} Familiarity</span>
                <p className="coords">{place.lat.toFixed(4)}, {place.lng.toFixed(4)}</p>
                {place.notes && <p className="notes">{place.notes}</p>}
              </div>
              <button className="btn-remove" onClick={() => handleRemove(place.id)} title="Remove Place">
                <Trash2 size={18} />
              </button>
            </div>
          );
        })}

        <button className="place-card add-new">
          <Plus size={24} />
          <span>Add Familiar Place</span>
        </button>
      </div>
    </div>
  );
}
