import { io, type Socket } from 'socket.io-client';
import { setDetectionState } from './DetectionEngine';

// Replace with your actual deployed Node.js Orchestrator URL
const SOCKET_SERVER_URL = 'http://localhost:4000';

let socket: Socket | null = null;

export const initializeSpatialClient = (patientId: string) => {
  if (socket) return socket; // Already connected

  socket = io(SOCKET_SERVER_URL);

  socket.on('connect', () => {
    console.log('✅ Connected to Spatial Orchestrator');
    socket?.emit('subscribe:patient', patientId);
  });

  socket.on('spatial:state_update', (update) => {
    console.log('📡 Received spatial update:', update);
    // Push the update to our local state manager so React components re-render
    setDetectionState({
      status: update.status,
      lastKnownLocation: update.lastKnownLocation,
      lastKnownTime: update.lastKnownTime,
      direction: update.direction,
      summary: update.summary,
      nearestFamiliarPlace: update.nearestFamiliarPlace,
    });
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from Spatial Orchestrator');
  });

  return socket;
};

export const disconnectSpatialClient = (patientId?: string) => {
  if (socket) {
    socket.emit('unsubscribe:patient', patientId);
    socket.disconnect();
    socket = null;
  }
};
