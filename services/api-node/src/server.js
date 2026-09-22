import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeSockets } from './websocket/socketManager.js';
import spatialRoutes from './routes/spatialRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// In a real production environment, restrict CORS to frontend domains
app.use(cors());
app.use(express.json());

// Initialize WebSocket Orchestration
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

initializeSockets(io);

// Setup REST Routes
app.use('/api/spatial', spatialRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'api-node-orchestrator' });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Node.js Spatial Orchestrator running on port ${PORT}`);
});
