import { Router } from 'express';
import auth from '../middleware/auth.js';
import Event, { EventStatus } from '../models/Event.js';

const router = Router();

router.use(auth);

router.get('/', async (req, res) => {
  const events = await Event.find({ userId: req.user.id }).sort({ startTime: 1 });
  res.json(events);
});

router.post('/', async (req, res) => {
  const { title, startTime, endTime, status } = req.body;
  const event = await Event.create({ title, startTime, endTime, status: status || EventStatus.BUSY, userId: req.user.id });
  res.status(201).json(event);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const event = await Event.findOneAndUpdate({ _id: id, userId: req.user.id }, updates, { new: true });
  if (!event) return res.status(404).json({ error: 'Not found' });
  res.json(event);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deleted = await Event.findOneAndDelete({ _id: id, userId: req.user.id });
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

export default router;
