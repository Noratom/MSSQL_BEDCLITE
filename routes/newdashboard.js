const express = require('express');
const { sql, poolPromise } = require('../db');
const path = require('path');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

const router = express.Router();
dotenv.config();

// Route to get all contractors KYC pending
router.post('/get_contractor_kyc', async (req, res) => {
    try {
        const pool = await poolPromise; // Use your configured poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM RegisteredContractors_KYC WHERE status = 'pending' ORDER BY EntryDate ASC`);

        res.json(result.recordset);
    } catch (error) {
        console.error('SQL Error:', error);
        res.status(500).send('Server Error');
    }
});

// Route to get all contractors KYC approved
router.post('/get_contractor_kycA', async (req, res) => {
    try {
        const pool = await poolPromise; // Use your configured poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM RegisteredContractors_KYC WHERE status = 'approved' ORDER BY EntryDate ASC`);

        res.json(result.recordset);
    } catch (error) {
        console.error('SQL Error:', error);
        res.status(500).send('Server Error');
    }
});

// Route to get all contractors KYC rejected
router.post('/get_contractor_kycD', async (req, res) => {
    try {
        const pool = await poolPromise; // Use your configured poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM RegisteredContractors_KYC WHERE status = 'declined' ORDER BY EntryDate ASC`);

        res.json(result.recordset);
    } catch (error) {
        console.error('SQL Error:', error);
        res.status(500).send('Server Error');
    }
});

// Route to get all Pointload pending
router.post('/get_pointload', async (req, res) => {
    try {
        const pool = await poolPromise; // Use your configured poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM PointLoad_Applications WHERE status = 'pending' ORDER BY CreatedAt ASC`);

        res.json(result.recordset);
    } catch (error) {
        console.error('SQL Error:', error);
        res.status(500).send('Server Error');
    }
});

// Route to get all Pointload approved
router.post('/get_pointloadA', async (req, res) => {
    try {
        const pool = await poolPromise; // Use your configured poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM PointLoad_Applications WHERE status = 'approved' ORDER BY CreatedAt ASC`);

        res.json(result.recordset);
    } catch (error) {
        console.error('SQL Error:', error);
        res.status(500).send('Server Error');
    }
});

// Route to get all Pointload rejected
router.post('/get_pointloadD', async (req, res) => {
    try {
        const pool = await poolPromise; // Use your configured poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM PointLoad_Applications WHERE status = 'declined' ORDER BY CreatedAt ASC`);

        res.json(result.recordset);
    } catch (error) {
        console.error('SQL Error:', error);
        res.status(500).send('Server Error');
    }
});

// Route to get all substation pending
router.post('/get_substation', async (req, res) => {
    try {
        const pool = await poolPromise; // Use your configured poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM Substation_Applications WHERE status = 'pending' ORDER BY CreatedAt ASC`);

        res.json(result.recordset);
    } catch (error) {
        console.error('SQL Error:', error);
        res.status(500).send('Server Error');
    }
});

// Route to get all substation approved
router.post('/get_substationA', async (req, res) => {
    try {
        const pool = await poolPromise; // Use your configured poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM Substation_Applications WHERE status = 'approved' ORDER BY CreatedAt ASC`);

        res.json(result.recordset);
    } catch (error) {
        console.error('SQL Error:', error);
        res.status(500).send('Server Error');
    }
});

// Route to get all substation rejected 
router.post('/get_substationD', async (req, res) => {
    try {
        const pool = await poolPromise; // Use your configured poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM Substation_Applications WHERE status = 'declined' ORDER BY CreatedAt ASC`);

        res.json(result.recordset);
    } catch (error) {
        console.error('SQL Error:', error);
        res.status(500).send('Server Error');
    }
});

//Route  to get all Line Work pending
router.post('/get_linework', async (req, res) => {
    try {
        const pool = await poolPromise; // Use your configured poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM LineWorks_Applications WHERE status = 'pending' ORDER BY CreatedAt ASC`);

        res.json(result.recordset);
    } catch (error) {
        console.error('SQL Error:', error);
        res.status(500).send('Server Error');
    }
});

