// backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import your Database Model
//const Medication = require('./models/Medication');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// --- API ROUTES ---

// 1. GET: Fetch all medications (For the Caregiver / Dashboard)
app.get('/api/medications', async (req, res) => {
    try {
        const meds = await Medication.find().sort({ createdAt: -1 });
        res.json(meds);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch medications" });
    }
});

// 2. POST: Add a new medication reminder
app.post('/api/medications', async (req, res) => {
    try {
        const { patientName, medicationName, dosage, timeToTake } = req.body;
        
        const newMed = new Medication({
            patientName,
            medicationName,
            dosage,
            timeToTake
        });

        const savedMed = await newMed.save();
        res.status(201).json({ message: "Medication Added Successfully!", data: savedMed });
    } catch (error) {
        res.status(500).json({ message: "Failed to save medication", error: error.message });
    }
});

// Basic Health Route
app.get('/api/health', (req, res) => {
    res.json({ status: "success", message: "MEDICARE+ API is fully operational!" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend running on port ${PORT}`);
});