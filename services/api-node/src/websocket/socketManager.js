let ioInstance;

export const initializeSockets = (io) => {
  ioInstance = io;
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Caregiver subscribes to a specific patient's spatial stream
    socket.on('subscribe:patient', (patientId) => {
      console.log(`👤 Client ${socket.id} subscribed to patient ${patientId}`);
      socket.join(`patient_${patientId}`);
      
      // Initial state payload
      socket.emit('spatial:state_update', {
        patientId,
        status: 'NORMAL',
        lastKnownLocation: 'Home',
        lastKnownTime: new Date().toISOString(),
        direction: 'Stationary',
        nearestFamiliarPlace: 'Home',
        summary: 'Patient is at their familiar location.'
      });
    });

    socket.on('unsubscribe:patient', (patientId) => {
      socket.leave(`patient_${patientId}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

export const broadcastSpatialState = (patientId, stateUpdate) => {
  if (ioInstance) {
    ioInstance.to(`patient_${patientId}`).emit('spatial:state_update', stateUpdate);
  }
};
