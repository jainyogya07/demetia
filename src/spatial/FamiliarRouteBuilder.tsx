import React, { useState } from 'react';
import '../pages/caregiver/SpatialPresence.css'; // Re-use styling

export default function FamiliarRouteBuilder({ onSaveRoute, onClose }) {
  const [routeName, setRouteName] = useState('');
  const [startPoint, setStartPoint] = useState('Home');
  const [destination, setDestination] = useState('Park');
  const [waypoints, setWaypoints] = useState(['Main Gate', 'Tea Shop', 'Park Entrance']);
  const [timeRange, setTimeRange] = useState('07:00-09:00');
  const [type, setType] = useState('outdoor'); // 'indoor' or 'outdoor'

  const handleSave = () => {
    const routeData = {
      id: `route_${Date.now()}`,
      name: routeName,
      type,
      start: startPoint,
      destination,
      waypoints,
      typicalTime: timeRange
    };
    onSaveRoute(routeData);
  };

  const addWaypoint = () => {
    setWaypoints([...waypoints, 'New Stop']);
  };

  const removeWaypoint = (index) => {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  };

  const updateWaypoint = (index, value) => {
    const newWaypoints = [...waypoints];
    newWaypoints[index] = value;
    setWaypoints(newWaypoints);
  };

  return (
    <div className="route-builder-overlay">
      <div className="route-builder-modal">
        <h2>Create Familiar Route</h2>
        
        <div className="form-group">
          <label>Route Type</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="outdoor">Outdoor Route</option>
            <option value="indoor">Indoor Routine</option>
          </select>
        </div>

        <div className="form-group">
          <label>Route Name</label>
          <input 
            type="text" 
            placeholder="e.g. Morning Park Walk" 
            value={routeName} 
            onChange={e => setRouteName(e.target.value)} 
          />
        </div>

        <div className="form-group route-nodes">
          <label>Start Location</label>
          <input 
            type="text" 
            value={startPoint} 
            onChange={e => setStartPoint(e.target.value)} 
          />
          
          <label>Familiar Stops (Waypoints)</label>
          {waypoints.map((wp, i) => (
            <div key={i} className="waypoint-row">
              <span className="waypoint-node">↓</span>
              <input 
                type="text" 
                value={wp} 
                onChange={e => updateWaypoint(i, e.target.value)} 
              />
              <button className="btn-remove" onClick={() => removeWaypoint(i)}>x</button>
            </div>
          ))}
          <button className="btn-add-waypoint" onClick={addWaypoint}>+ Add Stop</button>

          <label>Destination</label>
          <input 
            type="text" 
            value={destination} 
            onChange={e => setDestination(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label>Typical Time Window</label>
          <input 
            type="text" 
            placeholder="07:00-09:00" 
            value={timeRange} 
            onChange={e => setTimeRange(e.target.value)} 
          />
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>Save Route</button>
        </div>
      </div>
    </div>
  );
}
