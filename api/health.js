import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors({
  origin: ['https://rs-co-tracking.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.get('/', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: error.message });
  }
});

export default app;
