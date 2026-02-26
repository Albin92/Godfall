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

// ─────────────────────────────────────────────────────────────
// ADD THIS to your server.js (alongside your existing reminders code)
// ─────────────────────────────────────────────────────────────

// ── 1. Vital Schema & Model ───────────────────────────────────
const vitalSchema = new mongoose.Schema({
  type:        { type: String, required: true }, // "Blood Pressure", "Heart Rate", "SpO2", "Blood Sugar"
  systolic:    { type: String },   // Blood Pressure only
  diastolic:   { type: String },   // Blood Pressure only
  heartRate:   { type: String },   // Heart Rate only
  spo2:        { type: String },   // SpO2 only
  sugar:       { type: String },   // Blood Sugar only
  recordedAt:  { type: Date, default: Date.now },
});

const Vital = mongoose.model('Vital', vitalSchema);


// ── 2. POST /api/vitals — Save a vital reading ────────────────
app.post('/api/vitals', async (req, res) => {
  try {
    const vital = new Vital(req.body);
    await vital.save();
    res.json({ status: 'success', data: vital });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});


// ── 3. GET /api/vitals — Get all vitals (optional, for history) ──
app.get('/api/vitals', async (req, res) => {
  try {
    const vitals = await Vital.find().sort({ recordedAt: -1 });
    res.json({ status: 'success', data: vitals });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});


// ── 4. GET /api/vitals/latest — Get latest reading per type ──
app.get('/api/vitals/latest', async (req, res) => {
  try {
    const types = ['Blood Pressure', 'Heart Rate', 'SpO2', 'Blood Sugar'];
    const results = await Promise.all(
      types.map(type => Vital.findOne({ type }).sort({ recordedAt: -1 }))
    );
    const latest = {};
    types.forEach((t, i) => { if (results[i]) latest[t] = results[i]; });
    res.json({ status: 'success', data: latest });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// ADD THIS to your server.js vitals section
// This route deletes ALL records of a specific vital type
// so the database always holds only the latest reading per type
// ─────────────────────────────────────────────────────────────

// DELETE /api/vitals/type/:type  — wipe all records of this type
app.delete('/api/vitals/type/:type', async (req, res) => {
  try {
    const result = await Vital.deleteMany({ type: req.params.type });
    res.json({ status: 'success', deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// MAKE SURE you also have this route (from previous snippet):
// GET /api/vitals/latest  — returns latest record per vital type
// ─────────────────────────────────────────────────────────────
app.get('/api/vitals/latest', async (req, res) => {
  try {
    const types = ['Blood Pressure', 'Heart Rate', 'SpO2', 'Blood Sugar'];
    const results = await Promise.all(
      types.map(type => Vital.findOne({ type }).sort({ recordedAt: -1 }))
    );
    const latest = {};
    types.forEach((t, i) => { if (results[i]) latest[t] = results[i]; });
    res.json({ status: 'success', data: latest });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend running on port ${PORT}`);
});