// Route to get all Line Work approved
router.post('/get_lineworkA', async (req, res) => {
    try {
        const pool = await poolPromise; // Use your configured poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM LineWorks_Applications WHERE status = 'approved' ORDER BY CreatedAt ASC`);

        res.json(result.recordset);
    } catch (error) {
        console.error('SQL Error:', error);
        res.status(500).send('Server Error');
    }
});

// Route to get all Line Work rejected
router.post('/get_lineworkD', async (req, res) => {
    try {
        const pool = await poolPromise; // Use your configured poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM LineWorks_Applications WHERE status = 'declined' ORDER BY CreatedAt ASC`);

        res.json(result.recordset);
    } catch (error) {
        console.error('SQL Error:', error);
        res.status(500).send('Server Error');
    }
});

// Route to fetch one contractor by BEDCRegNo
router.post('/get_contractor/one', async (req, res) => {
  const { BEDCRegNo } = req.body;

  if (!BEDCRegNo) return res.status(400).send('BEDC Registration Number is required');

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
      .query(`SELECT TOP 1 * FROM RegisteredContractors_KYC WHERE BEDCRegNo = @BEDCRegNo`);

    if (result.recordset.length === 0) return res.status(404).send('Contractor not found');

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('SQL Error:', error);
    res.status(500).send('Server Error');
  }
});

// Route to fetch one pointload by CreatedAt
router.post('/get_pointload/one', async (req, res) => {
  const { CreatedAt } = req.body;

  if (!CreatedAt) return res.status(400).send('CreatedAt is required');

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('CreatedAt', sql.DateTime, CreatedAt)
      .query(`SELECT TOP 1 * FROM PointLoad_Applications WHERE CreatedAt = @CreatedAt`);

    if (result.recordset.length === 0) return res.status(404).send('Pointload not found');

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('SQL Error:', error);
    res.status(500).send('Server Error');
  }
});

// Route to fetch one substation by CreatedAt
router.post('/get_substation/one', async (req, res) => {
  const { CreatedAt } = req.body;

  if (!CreatedAt) return res.status(400).send('CreatedAt is required');

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('CreatedAt', sql.DateTime, CreatedAt)
      .query(`SELECT TOP 1 * FROM Substation_Applications WHERE CreatedAt = @CreatedAt`);

    if (result.recordset.length === 0) return res.status(404).send('Substation not found');

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('SQL Error:', error);
    res.status(500).send('Server Error');
  }
});

// Route to fetch one linework by CreatedAt 
router.post('/get_linework/one', async (req, res) => {
  const { CreatedAt } = req.body;

  if (!CreatedAt) return res.status(400).send('CreatedAt is required');

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('CreatedAt', sql.DateTime, CreatedAt)
      .query(`SELECT TOP 1 * FROM LineWorks_Applications WHERE CreatedAt = @CreatedAt`);

    if (result.recordset.length === 0) return res.status(404).send('Linework not found');

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('SQL Error:', error);
    res.status(500).send('Server Error');
  }
});

