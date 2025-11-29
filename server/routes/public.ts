import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

router.get('/rooms', async (req, res) => {
  const rooms = await prisma.room.findMany();
  res.json(rooms);
});

router.get('/flairs', async (req, res) => {
  const flairs = await prisma.flair.findMany();
  res.json(flairs);
});

router.get('/emojis', async (req, res) => {
  const emojis = await prisma.customEmoji.findMany();
  res.json(emojis);
});

router.get('/shortcuts', async (req, res) => {
  const shortcuts = await prisma.shortcut.findMany();
  res.json(shortcuts);
});

export default router;
