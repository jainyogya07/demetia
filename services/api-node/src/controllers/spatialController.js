// Mock Data for Demo
const MOCK_PLACES = [
  { id: 'place_home', name: 'Home', category: 'HOME', lat: 19.0760, lng: 72.8777, familiarity: 'High' },
  { id: 'place_park', name: 'Morning Park', category: 'PARK', lat: 19.0780, lng: 72.8790, familiarity: 'High' }
];

export const getPatientState = (req, res) => {
  const { id } = req.params;
  
  // In production, query Redis for current state
  res.json({
    patientId: id,
    status: 'NORMAL',
    lastKnownLocation: 'Morning Park',
    direction: 'Stationary',
    summary: 'Patient is following a safe route.'
  });
};

export const getFamiliarPlaces = (req, res) => {
  const { id } = req.params;
  // In production, query PostgreSQL via Prisma/TypeORM
  res.json({ patientId: id, places: MOCK_PLACES });
};

export const addFamiliarPlace = (req, res) => {
  const { id } = req.params;
  const newPlace = req.body;
  newPlace.id = `place_${Date.now()}`;
  MOCK_PLACES.push(newPlace);
  
  res.status(201).json(newPlace);
};

import { broadcastSpatialState } from '../websocket/socketManager.js';

export const internalBroadcast = (req, res) => {
  const stateUpdate = req.body;
  if (!stateUpdate || !stateUpdate.patientId) {
    return res.status(400).json({ error: 'Invalid state update payload' });
  }

  // Broadcast to all WebSocket clients subscribed to this patient
  broadcastSpatialState(stateUpdate.patientId, stateUpdate);
  
  res.status(200).json({ status: 'broadcasted' });
};
