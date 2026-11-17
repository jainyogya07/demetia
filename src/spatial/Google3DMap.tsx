import LeafletSpatialMap from './LeafletSpatialMap';
import './Google3DMap.css';

/**
 * Visual layer for Safe Journey.
 * Uses the key-free Carto/Leaflet demo map so filming never depends on Google 3D keys.
 */
export default function Google3DMap(props) {
  const {
    centerLat = 26.16952,
    centerLng = 91.76785,
    sample,
    trail,
    metrics,
    playing,
    enabled,
    speed,
    setSpeed,
    togglePlay,
    startDemo,
    stopDemo,
    city,
    setCity,
  } = props;

  return (
    <div className="google-3d-map-wrapper">
      <LeafletSpatialMap
        zoom={16}
        interactive
        isMinimap={false}
        centerLat={centerLat}
        centerLng={centerLng}
        sample={sample}
        trail={trail}
        metrics={metrics}
        playing={playing}
        enabled={enabled}
        speed={speed}
        setSpeed={setSpeed}
        togglePlay={togglePlay}
        startDemo={startDemo}
        stopDemo={stopDemo}
        city={city}
        setCity={setCity}
      />
    </div>
  );
}
