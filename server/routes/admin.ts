import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

router.get('/messages', async (req, res) => {
  const messages = await prisma.message.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(messages);
});

router.get('/settings', async (req, res) => {
  const settings = await prisma.setting.findMany();
  res.json(settings);
});

router.post('/settings', async (req, res) => {
  const { key, value } = req.body;
  const setting = await prisma.setting.update({
    where: { key },
    data: { value },
  });
  res.json(setting);
});

router.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.post('/rooms', async (req, res) => {
  const { name } = req.body;
  const room = await prisma.room.create({
    data: { name },
  });
  res.json(room);
});

router.delete('/rooms/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.room.delete({ where: { id: String(id) } });
  res.json({ message: 'Room deleted' });
});

router.post('/bans', async (req, res) => {
  const { fingerprint, ipAddress, reason, expiresAt } = req.body;
  const ban = await prisma.ban.create({
    data: { fingerprint, ipAddress, reason, expiresAt },
  });
  res.json(ban);
});

router.get('/bans', async (req, res) => {
  const bans = await prisma.ban.findMany();
  res.json(bans);
});

router.delete('/bans/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.ban.delete({ where: { id: String(id) } });
  res.json({ message: 'Ban lifted' });
});

router.post('/filtered-words', async (req, res) => {
  const { word } = req.body;
  const filteredWord = await prisma.filteredWord.create({ data: { word } });
  res.json(filteredWord);
});

router.get('/filtered-words', async (req, res) => {
  const words = await prisma.filteredWord.findMany();
  res.json(words);
});

router.delete('/filtered-words/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.filteredWord.delete({ where: { id: String(id) } });
  res.json({ message: 'Word deleted' });
});

router.post('/flairs', async (req, res) => {
  const { name, icon } = req.body;
  const flair = await prisma.flair.create({ data: { name, icon } });
  res.json(flair);
});

router.post('/emojis', async (req, res) => {
  const { name, imageUrl } = req.body;
  const emoji = await prisma.customEmoji.create({ data: { name, imageUrl } });
  res.json(emoji);
});

router.post('/shortcuts', async (req, res) => {
  const { shortcutText, fullText } = req.body;
  const shortcut = await prisma.shortcut.create({ data: { shortcutText, fullText } });
  res.json(shortcut);
});

router.post('/users/:id/flair', async (req, res) => {
  const { id } = req.params;
  const { flairId } = req.body;
  const user = await prisma.user.update({
    where: { id: String(id) },
    data: { flairId },
  });
  res.json(user);
});

router.get('/logs', async (req, res) => {
  const logs = await prisma.log.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(logs);
});

export default router;
