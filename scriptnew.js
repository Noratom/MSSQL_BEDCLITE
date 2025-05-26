const express = require('express');
const router = express.Router();
const Contractor = require('../models/Contractor'); // Import Contractor model

// Route: GET /api/contractors - Fetch all contractors from MongoDB
router.get('/api/contractors', async (req, res) => {
    try {
        const contractors = await Contractor.find().sort({ submittedAt: -1 }); // Sort by newest
        res.json(contractors); // Return contractors as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

// Fetch a single contractor by ID
app.get('/api/contractors/:id', async (req, res) => {
    try {
        const contractor = await Contractor.findById(req.params.id);
        res.json(contractor);
    } catch (error) {
        console.error('Error fetching contractor:', error);
        res.status(500).send('Server Error');
    }
});

const nodemailer = require('nodemailer');

router.post('/network/update-status', async (req, res) => {
    const { BEDCRegNo, status } = req.body;

    if (!BEDCRegNo || !status) {
        return res.status(400).send('BEDCRegNo and status are required');
    }

    try {
        const updated = await network.findOneAndUpdate(
            { BEDCRegNo },
            { status }, // You need to make sure 'status' exists in your schema
            { new: true }
        );

        if (!updated) return res.status(404).send('Network not found');

        // Email notification
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

    
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: updated.contractorEmail,
            subject: `Network Application ${status}`,
            html: `<p>Dear ${updated.contractorsName},</p>
                   <p>Your network application with BEDCRegNo <strong>${BEDCRegNo}</strong> has been <strong>${status}</strong>.</p>`
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: `Status updated to ${status}` });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});



// for the frontend part
document.addEventListener('DOMContentLoaded', async () => {
    const contractors = await fetchContractors();
    populateTable(contractors);
});
async function handleStatus(status) {
    const BEDCRegNo = document.getElementById('BEDCRegNo').value;
    if (!BEDCRegNo) return alert('BEDCRegNo not found.');

    try {
        const response = await fetch('http://localhost:4000/dashboard/network/update-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ BEDCRegNo, status })
        });

        const result = await response.json();
        if (response.ok) {
            alert(`Application ${status} and email sent.`);
        } else {
            alert(result.message || 'Error updating status.');
        }
    } catch (error) {
        console.error('Status update error:', error);
        alert('Something went wrong.');
    }
}
