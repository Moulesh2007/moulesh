import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: ['https://rs-co-tracking.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API is working' });
});

export default app;