// Route to update contractor status and send email
router.post('/contractor/update-status', async (req, res) => {
  const { BEDCRegNo, status, reason } = req.body;

  if (!BEDCRegNo || !status) {
    return res.status(400).json({ error: 'BEDCRegNo and status are required' });
  }

  try {
    const pool = await poolPromise;
    // Setup nodemailer transporter
  const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.EMAIL_USER, // e.g., noreply@yourdomain.onmicrosoft.com
    pass: process.env.EMAIL_PASS
  },
  tls: {
    ciphers: 'SSLv3'
  }
});
    // Fetch contractor details
    const contractorResult = await pool.request()
      .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
      .query('SELECT ContractorName, Email FROM dbo.RegisteredContractors_KYC WHERE BEDCRegNo = @BEDCRegNo');

    if (contractorResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Contractor not found' });
    }

    const contractor = contractorResult.recordset[0];

    // Update status and optionally store decline reason (assuming you have a field for it or extend table)
    let updateQuery = 'UPDATE dbo.RegisteredContractors_KYC SET status = @status';
    if (status === 'declined') {
      updateQuery += ', DeclineReason = @reason';
    }
    updateQuery += ' WHERE BEDCRegNo = @BEDCRegNo';

    await pool.request()
      .input('status', sql.VarChar, status)
      .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
      .input('reason', sql.VarChar, reason || '')
      .query(updateQuery);

    // Prepare email content
    let subject = `Your Contractor Registration has been ${status}`;
    let text = `Dear ${contractor.ContractorName},\n\nYour contractor registration  with BEDCRegNo ${BEDCRegNo} has been ${status}`;

    if (status === 'declined' && reason) {
      text += `\nReason for decline: ${reason}\n\nPlease contact support for more details.`;
    }

    text += `\n\nBest regards,\nBEDC Team`;

    // Send email
    await transporter.sendMail({
    from: '"BEDC Support" <noreply@yourdomain.onmicrosoft.com>',
      to: contractor.Email,
      subject,
      text,
    });

    res.json({ message: `Status updated to ${status} and email sent.` });

  } catch (error) {
    console.error('Error in update-status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update pointload status and send email
router.post('/pointload/update-status', async (req, res) => {
  const { BEDCRegNo, status, reason } = req.body;

  if (!BEDCRegNo || !status) {
    return res.status(400).json({ error: 'BEDCRegNo and status are required' });
  }

  try {
    const pool = await poolPromise;
    // Setup nodemailer transporter
   const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.EMAIL_USER, // e.g., noreply@yourdomain.onmicrosoft.com
    pass: process.env.EMAIL_PASS
  },
  tls: {
    ciphers: 'SSLv3'
  }
});
 
    // Fetch pointload details
    const pointloadResult = await pool.request()
      .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
      .query('SELECT ContractorName, ContractorEmail FROM dbo.PointLoad_Applications WHERE BEDCRegNo = @BEDCRegNo');

    if (pointloadResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Pointload not found' });
    }

    const pointload = pointloadResult.recordset[0];

    // Update status and optionally store decline reason (assuming you have a field for it or extend table)
    let updateQuery = 'UPDATE dbo.PointLoad_Applications SET status = @status';
    if (status === 'declined') {
      updateQuery += ', DeclineReason = @reason';
    }
    updateQuery += ' WHERE BEDCRegNo = @BEDCRegNo';

    await pool.request()
      .input('status', sql.VarChar, status)
      .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
      .input('reason', sql.VarChar, reason || '')
      .query(updateQuery);

    // Prepare email content
    let subject = `Your Point Load Application has been ${status}`;
    let text = `Dear ${pointload.ContractorName},\n\nYour point load application with BEDCRegNo ${BEDCRegNo} has been ${status}`;

    if (status === 'declined' && reason) {
      text += `\nReason for decline: ${reason}\n\nPlease contact support for more details.`;
    }

    text += `\n\nBest regards,\nBEDC Team`;

    // Send email
    await transporter.sendMail({
      from: '"BEDC Support" <noreply@yourdomain.onmicrosoft.com>',
      to: pointload.ContractorEmail,
      subject,
      text,
    });

    res.json({ message: `Status updated to ${status} and email sent.` });
  } catch (error) {
    console.error('Error in update-status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update substation status and send email
router.post('/substation/update-status', async (req, res) => {
  const { BEDCRegNo, status, reason } = req.body;

  if (!BEDCRegNo || !status) {
    return res.status(400).json({ error: 'BEDCRegNo and status are required' });
  }

  try {
    const pool = await poolPromise;
    // Setup nodemailer transporter
   const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.EMAIL_USER, // e.g., noreply@yourdomain.onmicrosoft.com
    pass: process.env.EMAIL_PASS
  },
  tls: {
    ciphers: 'SSLv3'
  }
});
 
    // Fetch substation details
    const substationResult = await pool.request()
      .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
      .query('SELECT ContractorName, ContractorEmail FROM dbo.Substation_Applications WHERE BEDCRegNo = @BEDCRegNo');

    if (substationResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Substation not found' });
    }

    const substation = substationResult.recordset[0];

    // Update status and optionally store decline reason (assuming you have a field for it or extend table)
    let updateQuery = 'UPDATE dbo.Substation_Applications SET status = @status';
    if (status === 'declined') {
      updateQuery += ', DeclineReason = @reason';
    }
    updateQuery += ' WHERE BEDCRegNo = @BEDCRegNo';

    await pool.request()
      .input('status', sql.VarChar, status)
      .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
      .input('reason', sql.VarChar, reason || '')
      .query(updateQuery);

    // Prepare email content
    let subject = `Your Substation Application has been ${status}`;
    let text = `Dear ${substation.ContractorName},\n\nYour substation application with BEDCRegNo ${BEDCRegNo} has been ${status}`;

    if (status === 'declined' && reason) {
      text += `\nReason for decline: ${reason}\n\nPlease contact support for more details.`;
    }

    text += `\n\nBest regards,\nBEDC Team`;

    // Send email
    await transporter.sendMail({
      from: '"BEDC Support" <noreply@yourdomain.onmicrosoft.com>',
      to: substation.ContractorEmail,
      subject,  
      text,
    });
    res.json({ message: `Status updated to ${status} and email sent.` });
  } catch (error) {
    console.error('Error in update-status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update linework status and send email
router.post('/linework/update-status', async (req, res) => {
  const { BEDCRegNo, status, reason } = req.body;

  if (!BEDCRegNo || !status) {
    return res.status(400).json({ error: 'BEDCRegNo and status are required' });
  }

  try {
    const pool = await poolPromise;
    // Setup nodemailer transporter
   const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.EMAIL_USER, // e.g., noreply@yourdomain.onmicrosoft.com
    pass: process.env.EMAIL_PASS
  },
  tls: {
    ciphers: 'SSLv3'
  }
});
 
    // Fetch linework details
    const lineworkResult = await pool.request()
      .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
      .query('SELECT ContractorName, ContractorEmail FROM dbo.LineWorks_Applications WHERE BEDCRegNo = @BEDCRegNo');

    if (lineworkResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Linework not found' });
    }

    const linework = lineworkResult.recordset[0];

    // Update status and optionally store decline reason (assuming you have a field for it or extend table)
    let updateQuery = 'UPDATE dbo.LineWorks_Applications SET status = @status';
    if (status === 'declined') {
      updateQuery += ', DeclineReason = @reason';
    }
    updateQuery += ' WHERE BEDCRegNo = @BEDCRegNo';

    await pool.request()
      .input('status', sql.VarChar, status)
      .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
      .input('reason', sql.VarChar, reason || '')
      .query(updateQuery);

    // Prepare email content
    let subject = `Your Line Work Application has been ${status}`;
    let text = `Dear ${linework.ContractorName},\n\nYour line work application with BEDCRegNo ${BEDCRegNo} has been ${status}`;

    if (status === 'declined' && reason) {
      text += `\nReason for decline: ${reason}\n\nPlease contact support for more details.`;
    }

    text += `\n\nBest regards,\nBEDC Team`;

    // Send email
    await transporter.sendMail({
      from: '"BEDC Support" <noreply@yourdomain.onmicrosoft.com>',
      to: linework.ContractorEmail,
      subject,
      text,
    });
    res.json({ message: `Status updated to ${status} and email sent.` });
  } catch (error) {
    console.error('Error in update-status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to fetch dashboard counts
router.post('/dashboard-counts', async (req, res) => {
  try {
    const pool = await poolPromise;

    // Use COUNT with GROUP BY and conditional aggregation to get counts in one query per table:
    const contractorQuery = `
      SELECT
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingCount,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approvedCount,
        SUM(CASE WHEN status = 'declined' THEN 1 ELSE 0 END) AS declinedCount
      FROM RegisteredContractors_KYC
    `;

    const pointloadQuery = `
      SELECT
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingCount,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approvedCount,
        SUM(CASE WHEN status = 'declined' THEN 1 ELSE 0 END) AS declinedCount
      FROM PointLoad_Applications
    `;

    const substationQuery = `
      SELECT
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingCount,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approvedCount,
        SUM(CASE WHEN status = 'declined' THEN 1 ELSE 0 END) AS declinedCount
      FROM Substation_Applications
    `;

    const networkQuery = `
      SELECT
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingCount,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approvedCount,
        SUM(CASE WHEN status = 'declined' THEN 1 ELSE 0 END) AS declinedCount
      FROM LineWorks_Applications
    `;

    // Run queries in parallel for better performance:
    const [
      contractorResult,
      pointloadResult,
      substationResult,
      networkResult
    ] = await Promise.all([
      pool.request().query(contractorQuery),
      pool.request().query(pointloadQuery),
      pool.request().query(substationQuery),
      pool.request().query(networkQuery)
    ]);

    res.json({
      contractorPendingCount: contractorResult.recordset[0].pendingCount || 0,
      contractorApprovedCount: contractorResult.recordset[0].approvedCount || 0,
      contractorDeclinedCount: contractorResult.recordset[0].declinedCount || 0,

      pointloadPendingCount: pointloadResult.recordset[0].pendingCount || 0,
      pointloadApprovedCount: pointloadResult.recordset[0].approvedCount || 0,
      pointloadDeclinedCount: pointloadResult.recordset[0].declinedCount || 0,

      substationPendingCount: substationResult.recordset[0].pendingCount || 0,
      substationApprovedCount: substationResult.recordset[0].approvedCount || 0,
      substationDeclinedCount: substationResult.recordset[0].declinedCount || 0,

      networkPendingCount: networkResult.recordset[0].pendingCount || 0,
      networkApprovedCount: networkResult.recordset[0].approvedCount || 0,
      networkDeclinedCount: networkResult.recordset[0].declinedCount || 0,
    });

  } catch (error) {
    console.error('Error fetching dashboard counts:', error);
    res.status(500).send('Server Error');
  }
});

// Route to search contractors by name, BEDCRegNo, or submittedAt date
router.post('/contractors_search', async (req, res) => {
    const { searchTerm } = req.body;

    if (!searchTerm) {
        return res.status(400).json({ message: 'Missing search term' });
    }

    try {
      const pool = await poolPromise;

        const request = pool.request();
        request.input('searchTerm', sql.VarChar, searchTerm);

        const query = `
            SELECT *
            FROM RegisteredContractors_KYC
            WHERE ContractorName LIKE '%' + @searchTerm + '%'
               OR BEDCRegNo LIKE '%' + @searchTerm + '%'
               OR CONVERT(VARCHAR, EntryDate, 120) LIKE '%' + @searchTerm + '%'
        `;

        const result = await request.query(query);
        const contractors = result.recordset;

        const grouped = {
            pending: contractors.filter(c => c.status === 'pending'),
            approved: contractors.filter(c => c.status === 'approved'),
            declined: contractors.filter(c => c.status === 'declined'),
        };

        res.json(grouped);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ message: 'Server error during search' });
    }
});

// Route to search pointloads by name, BEDCRegNo, or submittedAt date
router.post('/pointloads_search', async (req, res) => {
    const { searchTerm } = req.body;

    if (!searchTerm) {
        return res.status(400).json({ message: 'Missing search term' });
    }

    try {
      const pool = await poolPromise;

        const request = pool.request();
        request.input('searchTerm', sql.VarChar, searchTerm);

        const query = `
            SELECT *
            FROM PointLoad_Applications
            WHERE ContractorName LIKE '%' + @searchTerm + '%'
               OR BEDCRegNo LIKE '%' + @searchTerm + '%'
               OR CONVERT(VARCHAR, CreatedAt, 120) LIKE '%' + @searchTerm + '%'
        `;

        const result = await request.query(query);
        const pointloads = result.recordset;

        const grouped = {
            pending: pointloads.filter(c => c.status === 'pending'),
            approved: pointloads.filter(c => c.status === 'approved'),
            declined: pointloads.filter(c => c.status === 'declined'),
        };

        res.json(grouped);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ message: 'Server error during search' });
    }
});

// Route to search substations by name, BEDCRegNo, or submittedAt date
router.post('/substations_search', async (req, res) => {
    const { searchTerm } = req.body;

    if (!searchTerm) {
        return res.status(400).json({ message: 'Missing search term' });
    }

    try {
      const pool = await poolPromise;

        const request = pool.request();
        request.input('searchTerm', sql.VarChar, searchTerm);

        const query = `
            SELECT *
            FROM Substation_Applications
            WHERE ContractorName LIKE '%' + @searchTerm + '%'
               OR BEDCRegNo LIKE '%' + @searchTerm + '%'
               OR CONVERT(VARCHAR, CreatedAt, 120) LIKE '%' + @searchTerm + '%'
        `;

        const result = await request.query(query);
        const substations = result.recordset;

        const grouped = {
            pending: substations.filter(c => c.status === 'pending'),
            approved: substations.filter(c => c.status === 'approved'),
            declined: substations.filter(c => c.status === 'declined'),
        };

        res.json(grouped);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ message: 'Server error during search' });
    }
});

