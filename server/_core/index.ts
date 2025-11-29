import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import { prisma } from '../db.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import authRoutes from '../routes/auth.js';
import adminRoutes from '../routes/admin.js';
import publicRoutes from '../routes/public.js';
import { initSocket } from '../socket/handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const port = process.env.PORT || 3001;

app.use(express.json());

// API Routes
app.use('/api', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', authenticateToken, isAdmin, adminRoutes);

// Serve static files and handle client-side routing
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'dist')));
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'dist', 'index.html'));
  } else {
    next();
  }
});

initSocket(io);

async function main() {
  const settings = await prisma.setting.findMany();
  if (settings.length === 0) {
    await prisma.setting.createMany({
      data: [
        { key: 'allow_guests', value: 'true', description: 'Allow guests to join without registration' },
        { key: 'min_username_length', value: '3', description: 'Minimum username length' },
        { key: 'max_username_length', value: '20', description: 'Maximum username length' },
      ],
    });
    console.log('Database seeded with initial settings');
  }

  const admin = await prisma.user.findUnique({ where: { username: 'admin' } });
  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin', 10);
    await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('Admin user created');
  }

  const rooms = await prisma.room.findMany();
  if (rooms.length === 0) {
    await prisma.room.create({
      data: {
        name: 'General',
      },
    });
    console.log('Default room "General" created');
  }

  httpServer.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

main();
