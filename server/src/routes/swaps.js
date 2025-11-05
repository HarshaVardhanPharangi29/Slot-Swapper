import { Router } from 'express';
import auth from '../middleware/auth.js';
import Event, { EventStatus } from '../models/Event.js';
import SwapRequest, { SwapStatus } from '../models/SwapRequest.js';
import mongoose from 'mongoose';

const router = Router();

router.use(auth);

router.get('/swappable-slots', async (req, res) => {
  const slots = await Event.find({ status: EventStatus.SWAPPABLE, userId: { $ne: req.user.id } }).sort({ startTime: 1 });
  res.json(slots);
});

router.post('/swap-request', async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  if (!mySlotId || !theirSlotId) return res.status(400).json({ error: 'Missing slot ids' });

  const mySlot = await Event.findOne({ _id: mySlotId, userId: req.user.id });
  const theirSlot = await Event.findOne({ _id: theirSlotId, userId: { $ne: req.user.id } });
  if (!mySlot || !theirSlot) return res.status(404).json({ error: 'Slots not found' });
  if (mySlot.status !== EventStatus.SWAPPABLE || theirSlot.status !== EventStatus.SWAPPABLE) return res.status(400).json({ error: 'Slots not swappable' });

  const swapReq = await SwapRequest.create({
    requesterId: req.user.id,
    recipientId: theirSlot.userId,
    mySlot: mySlot._id,
    theirSlot: theirSlot._id,
    status: SwapStatus.PENDING
  });

  await Event.updateMany({ _id: { $in: [mySlot._id, theirSlot._id] } }, { $set: { status: EventStatus.SWAP_PENDING } });

  res.status(201).json(swapReq);
});

router.get('/swap-requests', async (req, res) => {
  const incoming = await SwapRequest.find({ recipientId: req.user.id }).populate('mySlot theirSlot');
  const outgoing = await SwapRequest.find({ requesterId: req.user.id }).populate('mySlot theirSlot');
  res.json({ incoming, outgoing });
});

router.post('/swap-response/:id', async (req, res) => {
  const { id } = req.params;
  const { accept } = req.body;
  const swap = await SwapRequest.findOne({ _id: id, recipientId: req.user.id });
  if (!swap) return res.status(404).json({ error: 'Request not found' });
  if (swap.status !== SwapStatus.PENDING) return res.status(400).json({ error: 'Already processed' });

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const mySlot = await Event.findById(swap.mySlot).session(session);
      const theirSlot = await Event.findById(swap.theirSlot).session(session);
      if (!mySlot || !theirSlot) throw new Error('Slots not found');

      if (!accept) {
        swap.status = SwapStatus.REJECTED;
        await swap.save({ session });
        await Event.updateMany({ _id: { $in: [mySlot._id, theirSlot._id] } }, { $set: { status: EventStatus.SWAPPABLE } }, { session });
        return;
      }

      if (mySlot.status !== EventStatus.SWAP_PENDING || theirSlot.status !== EventStatus.SWAP_PENDING) throw new Error('Invalid slot status');

      const tempUser = mySlot.userId;
      mySlot.userId = theirSlot.userId;
      theirSlot.userId = tempUser;
      mySlot.status = EventStatus.BUSY;
      theirSlot.status = EventStatus.BUSY;
      await mySlot.save({ session });
      await theirSlot.save({ session });

      swap.status = SwapStatus.ACCEPTED;
      await swap.save({ session });
    });
  } catch (e) {
    await session.endSession();
    return res.status(400).json({ error: 'Swap failed' });
  }
  await session.endSession();
  res.json({ ok: true });
});

export default router;
