import express from 'express';
import { getPatientState, getFamiliarPlaces, addFamiliarPlace, internalBroadcast } from '../controllers/spatialController.js';

const router = express.Router();

// GET /api/spatial/patient/:id/state
router.get('/patient/:id/state', getPatientState);

// GET /api/spatial/patient/:id/places
router.get('/patient/:id/places', getFamiliarPlaces);

// POST /api/spatial/patient/:id/places
router.post('/patient/:id/places', addFamiliarPlace);

// POST /api/spatial/internal/broadcast (Called by Go Ingestion)
router.post('/internal/broadcast', internalBroadcast);

export default router;
