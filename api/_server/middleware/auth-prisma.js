import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'rsco_secret_2024';

// Protect middleware - verifies JWT token
export const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true }
    });
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Require role middleware - checks if user has required role
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized for this action' });
    }
    
    next();
  };
};

// Require order access middleware - clients can only access their own orders
export const requireOrderAccess = async (req, res, next) => {
  if (req.user.role === 'ADMIN' || req.user.role === 'MANAGER') {
    return next();
  }
  
  if (req.user.role === 'CLIENT') {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id }
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.clientId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this order' });
    }
    
    return next();
  }
  
  return res.status(403).json({ message: 'Not authorized' });
};

// Require vehicle access middleware - clients can only access vehicles assigned to their orders
export const requireVehicleAccess = async (req, res, next) => {
  if (req.user.role === 'ADMIN' || req.user.role === 'MANAGER') {
    return next();
  }
  
  if (req.user.role === 'CLIENT') {
    const clientOrders = await prisma.order.findMany({
      where: { clientId: req.user.id },
      select: { assignedVehicleId: true }
    });
    
    const allowedVehicleIds = clientOrders
      .map(o => o.assignedVehicleId)
      .filter(Boolean);
    
    if (!allowedVehicleIds.includes(req.params.id)) {
      return res.status(403).json({ message: 'Not authorized to access this vehicle' });
    }
    
    return next();
  }
  
  return res.status(403).json({ message: 'Not authorized' });
};
