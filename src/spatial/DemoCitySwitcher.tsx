import { DEMO_CITIES } from './demoWalk';
import './LeafletSpatialMap.css';

export default function DemoCitySwitcher({ cityId, onChange, compact = false }) {
  return (
    <div className={`demo-city-switcher${compact ? ' is-compact' : ''}`} role="group" aria-label="Demo city">
      {DEMO_CITIES.map((c) => (
        <button
          key={c.id}
          type="button"
          className={c.id === cityId ? 'is-on' : ''}
          onClick={() => onChange?.(c.id)}
        >
          {c.shortLabel}
        </button>
      ))}
    </div>
  );
}
