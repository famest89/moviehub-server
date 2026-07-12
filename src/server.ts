import express from 'express';
import { config } from 'dotenv';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import { prisma } from './lib/prisma.js';

config();
prisma.$connect();

const app = express();

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/auth', authRoutes);
app.use('/movies', movieRoutes);

const PORT = 5001;
const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}...`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection', err);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', async (err) => {
  console.error('Uncaught exceptions', err);
  await prisma.$disconnect();
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});
