import express from 'express';

const router = express.Router();

// Mock in-memory state for routines and games
let routineTasks = [
  { id: 'task-1', time: '08:30 AM', title: 'Morning Heart Medication & Water', category: 'MEDICINE', completed: true, icon: 'Pill' },
  { id: 'task-2', time: '10:00 AM', title: 'Gentle Garden Walk & Sunshine', category: 'ACTIVITY', completed: true, icon: 'Footprints' },
  { id: 'task-3', time: '01:00 PM', title: 'Afternoon Calcium Tablet', category: 'MEDICINE', completed: false, icon: 'Pill' },
  { id: 'task-4', time: '04:30 PM', title: 'Brain Games (Chowka Bara or Face Match)', category: 'GAME', completed: false, icon: 'Puzzle' },
  { id: 'task-5', time: '08:00 PM', title: 'Dinner & Evening Soothing Music', category: 'ROUTINE', completed: false, icon: 'Music' }
];

const GAMES_CATALOGUE = [
  { id: 'chowka-bara', title: 'Chowka Bara', region: 'Karnataka', type: 'Strategy & Recall', plays: 42, icon: '🎲' },
  { id: 'pallanguzhi', title: 'Pallanguzhi', region: 'Tamil Nadu', type: 'Motor & Counting', plays: 38, icon: '🪵' },
  { id: 'pachisi', title: 'Pachisi', region: 'North India', type: 'Sequential Planning', plays: 29, icon: '🎯' },
  { id: 'face-match', title: 'Familiar Faces', region: 'Universal', type: 'Facial Recognition', plays: 64, icon: '👥' },
  { id: 'sequence-memory', title: 'Sound Sequence', region: 'Universal', type: 'Short-term Memory', plays: 51, icon: '🔔' }
];

// ==========================================
// 1. PATIENT DASHBOARD COMPOSITE BFF ENDPOINT
// ==========================================
router.get('/patient/:id/dashboard/summary', async (req, res) => {
  const patientId = req.params.id || 'aita';

  // Parallel asynchronous probes to Rust and Go microservices
  const [rustHealth, goHealth] = await Promise.all([
    fetch('http://localhost:5005/health').then(r => r.text()).catch(() => 'OFFLINE'),
    fetch('http://localhost:8080/health').then(r => r.json()).catch(() => ({ status: 'OFFLINE' }))
  ]);

  const completedCount = routineTasks.filter(t => t.completed).length;

  res.json({
    patient: {
      id: patientId,
      name: 'Aita Sharma',
      age: 74,
      conditionStage: 'Mild Cognitive Impairment (Early)',
      avatar: '/assets/infinity_pfp.jpg'
    },
    safetyStatus: {
      isSafe: true,
      currentZone: 'Home Living Area',
      batteryLevel: 88,
      lastSignalTime: new Date().toISOString(),
      deviationState: 'NORMAL',
    },
    todayRoutine: {
      total: routineTasks.length,
      completed: completedCount,
      nextPending: routineTasks.find(t => !t.completed) || null,
      tasks: routineTasks
    },
    recentMemory: {
      id: 'mem_jaipur_1984',
      title: 'Family Trip to Jaipur, 1984',
      album: 'Golden Memories',
      photoUrl: '/photos/garden.png'
    },
    microservicesStatus: {
      rustSpatial: rustHealth === 'Rust Spatial Core OK' ? 'ONLINE' : rustHealth,
      goIngest: goHealth.status || 'OFFLINE',
      nodeGateway: 'ONLINE',
      pythonBrain: 'ONLINE'
    }
  });
});

// ==========================================
// 2. ROUTINE CRUD & TOGGLE ENDPOINTS
// ==========================================
router.get('/routine/today', (req, res) => {
  res.json({ date: new Date().toISOString().slice(0, 10), tasks: routineTasks });
});

router.patch('/routine/tasks/:taskId/toggle', (req, res) => {
  const { taskId } = req.params;
  const task = routineTasks.find(t => t.id === taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  task.completed = !task.completed;
  res.json({ success: true, task });
});

// ==========================================
// 3. BRAIN GAMES CATALOGUE & SCORES
// ==========================================
router.get('/games/catalogue', (req, res) => {
  res.json({ games: GAMES_CATALOGUE });
});

router.post('/games/session/complete', (req, res) => {
  const { gameId, score, durationSeconds, errors } = req.body;
  const game = GAMES_CATALOGUE.find(g => g.id === gameId);
  if (game) game.plays += 1;

  // Calculate cognitive plasticity coefficient
  const plasticityIndex = Math.min(100, Math.max(30, Math.round((score / Math.max(durationSeconds, 1)) * 150 - errors * 5)));

  res.json({
    status: 'recorded',
    gameId,
    score,
    plasticityIndex,
    cognitiveTrajectory: 'STABLE_OR_IMPROVING',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 4. RUST SPATIAL PROXY ENDPOINTS (Zero-Lag Polyline & Geofence)
// ==========================================
router.post('/spatial/simplify', async (req, res) => {
  try {
    const rustRes = await fetch('http://localhost:5005/api/engine/simplify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await rustRes.json();
    res.json(data);
  } catch (err) {
    // Graceful fallback if Rust engine is not booted
    res.json({
      original_points: req.body.coordinates?.length || 0,
      simplified_points: req.body.coordinates?.length || 0,
      coordinates: req.body.coordinates || [],
      source: 'node-fallback'
    });
  }
});

router.post('/spatial/geofence-check', async (req, res) => {
  try {
    const rustRes = await fetch('http://localhost:5005/api/engine/geofence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await rustRes.json();
    res.json(data);
  } catch (err) {
    res.json({ is_inside: true, latency_micros: 999, source: 'fallback' });
  }
});

// ==========================================
// 5. DOCTOR & CLINICAL TRIAGE ROSTER
// ==========================================
router.get('/doctor/patients/roster', (req, res) => {
  res.json({
    total: 3,
    patients: [
      {
        id: 'aita',
        name: 'Aita Sharma',
        age: 74,
        triageRisk: 'LOW',
        mmseScore: 24,
        medCompliance: '94%',
        wanderingIncidentsThisMonth: 0,
        lastActivity: '12m ago'
      },
      {
        id: 'ramesh',
        name: 'Ramesh Verma',
        age: 81,
        triageRisk: 'MODERATE',
        mmseScore: 19,
        medCompliance: '78%',
        wanderingIncidentsThisMonth: 2,
        lastActivity: '45m ago'
      },
      {
        id: 'sarita',
        name: 'Sarita Devi',
        age: 79,
        triageRisk: 'HIGH',
        mmseScore: 14,
        medCompliance: '62%',
        wanderingIncidentsThisMonth: 5,
        lastActivity: '3h ago'
      }
    ]
  });
});

export default router;
