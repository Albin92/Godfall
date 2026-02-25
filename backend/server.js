// backend/server.js
require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const Medicine = require('./models/Medicine');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// ─── MongoDB Atlas Connection ────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas Connected!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));



// ─── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'ElderGuard API is running!' });
});

// ─── MEDICINE REMINDER ROUTES ─────────────────────────────────

// GET all reminders
app.get('/api/reminders', async (req, res) => {
  try {
    const reminders = await Medicine.find().sort({ createdAt: -1 });
    res.json({ status: 'success', data: reminders });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST — Add a new reminder
// POST — Add a new reminder
app.post('/api/reminders', async (req, res) => {
  console.log('📥 POST /api/reminders hit!');       // ← did request arrive?
  console.log('📦 Body received:', req.body);        // ← what data came in?

  try {
    const { name, time, dosage } = req.body;

    if (!name || !time || !dosage) {
      console.log('⚠️ Missing fields!');
      return res.status(400).json({ status: 'error', message: 'All fields are required.' });
    }

    const newMedicine = new Medicine({ name, time, dosage });
    await newMedicine.save();
    console.log('✅ Saved to MongoDB:', newMedicine);
    res.status(201).json({ status: 'success', data: newMedicine });

  } catch (err) {
    console.error('❌ Save Error:', err.message);    // ← real MongoDB error
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// DELETE — Remove a reminder by ID
app.delete('/api/reminders/:id', async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Reminder deleted.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.use((err, req, res, next) => {
  console.error('🔥 Unhandled Error:', err.message);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend running on port ${PORT}`);
});