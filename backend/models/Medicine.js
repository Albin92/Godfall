// backend/models/Medicine.js
const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  time: {
    type: String,   // e.g. "08:00 AM"
    required: true,
  },
  dosage: {
    type: String,   // e.g. "1 tablet", "5mg"
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Medicine', MedicineSchema);
