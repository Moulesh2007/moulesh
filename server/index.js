import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './db.js';

import authRoutes from './routes/auth.js';
import worksRoutes from './routes/works.js';
import rawMaterialsRoutes from './routes/rawMaterials.js';
import vehiclesRoutes from './routes/vehicles.js';
import driversRoutes from './routes/drivers.js';
import usersManagementRoutes from './routes/usersManagement.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authRoutes); // /profile and /select-role

app.use('/api/works', worksRoutes);
app.use('/api/raw-materials', rawMaterialsRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/manage/users', usersManagementRoutes);

// Simple health
app.get('/api/', (req, res) => res.send('API and Socket server running'));

app.post('/api/update', (req, res) => {
  const payload = req.body;
  io.emit('location', payload);
  res.json({ ok: true });
});

io.on('connection', (socket) => {
  console.log('client connected', socket.id);
  socket.on('driver-update', (payload) => {
    io.emit('location', payload);
  });
  socket.on('disconnect', () => console.log('client disconnected', socket.id));
});

const PORT = process.env.PORT || 5005;
server.listen(PORT, '127.0.0.1', () => console.log(`Server running on port ${PORT}`));
