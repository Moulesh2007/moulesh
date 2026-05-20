import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'rsco_secret_2024';

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

// Super admins get admin role automatically
const SUPER_ADMIN_EMAILS = ['mouleshmr11@gmail.com'];

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });

// ─── Rate Limiters ────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: 'Too many attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── In-memory mock DB ────────────────────────────────────────────────────
const mockDB = new Map();

// Pre-seed demo users in mock DB (password: password)
const demoUsers = [
  {
    _id: 'admin_seed_001',
    name: 'Admin User',
    email: 'admin@rsco.com',
    password: '$2b$10$3N.njathPRKOiyd1BmgnPu7yLpBLuN3LThdgL8Sk6yywjFQ7WevBG', // password
    avatar: '',
    role: 'admin',
    authProvider: 'local',
    createdAt: new Date(),
    lastLogin: new Date(),
  },
  {
    _id: 'manager_seed_001',
    name: 'Manager User',
    email: 'manager@rsco.com',
    password: '$2b$10$3N.njathPRKOiyd1BmgnPu7yLpBLuN3LThdgL8Sk6yywjFQ7WevBG', // password
    avatar: '',
    role: 'manager',
    authProvider: 'local',
    createdAt: new Date(),
    lastLogin: new Date(),
  },
  {
    _id: 'client_seed_001',
    name: 'Client User',
    email: 'client@rsco.com',
    password: '$2b$10$3N.njathPRKOiyd1BmgnPu7yLpBLuN3LThdgL8Sk6yywjFQ7WevBG', // password
    avatar: '',
    role: 'client',
    authProvider: 'local',
    createdAt: new Date(),
    lastLogin: new Date(),
  },
  {
    _id: 'driver_seed_001',
    name: 'Driver User',
    email: 'driver@rsco.com',
    password: '$2b$10$3N.njathPRKOiyd1BmgnPu7yLpBLuN3LThdgL8Sk6yywjFQ7WevBG', // password
    avatar: '',
    role: 'driver',
    authProvider: 'local',
    createdAt: new Date(),
    lastLogin: new Date(),
  },
];

demoUsers.forEach(user => mockDB.set(user.email.toLowerCase(), user));

const findUserByEmail = async (email) => {
  if (mongoose.connection.readyState === 1) return await User.findOne({ email: email.toLowerCase() });
  return mockDB.get(email.toLowerCase()) || null;
};

const findUserById = async (id) => {
  if (mongoose.connection.readyState === 1) return await User.findById(id);
  return Array.from(mockDB.values()).find(u => u._id.toString() === id) || null;
};

const saveUser = async (userData) => {
  if (mongoose.connection.readyState === 1) {
    if (userData.save) return await userData.save();
    return await User.create(userData);
  }
  if (!userData._id) userData._id = Date.now().toString();
  mockDB.set(userData.email.toLowerCase(), userData);
  return userData;
};

// ─── Validation Helpers ───────────────────────────────────────────────────
const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('One number');
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('One special character');
  return errors;
};

const validateGmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

// ─── POST /auth/register ──────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Input validation
  if (!name?.trim() || !email?.trim() || !password || !confirmPassword)
    return res.status(400).json({ message: 'All fields are required.' });

  if (name.trim().length < 2)
    return res.status(400).json({ message: 'Full name must be at least 2 characters.' });

  if (!validateGmail(email))
    return res.status(400).json({ message: 'Please use a valid email address.' });

  const pwErrors = validatePassword(password);
  if (pwErrors.length > 0)
    return res.status(400).json({ message: `Password must contain: ${pwErrors.join(', ')}.` });

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'Passwords do not match.' });

  try {
    const existing = await findUserByEmail(email);
    if (existing) return res.status(400).json({ message: 'This Gmail is already registered. Please log in.' });

    const hashed = await bcrypt.hash(password, 12);
    const autoRole = SUPER_ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : null;

    const user = await saveUser({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashed,
      role: autoRole,
      authProvider: 'local',
      createdAt: new Date(),
      lastLogin: new Date(),
    });

    const token = generateToken(user._id.toString());
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: '',
      role: user.role,
      token,
      isNewUser: !autoRole,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// ─── POST /auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password)
    return res.status(400).json({ message: 'Email and password are required.' });

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' });

    if (SUPER_ADMIN_EMAILS.includes(email.toLowerCase()) && !user.role) user.role = 'admin';
    user.lastLogin = new Date();
    await saveUser(user);

    const token = generateToken(user._id.toString());
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
      role: user.role,
      token,
      isNewUser: false,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// ─── POST /auth/google ────────────────────────────────────────────────────
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Google credential missing.' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ message: 'Invalid Google token.' });
    }

    const email = payload.email.toLowerCase();
    const name = payload.name || 'Google User';
    const avatar = payload.picture || '';

    let user = await findUserByEmail(email);
    let isNewUser = false;
    
    if (!user) {
      // Create new user if they don't exist
      isNewUser = true;
      const autoRole = SUPER_ADMIN_EMAILS.includes(email) ? 'admin' : null;
      user = await saveUser({
        name,
        email,
        password: '', // No password for Google login
        avatar,
        role: autoRole,
        authProvider: 'google',
        createdAt: new Date(),
        lastLogin: new Date(),
      });
    } else {
      // Update existing user login time
      if (SUPER_ADMIN_EMAILS.includes(email) && !user.role) user.role = 'admin';
      user.lastLogin = new Date();
      if (!user.avatar) user.avatar = avatar;
      await saveUser(user);
    }

    const token = generateToken(user._id.toString());
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
      role: user.role,
      token,
      isNewUser: isNewUser && !user.role,
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Google login failed.' });
  }
});

// ─── POST /auth/logout ────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  // JWT is stateless; client removes token. Confirm logout server-side.
  res.json({ message: 'Logged out successfully.' });
});

// ─── GET /user/me ─────────────────────────────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ message: 'Not authorized.' });
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    const user = await findUserById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found.' });
    res.json({ _id: user._id, name: user.name, email: user.email, avatar: user.avatar || '', role: user.role });
  } catch {
    res.status(401).json({ message: 'Session expired. Please log in again.' });
  }
});

// ─── POST /user/select-role ───────────────────────────────────────────────
router.post('/select-role', async (req, res) => {
  const { role } = req.body;
  if (!['admin', 'manager', 'client', 'driver'].includes(role))
    return res.status(400).json({ message: 'Invalid role.' });
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ message: 'Not authorized.' });
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    const user = await findUserById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found.' });
    if (user.role) return res.status(400).json({ message: 'Role already assigned. Contact admin to change it.' });
    user.role = role;
    await saveUser(user);
    const token = generateToken(user._id.toString());
    res.json({ _id: user._id, name: user.name, email: user.email, avatar: user.avatar || '', role: user.role, token });
  } catch {
    res.status(401).json({ message: 'Session expired. Please log in again.' });
  }
});

// ─── GET /user/dashboard ─────────────────────────────────────────────────
router.get('/dashboard', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ message: 'Not authorized.' });
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    const user = await findUserById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found.' });
    if (!user.role) return res.json({ route: '/role-selection' });
    const paths = { admin: '/admin-dashboard', manager: '/manager-dashboard', client: '/client-portal', driver: '/driver-app' };
    res.json({ route: paths[user.role] || '/dashboard' });
  } catch {
    res.status(401).json({ message: 'Session expired. Please log in again.' });
  }
});

export default router;
