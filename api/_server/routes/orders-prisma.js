import express from 'express';
import prisma from '../lib/prisma.js';
import { protect, requireRole, requireOrderAccess } from '../middleware/auth-prisma.js';

const router = express.Router();

// Get all orders (Admin/Manager) or client orders (Client)
router.get('/', protect, async (req, res) => {
  try {
    let orders;
    
    if (req.user.role === 'ADMIN' || req.user.role === 'MANAGER') {
      orders = await prisma.order.findMany({
        include: {
          client: { select: { id: true, name: true, email: true } },
          assignedVehicle: { select: { id: true, plateNumber: true, driverName: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (req.user.role === 'CLIENT') {
      orders = await prisma.order.findMany({
        where: { clientId: req.user.id },
        include: {
          assignedVehicle: { select: { id: true, plateNumber: true, driverName: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      orders = await prisma.order.findMany({
        where: { assignedDriverId: req.user.id },
        include: {
          client: { select: { id: true, name: true, email: true } },
          assignedVehicle: { select: { id: true, plateNumber: true, driverName: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    }
    
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', protect, requireOrderAccess, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        client: { select: { id: true, name: true, email: true } },
        assignedVehicle: { select: { id: true, plateNumber: true, driverName: true } }
      }
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create order (Admin/Manager)
router.post('/', protect, requireRole('ADMIN', 'MANAGER'), async (req, res) => {
  try {
    const { workName, description, clientId, assignedVehicleId, priority } = req.body;
    
    const order = await prisma.order.create({
      data: {
        workName,
        description,
        clientId,
        assignedVehicleId,
        priority: priority || 'MEDIUM'
      },
      include: {
        client: { select: { id: true, name: true, email: true } },
        assignedVehicle: { select: { id: true, plateNumber: true, driverName: true } }
      }
    });
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order
router.put('/:id', protect, requireRole('ADMIN', 'MANAGER'), async (req, res) => {
  try {
    const { status, assignedVehicleId, priority } = req.body;
    
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status,
        assignedVehicleId,
        priority
      },
      include: {
        client: { select: { id: true, name: true, email: true } },
        assignedVehicle: { select: { id: true, plateNumber: true, driverName: true } }
      }
    });
    
    res.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete order (Admin only)
router.delete('/:id', protect, requireRole('ADMIN'), async (req, res) => {
  try {
    await prisma.order.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
