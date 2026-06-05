import express from 'express';
import cors from 'cors';
import prisma from './lib/prisma.js';
import authRoutes from './routes/auth-prisma.js';
import orderRoutes from './routes/orders-prisma.js';
import vehicleRoutes from './routes/vehicles-prisma.js';
import trackingRoutes from './routes/tracking-prisma.js';

const app = express();

// Middleware
app.use(cors({
  origin: ['https://rs-co-tracking.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: 'connected' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/tracking', trackingRoutes);

// Export for Vercel
export default app;
