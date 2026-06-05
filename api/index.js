import app from './_server/index-prisma.js';

// Vercel serverless function handler
export default function handler(req, res) {
  app(req, res);
}
