import express from 'express';
import prisma from '../lib/prisma.js';
import { protect, requireRole, requireVehicleAccess } from '../middleware/auth-prisma.js';

const router = express.Router();

// Get all vehicles (Admin/Manager) or client vehicles (Client)
router.get('/', protect, async (req, res) => {
  try {
    let vehicles;
    
    if (req.user.role === 'ADMIN' || req.user.role === 'MANAGER') {
      vehicles = await prisma.vehicle.findMany({
        include: {
          driver: { select: { id: true, name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (req.user.role === 'CLIENT') {
      const clientOrders = await prisma.order.findMany({
        where: { clientId: req.user.id },
        select: { assignedVehicleId: true }
      });
      const vehicleIds = clientOrders.map(o => o.assignedVehicleId).filter(Boolean);
      
      vehicles = await prisma.vehicle.findMany({
        where: { id: { in: vehicleIds } },
        include: {
          driver: { select: { id: true, name: true, email: true } }
        }
      });
    } else {
      vehicles = await prisma.vehicle.findMany({
        where: { driverId: req.user.id },
        include: {
          driver: { select: { id: true, name: true, email: true } }
        }
      });
    }
    
    res.json(vehicles);
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single vehicle
router.get('/:id', protect, requireVehicleAccess, async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
      include: {
        driver: { select: { id: true, name: true, email: true } }
      }
    });
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    res.json(vehicle);
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create vehicle (Admin/Manager)
router.post('/', protect, requireRole('ADMIN', 'MANAGER'), async (req, res) => {
  try {
    const { plateNumber, driverName, driverId, status, speed, fuelLevel } = req.body;
    
    const vehicle = await prisma.vehicle.create({
      data: {
        plateNumber,
        driverName,
        driverId,
        status: status || 'AVAILABLE',
        speed,
        fuelLevel
      },
      include: {
        driver: { select: { id: true, name: true, email: true } }
      }
    });
    
    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update vehicle
router.put('/:id', protect, requireRole('ADMIN', 'MANAGER'), async (req, res) => {
  try {
    const { plateNumber, driverName, driverId, status, speed, fuelLevel, lat, lng } = req.body;
    
    const vehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: {
        plateNumber,
        driverName,
        driverId,
        status,
        speed,
        fuelLevel,
        lat,
        lng,
        lastUpdated: new Date()
      },
      include: {
        driver: { select: { id: true, name: true, email: true } }
      }
    });
    
    res.json(vehicle);
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete vehicle (Admin only)
router.delete('/:id', protect, requireRole('ADMIN'), async (req, res) => {
  try {
    await prisma.vehicle.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
