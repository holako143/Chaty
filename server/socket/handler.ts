import { Server } from 'socket.io';
import { prisma } from '../db.js';

let onlineUsers: any[] = [];
let filteredWords: any[] = [];

export const initSocket = async (io: Server) => {
  filteredWords = await prisma.filteredWord.findMany();

  io.on('connection', async (socket) => {
    const ipAddress = socket.handshake.address;

    const fingerprint = socket.handshake.query.fingerprint;
    const ban = await prisma.ban.findFirst({
      where: {
        OR: [
          { fingerprint: fingerprint as string },
          { ipAddress },
        ],
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (ban) {
      socket.emit('banned', { reason: ban.reason, expiresAt: ban.expiresAt });
      socket.disconnect();
      return;
    }

    socket.on('join room', (roomName) => {
      socket.join(roomName);
      console.log(`a user joined room: ${roomName}`);
    });

    socket.on('user joined', (user) => {
      onlineUsers.push({ id: socket.id, username: user.username, fingerprint: user.fingerprint, ipAddress });
      io.emit('online users', onlineUsers);
      console.log(`${user.username} connected`);
    });

    socket.on('chat message', async (msg) => {
      const { userId, text, roomId } = msg;

      const containsFilteredWord = filteredWords.some(word => text.includes(word.word));
      if (containsFilteredWord) {
        await prisma.log.create({
          data: {
            action: 'FILTERED_MESSAGE',
            userId: userId,
            details: `Room: ${roomId}, Message: ${text}`,
          },
        });
        socket.emit('message filtered', { message: 'Your message was filtered.' });
        return;
      }

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
};
