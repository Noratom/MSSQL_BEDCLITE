const express = require('express');
const Contractorauth = require('../models/contractorauth');
const Contractor = require('../models/contractor'); // Assuming you have a model for contractor
const network = require('../models/network'); // Assuming you have a model for network
const Pointload = require('../models/Pointload'); // Mongoose model
const substation = require('../models/substation'); // Assuming you have a model for substation
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const contractor = require('../models/contractor');

const router = express.Router();
dotenv.config();

// countractor fetch route from mongodb
router.post('/get_contractor', async (req, res) => {
    try {
        const contractorauth = await Contractorauth.find().sort({ submittedAt: +1 }); // Sort by Oldest
        res.json(contractorauth); // Return contractors as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

console.log(Contractorauth)


// Route to fetch all contractor kyc
router.post('/get_contractor_kyc', async (req, res) => {
    try{
        const contractor = await Contractor.find({ status: 'pending' }). sort({ submittedAt: +1 }); // Sort by oldest
        res.json(contractor); // Return contractors as JSON
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Route to fetch all approved contractor kyc
router.post('/get_contractor_kycA', async (req, res) => {
    try {
        const contractors = await Contractor.find({ status: 'approved' }).sort({ submittedAt: 1 }); // Sort by oldest
        res.json(contractors); // Return approved contractors as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Route to fetch all declined contractor kyc
router.post('/get_contractor_kycD', async (req, res) => {
    try {
        const contractors = await Contractor.find({ status: 'declined' }).sort({ submittedAt: 1 }); // Sort by oldest
        res.json(contractors); // Return declined contractors as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


// Route to fetch all point load data
router.post('/get_pointload', async (req, res) => {
    try {
        const pointload = await Pointload.find({ status: 'pending' }).sort({ submittedAt: +1 }); // Oldest
        res.json(pointload); // Return contractors as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Route to fetch all approved point load data
router.post('/get_pointloadA', async (req, res) => {
    try {
        const pointload = await Pointload.find({ status: 'approved' }).sort({ submittedAt: +1 }); // Sort by Oldest
        res.json(pointload); // Return contractors as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Route to fetch all declined point load data  
router.post('/get_pointloadD', async (req, res) => {
    try {
        const pointload = await Pointload.find({ status: 'declined' }).sort({ submittedAt: +1 }); // Sort by Oldest
        res.json(pointload); // Return contractors as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


// Route to fetch all network data
router.post('/get_network', async (req, res) => {
    try {
        const networks = await network.find({status: 'pending'}).sort({ submittedAt: +1 }); // Sort by Oldest
        res.json(networks); // Return contractors as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Route to fetch all approved network data
router.post('/get_networkA', async (req, res) => {
    try {
        const networks = await network.find({status: 'approved'}).sort({ submittedAt: +1 }); // Sort by oldest
        res.json(networks); // Return contractors as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Route to fetch all declined network data
router.post('/get_networkD', async (req, res) => {
    try {
        const networks = await network.find({status: 'declined'}).sort({ submittedAt: +1 }); // Sort by oldest
        res.json(networks); // Return contractors as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Route to fetch all substation data
router.post('/get_substation', async (req, res) => {
    try {
        const substationData = await substation.find({status: 'pending'}).sort({ submittedAt: +1 }); // Sort by oldest
        res.json(substationData); // Return contractors as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Route to fetch all approved substation data  
router.post('/get_substationA', async (req, res) => {
    try {
        const substationData = await substation.find({status: 'approved'}).sort({ submittedAt: +1 }); // Sort by oldest
        res.json(substationData); // Return contractors as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Route to fetch all declined substation data
router.post('/get_substationD', async (req, res) => {
    try {
        const substationData = await substation.find({status: 'declined'}).sort({ submittedAt: +1 }); // Sort by oldest
        res.json(substationData); // Return contractors as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Route to fetch one contractor data
router.post('/get_contractor/one', async (req, res) => {
    try {
        const { BEDCRegNo } = req.body;
        if (!BEDCRegNo) {
            return res.status(400).send('BEDC Registration Number is required');
        }

        const contractor = await Contractor.findOne({ BEDCRegNo });
        if (!contractor) {
            return res.status(404).send('Contractor not found');
        }

        res.json(contractor);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});



// Route to get one point load data
router.post('/get_pointload/one', async (req, res) => {
    try {
        const {submittedAt} = req.body; // Extract BEDCRegNo from request body
        if (!submittedAt) {
            return res.status(400).send('BEDC Registration Number is required');
        }
        const pointload = await Pointload.findOne({submittedAt}); // Fetch the point load by ID
        if (!pointload) {
            return res.status(404).send('Point load not found');
        }
        res.json(pointload); // Return the point load as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Route to get one network data
router.post('/get_network/one', async (req, res) => {
    try {
        const {submittedAt} = req.body; // Extract BEDCRegNo from request body
        if (!submittedAt) {
            return res.status(400).send('BEDC Registration Number is required');
        }
        const networks = await network.findOne({submittedAt}); // Fetch the network by ID
        if (!networks) {
            return res.status(404).send('Network not found');
        }
        res.json(networks); // Return the network as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Route to get one substation data
router.post('/get_substation/one', async (req, res) => {
    try {
        const {submittedAt} = req.body; // Extract BEDCRegNo from request body
        if (!submittedAt) {
            return res.status(400).send('BEDC Registration Number is required');
        }
        const Substation = await substation.findOne({submittedAt}); // Fetch the substation by ID
        if (!Substation) {
            return res.status(404).send('Substation not found');
        }
        res.json(Substation); // Return the substation as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}); 

// text to send email notification
router.post('/contractor/update-status', async (req, res) => {
    const { BEDCRegNo, status, reason } = req.body;

    if (!BEDCRegNo || !status) {
        return res.status(400).send('BEDCRegNo and status are required');
    }

    try {
        const updated = await contractor.findOneAndUpdate(
            { BEDCRegNo },
            { status }, // Assumes status is a valid field in your schema
            { new: true }
        );

        if (!updated) return res.status(404).send('Contractor not found');

        // Setup nodemailer
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email content based on status
        let emailBody = `
            <p>Dear ${updated.contractorsName},</p>
            <p>Your contractor application with BEDCRegNo <strong>${BEDCRegNo}</strong> has been <strong>${status}</strong>.</p>
        `;

        if (status === 'declined' && reason) {
            emailBody += `
                <p><strong>Reason for decline:</strong></p>
                <p>${reason}</p>
            `;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: updated.contractorEmail,
            subject: `Contractor Application ${status}`,
            html: emailBody
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Email sending failed');
            }
            res.json({ message: 'Status updated and email sent', info });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


// Route to send email notification to for point load
router.post('/pointload/update-status', async (req, res) => {
    const { BEDCRegNo, status, reason } = req.body;

    if (!BEDCRegNo || !status) {
        return res.status(400).send('BEDCRegNo and status are required');
    }

    try {
        const updated = await Pointload.findOneAndUpdate(
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
            subject: `Point Load Application ${status}`,
            html: `<p>Dear ${updated.contractorsName},</p>
                   <p>Your point load application with BEDCRegNo <strong>${BEDCRegNo}</strong> has been <strong>${status}</strong>.</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Email sending failed');
            }
            res.json({ message: 'Status updated and email sent', info });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Route to send email notification to for network
router.post('/network/update-status', async (req, res) => {
    const { BEDCRegNo, status, reason } = req.body;

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

        // Email content
        let emailBody = `
            <p>Dear ${updated.contractorsName},</p>
            <p>Your network application with BEDCRegNo <strong>${BEDCRegNo}</strong> has been <strong>${status}</strong>.</p>
        `;
        if (status === 'declined') {
            emailBody += `
                <p><strong>Reason for decline:</strong></p>
                <p>${reason}</p>
            `;
        }
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: updated.contractorEmail,
            subject: `Network Application ${status}`,
            html: `<p>Dear ${updated.contractorsName},</p>
                   <p>Your network application with BEDCRegNo <strong>${BEDCRegNo}</strong> has been <strong>${status}</strong>.</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Email sending failed');
            }
            res.json({ message: 'Status updated and email sent', info });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Route to send email notification to for substation
router.post('/substation/update-status', async (req, res) => {
    const { BEDCRegNo, status, reason } = req.body; // ✅ FIXED

    if (!BEDCRegNo || !status) {
        return res.status(400).send('BEDCRegNo and status are required');
    }

    try {
        const updated = await substation.findOneAndUpdate(
            { BEDCRegNo },
            { status },
            { new: true }
        );

        if (!updated) return res.status(404).send('Substation not found'); // ✅ improved message

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let emailBody = `
            <p>Dear ${updated.contractorsName},</p>
            <p>Your Substation application with BEDCRegNo <strong>${BEDCRegNo}</strong> has been <strong>${status}</strong>.</p>
        `;

        if (status === 'declined' && reason) {
            emailBody += `
                <p><strong>Reason for decline:</strong></p>
                <p>${reason}</p>
            `;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: updated.contractorEmail,
            subject: `Substation Application ${status}`,
            html: emailBody
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Email sending failed');
            }
            res.json({ message: 'Status updated and email sent', info });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


// Route to fetch dashboard counts
router.post('/dashboard-counts', async (req, res) => {
    try {
        const [
            contractorPendingCount, contractorApprovedCount, contractorDeclinedCount,
            pointloadPendingCount, pointloadApprovedCount, pointloadDeclinedCount,
            substationPendingCount, substationApprovedCount, substationDeclinedCount,
            networkPendingCount, networkApprovedCount, networkDeclinedCount
        ] = await Promise.all([
            Contractor.countDocuments({ status: 'pending' }),
            Contractor.countDocuments({ status: 'approved' }),
            Contractor.countDocuments({ status: 'declined' }),

            Pointload.countDocuments({ status: 'pending' }),
            Pointload.countDocuments({ status: 'approved' }),
            Pointload.countDocuments({ status: 'declined' }),

            substation.countDocuments({ status: 'pending' }),
            substation.countDocuments({ status: 'approved' }),
            substation.countDocuments({ status: 'declined' }),

            network.countDocuments({ status: 'pending' }),
            network.countDocuments({ status: 'approved' }),
            network.countDocuments({ status: 'declined' })
        ]);

        res.json({
            contractorPendingCount,
            contractorApprovedCount,
            contractorDeclinedCount,

            pointloadPendingCount,
            pointloadApprovedCount,
            pointloadDeclinedCount,

            substationPendingCount,
            substationApprovedCount,
            substationDeclinedCount,

            networkPendingCount,
            networkApprovedCount,
            networkDeclinedCount
        });
    } catch (err) {
        console.error('Error fetching dashboard counts:', err);
        res.status(500).json({ error: 'Failed to fetch dashboard counts' });
    }
});

// Route to search contractors by BEDCRegNo, contractorsName, or submittedAt
router.post('/contractors_search', async (req, res) => {
    const { searchTerm } = req.body;

    try {
        const regex = new RegExp(searchTerm, 'i'); // For Reg No and Name
        const filters = [
            { BEDCRegNo: regex },
            { contractorsName: regex }
        ];

        // Try to parse the date, and if valid, add to filters
        const parsedDate = new Date(searchTerm);
        if (!isNaN(parsedDate)) {
            const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));
            filters.push({ submittedAt: { $gte: startOfDay, $lte: endOfDay } });
        }

        // Fetch contractors by each status
        const [pending, approved, declined] = await Promise.all([
            Contractor.find({ status: 'pending', $or: filters }).sort({ submittedAt: -1 }),
            Contractor.find({ status: 'approved', $or: filters }).sort({ submittedAt: -1 }),
            Contractor.find({ status: 'declined', $or: filters }).sort({ submittedAt: -1 }),
        ]);

        // Send grouped data
        res.status(200).json({
            pending,
            approved,
            declined
        });
    } catch (error) {
        console.error('Error during contractor search:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

// Route to search point load by BEDCRegNo, contractorsName, or submittedAt
router.post('/pointload_search', async (req, res) => {
    const { searchTerm } = req.body;

    try {
        const regex = new RegExp(searchTerm, 'i'); // For Reg No and Name
        const filters = [
            { BEDCRegNo: regex },
            { contractorsName: regex }
        ];

        // Try to parse the date, and if valid, add to filters
        const parsedDate = new Date(searchTerm);
        if (!isNaN(parsedDate)) {
            const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));
            filters.push({ submittedAt: { $gte: startOfDay, $lte: endOfDay } });
        }

        // Fetch point load by each status
        const [pending, approved, declined] = await Promise.all([
            Pointload.find({ status: 'pending', $or: filters }).sort({ submittedAt: -1 }),
            Pointload.find({ status: 'approved', $or: filters }).sort({ submittedAt: -1 }),
            Pointload.find({ status: 'declined', $or: filters }).sort({ submittedAt: -1 }),
        ]);

        // Send grouped data
        res.status(200).json({
            pending,
            approved,
            declined
        });
    } catch (error) {
        console.error('Error during point load search:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

// Route to search network by BEDCRegNo, contractorsName, or submittedAt
router.post('/network_search', async (req, res) => {
    const { searchTerm } = req.body;

    try {
        const regex = new RegExp(searchTerm, 'i'); // For Reg No and Name
        const filters = [
            { BEDCRegNo: regex },
            { contractorsName: regex }
        ];

        // Try to parse the date, and if valid, add to filters
        const parsedDate = new Date(searchTerm);
        if (!isNaN(parsedDate)) {
            const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));
            filters.push({ submittedAt: { $gte: startOfDay, $lte: endOfDay } });
        }

        // Fetch network by each status
        const [pending, approved, declined] = await Promise.all([
            network.find({ status: 'pending', $or: filters }).sort({ submittedAt: -1 }),
            network.find({ status: 'approved', $or: filters }).sort({ submittedAt: -1 }),
            network.find({ status: 'declined', $or: filters }).sort({ submittedAt: -1 }),
        ]);

        // Send grouped data
        res.status(200).json({
            pending,
            approved,
            declined
        });
    } catch (error) {
        console.error('Error during network search:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

// Route to search substation by BEDCRegNo, contractorsName, or submittedAt
router.post('/substation_search', async (req, res) => {
    const { searchTerm } = req.body;

    try {
        const regex = new RegExp(searchTerm, 'i'); // For Reg No and Name
        const filters = [
            { BEDCRegNo: regex },
            { contractorsName: regex }
        ];

        // Try to parse the date, and if valid, add to filters
        const parsedDate = new Date(searchTerm);
        if (!isNaN(parsedDate)) {
            const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));
            filters.push({ submittedAt: { $gte: startOfDay, $lte: endOfDay } });
        }

        // Fetch substation by each status
        const [pending, approved, declined] = await Promise.all([
            substation.find({ status: 'pending', $or: filters }).sort({ submittedAt: -1 }),
            substation.find({ status: 'approved', $or: filters }).sort({ submittedAt: -1 }),
            substation.find({ status: 'declined', $or: filters }).sort({ submittedAt: -1 }),
        ]);

        // Send grouped data
        res.status(200).json({
            pending,
            approved,
            declined
        });
    } catch (error) {
        console.error('Error during substation search:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

module.exports = router;