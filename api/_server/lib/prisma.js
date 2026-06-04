import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Handle connection errors
prisma.$connect()
  .then(() => console.log('✅ Database connected successfully'))
  .catch((e) => {
    console.error('❌ Database connection error:', e);
    process.exit(1);
  });

export default prisma;