// Route to search lineworks by name, BEDCRegNo, or submittedAt date
router.post('/lineworks_search', async (req, res) => {
    const { searchTerm } = req.body;

    if (!searchTerm) {
        return res.status(400).json({ message: 'Missing search term' });
    }

    try {
      const pool = await poolPromise;

        const request = pool.request();
        request.input('searchTerm', sql.VarChar, searchTerm);

        const query = `
            SELECT *
            FROM LineWorks_Applications
            WHERE ContractorName LIKE '%' + @searchTerm + '%'
               OR BEDCRegNo LIKE '%' + @searchTerm + '%'
               OR CONVERT(VARCHAR, CreatedAt, 120) LIKE '%' + @searchTerm + '%'
        `;

        const result = await request.query(query);
        const lineworks = result.recordset;

        const grouped = {
            pending: lineworks.filter(c => c.status === 'pending'),
            approved: lineworks.filter(c => c.status === 'approved'),
            declined: lineworks.filter(c => c.status === 'declined'),
        };

        res.json(grouped);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ message: 'Server error during search' });
    }
});


// Route to download files contractors
router.post('/downloadcontractors', async (req, res) => {
  const { type, BEDCRegNo } = req.body;

  const columnMap = {
    BEDCCerticate: 'BEDCCerticate',
    ValidNEMSALicense: 'ValidNEMSALicense',
    VendorConsent: 'VendorConsent'
  };

  if (!type || !BEDCRegNo) {
    return res.status(400).send('Missing required parameters');
  }

  const columnName = columnMap[type];
  if (!columnName) {
    return res.status(400).send('Invalid document type');
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
      .query(`SELECT ${columnName} FROM RegisteredContractors_KYC WHERE BEDCRegNo = @BEDCRegNo`);

    const fileData = result.recordset[0]?.[columnName];

    if (!fileData) {
      return res.status(404).send('File not found');
    }

    // Assuming images are stored as PNG, adjust if JPG or other
    res.setHeader('Content-Type', 'image/png');

    res.send(fileData);

  } catch (err) {
    console.error('Download error:', err);
    res.status(500).send('Server error');
  }
});

