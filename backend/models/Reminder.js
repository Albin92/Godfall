const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    time: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    userId: { type: String, default: "user_123" }, // Defaulted for your hackathon demo
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reminder', reminderSchema);