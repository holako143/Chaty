import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const prisma = new PrismaClient();

let onlineUsers = [];

const port = process.env.PORT || 3001;

app.use(express.json());

// Serve the static files from the client/dist directory
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'dist')));

// Handles any requests that don't match the ones above
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'dist', 'index.html'));
  } else {
    next();
  }
});

// API routes
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: 'Username already exists' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }
  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  await prisma.log.create({
    data: {
      action: 'USER_LOGIN',
      userId: user.id,
    },
  });

  res.json({ user, token });
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

app.get('/api/messages', authenticateToken, isAdmin, async (req, res) => {
  const messages = await prisma.message.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(messages);
});

app.get('/api/settings', authenticateToken, isAdmin, async (req, res) => {
  const settings = await prisma.setting.findMany();
  res.json(settings);
});

app.post('/api/settings', authenticateToken, isAdmin, async (req, res) => {
  const { key, value } = req.body;
  const setting = await prisma.setting.update({
    where: { key },
    data: { value },
  });
  res.json(setting);
});

app.get('/api/rooms', async (req, res) => {
  const rooms = await prisma.room.findMany();
  res.json(rooms);
});

app.get('/api/users', authenticateToken, isAdmin, async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/api/rooms', authenticateToken, isAdmin, async (req, res) => {
  const { name } = req.body;
  const room = await prisma.room.create({
    data: { name },
  });
  res.json(room);
});

app.delete('/api/rooms/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  await prisma.room.delete({ where: { id } });
  res.json({ message: 'Room deleted' });
});

app.get('/api/logs', authenticateToken, isAdmin, async (req, res) => {
  const logs = await prisma.log.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(logs);
});

io.on('connection', (socket) => {
  socket.on('join room', (roomName) => {
    socket.join(roomName);
    console.log(`a user joined room: ${roomName}`);
  });

  socket.on('user joined', (user) => {
    onlineUsers.push({ id: socket.id, username: user.username });
    io.emit('online users', onlineUsers);
    console.log(`${user.username} connected`);
  });

  socket.on('chat message', async (msg) => {
    const { userId, text, roomId } = msg;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const message = await prisma.message.create({
        data: {
          text,
          userId,
          roomId,
        },
      });

      await prisma.log.create({
        data: {
          action: 'SEND_MESSAGE',
          userId: user.id,
          details: `Room: ${roomId}, Message: ${text}`,
        },
      });

      io.to(roomId).emit('chat message', { ...message, user });
    }
  });

  socket.on('disconnect', () => {
    const disconnectedUser = onlineUsers.find(user => user.id === socket.id);
    onlineUsers = onlineUsers.filter(user => user.id !== socket.id);
    io.emit('online users', onlineUsers);
    console.log(`${disconnectedUser?.username} disconnected`);
  });
});

async function main() {
  const settings = await prisma.setting.findMany();
  if (settings.length === 0) {
    await prisma.setting.createMany({
      data: [
        {
          key: 'allow_guests',
          value: 'true',
          description: 'Allow guests to join the chat without registration',
        },
        {
          key: 'min_username_length',
          value: '3',
          description: 'Minimum length for usernames',
        },
        {
          key: 'max_username_length',
          value: '20',
          description: 'Maximum length for usernames',
        },
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
