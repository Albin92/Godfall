const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

// POST: Add a new medicine reminder
router.post('/', async (req, res) => {
    try {
        const { name, time, dosage, frequency } = req.body;

        // Create a new record in MongoDB
        const newReminder = new Reminder({
            name,
            time,
            dosage,
            frequency
        });

        await newReminder.save();

        // Send the success response your frontend is waiting for
        res.status(201).json({
            status: "success",
            message: "Medicine saved successfully!",
            data: newReminder
        });

    } catch (error) {
        console.error("❌ Error saving reminder:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to save medicine",
            error: error.message
        });
    }
});

module.exports = router;