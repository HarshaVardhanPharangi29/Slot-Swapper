import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import swapRoutes from './routes/swaps.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Public root endpoint
app.get('/', (req, res) => {
  res.send('Slot Swapper API is running 🚀');
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/slotswapper';
const PORT = process.env.PORT || 4000;

mongoose.connect(MONGO_URI).then(() => {
  app.listen(PORT, () => {});
}).catch(() => {
  process.exit(1);
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', swapRoutes);
