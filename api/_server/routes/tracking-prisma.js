import express from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { protect, requireRole, requireVehicleAccess } from '../middleware/auth-prisma.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'rsco_secret_2024';

// In-memory store for live vehicle positions
export const liveVehicles = new Map();

// SSE clients registry
const sseClients = new Set();

function broadcastToClients(data) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try { client.res.write(payload); } catch { sseClients.delete(client); }
  }
}

// POST /api/tracking/update (driver pushes location)
router.post('/update', protect, requireRole('DRIVER', 'ADMIN'), async (req, res) => {
  const { vehicleId, lat, lng, speed, fuelLevel, status, orderId } = req.body;
  if (!vehicleId || lat == null || lng == null)
    return res.status(400).json({ message: 'vehicleId, lat, lng required.' });

  const update = { 
    vehicleId, 
    lat, 
    lng, 
    speed: speed || '0 km/h', 
    fuelLevel: fuelLevel ?? 100, 
    status: status || 'in-transit', 
    orderId: orderId || null, 
    driverId: req.user.id, 
    timestamp: new Date() 
  };
  
  liveVehicles.set(vehicleId, update);

  try {
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { lat, lng, speed, fuelLevel, status: status === 'in-transit' ? 'IN_TRANSIT' : 'AVAILABLE', lastUpdated: new Date() }
    }).catch(() => {});

    await prisma.trackingEvent.create({
      data: {
        vehicleId,
        orderId: orderId || null,
        driverId: req.user.id,
        lat,
        lng,
        speed: speed || '0 km/h',
        fuelLevel: fuelLevel ?? 100,
        status: status || 'in-transit',
      }
    }).catch(() => {});
  } catch (error) {
    console.error('Tracking update error:', error);
  }

  broadcastToClients({ type: 'vehicle-update', vehicles: Array.from(liveVehicles.values()) });
  res.json({ ok: true });
});

// GET /api/tracking/stream (SSE)
router.get('/stream', async (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(401).json({ message: 'Token required.' });

  let user;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    user = await prisma.user.findUnique({ 
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true }
    });
    
    if (!user) return res.status(401).end();
  } catch {
    return res.status(401).end();
  }

  if (!['ADMIN', 'MANAGER', 'CLIENT'].includes(user.role))
    return res.status(403).json({ message: 'Access denied to tracking stream.' });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const client = { id: Date.now(), res, user };
  sseClients.add(client);

  let snapshot = Array.from(liveVehicles.values());
  
  if (user.role === 'CLIENT') {
    const clientOrders = await prisma.order.findMany({
      where: { clientId: user.id },
      select: { assignedVehicleId: true }
    });
    const allowedIds = clientOrders.map(o => o.assignedVehicleId).filter(Boolean);
    snapshot = snapshot.filter(v => allowedIds.includes(v.vehicleId));
  }
  
  res.write(`data: ${JSON.stringify({ type: 'initial', vehicles: snapshot })}\n\n`);

  const hb = setInterval(() => {
    try { res.write(': heartbeat\n\n'); } catch { clearInterval(hb); }
  }, 25000);

  req.on('close', () => {
    clearInterval(hb);
    sseClients.delete(client);
  });
});

// GET /api/tracking/history/:vehicleId
router.get('/history/:vehicleId', protect, requireRole('ADMIN', 'MANAGER'), async (req, res) => {
  try {
    const events = await prisma.trackingEvent.findMany({
      where: { vehicleId: req.params.vehicleId },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
    res.json(events);
  } catch (error) {
    console.error('Fetch history error:', error);
    res.status(500).json({ message: 'Failed to fetch history.' });
  }
});

// GET /api/tracking/live
router.get('/live', protect, requireRole('ADMIN', 'MANAGER', 'CLIENT'), async (req, res) => {
  try {
    let vehicles = Array.from(liveVehicles.values());
    
    if (req.user.role === 'CLIENT') {
      const orders = await prisma.order.findMany({
        where: { clientId: req.user.id },
        select: { assignedVehicleId: true }
      });
      const ids = orders.map(o => o.assignedVehicleId).filter(Boolean);
      vehicles = vehicles.filter(v => ids.includes(v.vehicleId));
    }
    
    res.json(vehicles);
  } catch (error) {
    console.error('Fetch live vehicles error:', error);
    res.status(500).json({ message: 'Failed to fetch live vehicles.' });
  }
});

export default router;
