const express = require('express');
const router = express.Router();
const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// POST: Trigger SOS
router.post('/trigger', async (req, res) => {
    const { userId, userName, location, contactNumber } = req.body;

    // 1. Prepare the Emergency Message
    const googleMapsLink = `https://www.google.com/maps?q=$${location.latitude},${location.longitude}`;
    const alertMessage = `EMERGENCY: ${userName} needs help! Location: ${googleMapsLink}`;

    try {
        // 2. Send SMS Alert
        const smsResponse = await client.messages.create({
            body: alertMessage,
            from: process.env.TWILIO_PHONE,
            to: contactNumber // MUST be verified in Twilio Trial Console
        });

        // 3. Trigger Automated Voice Call
        const callResponse = await client.calls.create({
            twiml: `<Response><Say>Emergency! This is an automated SOS alert for ${userName}. Please check your messages for their location.</Say></Response>`,
            from: process.env.TWILIO_PHONE,
            to: contactNumber
        });

        res.status(200).json({
            success: true,
            message: "SOS Alerts sent successfully!",
            smsSid: smsResponse.sid,
            callSid: callResponse.sid
        });

    } catch (error) {
        console.error("Twilio Error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to send SOS alerts.",
            details: error.message
        });
    }
});

module.exports = router;