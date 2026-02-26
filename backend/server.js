// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import Routes
const sosRoutes = require('./routes/sos');
const reminderRoutes = require('./routes/reminders'); // 👈 NEW: Reminders Route

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use('/api/sos', sosRoutes);
app.use('/api/reminders', reminderRoutes); // 👈 NEW: Connected to /api/reminders

// Health Check Route
app.get('/api/health', (req, res) => {
    res.json({ status: "success", message: "ElderGuard API is running!" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend running on port ${PORT}`);
});