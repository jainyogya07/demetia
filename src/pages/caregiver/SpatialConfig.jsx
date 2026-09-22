import React, { useEffect, useState } from 'react';
import { MapPin, Plus, Trash2, Home, TreePine, Cross, ShoppingBag, Stethoscope, Users } from 'lucide-react';
import { getFamiliarPlaces, updateFamiliarPlaces, subscribeFamiliarPlaces } from '../../spatial/FamiliarPlaces';
import { PlaceCategory } from '../../spatial/SpatialTypes';
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
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    setPlaces(getFamiliarPlaces());
    return subscribeFamiliarPlaces(setPlaces);
  }, []);

  const handleRemove = (id) => {
    const updated = places.filter(p => p.id !== id);
    updateFamiliarPlaces(updated);
  };

  return (
    <div className="spatial-config">
      <div className="config-header">
        <h2>Patient's Familiar World</h2>
        <p>Configure the spatial boundaries and familiar places to help the Care Agent understand the patient's physical context.</p>
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