// Route to download files pointloads
router.post('/downloadpointloads', async (req, res) => {
  const { type, CreatedAt } = req.body;

 const columnMap = {
  adminFeePaymentEvidence: 'adminFeePaymentEvidence',
  projectLoadEstimate: 'projectLoadEstimate',
  clientLetterOfIntroduction: 'ClientLetterOfIntroduction'
};


  if (!type || !CreatedAt) {
    return res.status(400).send('Missing required parameters');
  }

  const columnName = columnMap[type];
  if (!columnName) {
    return res.status(400).send('Invalid document type');
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('CreatedAt', sql.DateTime, CreatedAt)
      .query(`SELECT ${columnName} FROM PointLoad_Applications WHERE CreatedAt = @CreatedAt`);
      
    const fileData = result.recordset[0]?.[columnName];

    if (!fileData) {
      return res.status(404).send('File not found');
    }

    // Assuming images are stored as PNG, adjust if JPG or other
    res.setHeader('Content-Type', 'image/png');

    res.send(fileData);

  } catch (err) {
    console.error('Download error:', err);
    res.status(500).send('Server error');
  }
});

// Route to download files substations
router.post('/downloadsubstations', async (req, res) => {
  const { type, CreatedAt } = req.body;

const columnMap = {
  AdminFeePaymentEvidence: 'adminFeePaymentEvidence',
  LetterOfDonation: 'letterOfDonation',
};

  if (!type || !CreatedAt) {
    return res.status(400).send('Missing required parameters');
  }

  const columnName = columnMap[type];
  if (!columnName) {
    return res.status(400).send('Invalid document type');
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('CreatedAt', sql.DateTime, CreatedAt)
      .query(`SELECT ${columnName} FROM Substation_Applications WHERE CreatedAt = @CreatedAt`);
      
    const fileData = result.recordset[0]?.[columnName];

    if (!fileData) {
      return res.status(404).send('File not found');
    }

    // Assuming images are stored as PNG, adjust if JPG or other
    res.setHeader('Content-Type', 'image/png');

    res.send(fileData);

  } catch (err) {
    console.error('Download error:', err);
    res.status(500).send('Server error');
  }
});


module.exports = router;


