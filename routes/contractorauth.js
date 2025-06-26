// routes/contractorauth.js
const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');  // Updated import

// Contractor Signup Route
router.post('/signup_contractor', async (req, res) => {
  const {
    CompanyName,
    Email,
    CompanyAddress,
    ContractorCategory,
    BEDCRegNo,
    NEMSAClass,
    PhoneNumber
  } = req.body;

  // Validate required fields
  if (!CompanyName || !Email || !CompanyAddress || !ContractorCategory || !BEDCRegNo || !NEMSAClass || !PhoneNumber) {
    return res.status(400).json({ status: 'error', msg: 'All fields must be filled' });
  }

  try {
   const pool = await poolPromise;

    // Check for existing contractor
    const existing = await pool.request()
      .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
      .query('SELECT * FROM BEDCRegistered_Contractors WHERE BEDCRegNo = @BEDCRegNo');

    if (existing.recordset.length > 0) {
      return res.status(400).json({ status: 'error', msg: 'Contractor already exists' });
    }

    // Insert new contractor
    await pool.request()
      .input('CompanyName', sql.VarChar, CompanyName)
      .input('Email', sql.VarChar, Email)
      .input('CompanyAddress', sql.VarChar, CompanyAddress)
      .input('ContractorCategory', sql.VarChar, ContractorCategory)
      .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
      .input('NEMSAClass', sql.VarChar, NEMSAClass)
      .input('PhoneNumber', sql.VarChar, PhoneNumber)
      .query(`
        INSERT INTO BEDCRegistered_Contractors 
        (CompanyName, Email, CompanyAddress, ContractorCategory, BEDCRegNo, NEMSAClass, PhoneNumber, EntryDate)
        VALUES 
        (@CompanyName, @Email, @CompanyAddress, @ContractorCategory, @BEDCRegNo, @NEMSAClass, @PhoneNumber, GETDATE())
      `);

    return res.status(200).json({ status: 'ok', msg: 'Contractor registered successfully' });
  } catch (err) {
    console.error('Signup Error:', err);
    return res.status(500).json({ status: 'error', msg: 'Server error', err: err.message });
  }
});

// Contractor Registration Check Route
router.post('/regcheck', async (req, res) => {
  const { BEDCRegNo } = req.body;

  if (!BEDCRegNo) {
    return res.status(400).json({ status: 'error', msg: 'BEDC Registration Number is required' });
  }

  try {
   const pool = await poolPromise;

    // Step 1: Check if contractor exists
    const resultContractors = await pool.request()
      .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
      .query(`
        SELECT CompanyName, CompanyAddress, PhoneNumber, Email, BEDCRegNo
        FROM BEDCRegistered_Contractors
        WHERE BEDCRegNo = @BEDCRegNo
      `);

    const contractor = resultContractors.recordset[0];

    if (!contractor) {
      return res.status(404).json({ status: 'error', msg: 'Contractor not found' });
    }

    const container = {
      contractorName: contractor.CompanyName,
      contractorAddress: contractor.CompanyAddress,
      PhoneNo: contractor.PhoneNumber,
      contractorEmail: contractor.Email,
      BEDCRegNumber: contractor.BEDCRegNo
    };

    // Step 2: Check KYC status
    const resultKYC = await pool.request()
      .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
      .query(`
        SELECT TOP 1 BEDCRegNo, Status
        FROM RegisteredContractors_KYC
        WHERE BEDCRegNo = @BEDCRegNo
      `);

    const recordset = resultKYC.recordset;

    if (recordset.length > 0) {
      const status = recordset[0].Status?.trim().toLowerCase();

      let msg = 'Contractor KYC Status: ' + status;
      let redirectTo = 'test.html';

      if (status === 'approved') {
        msg = 'Contractor Approved';
        redirectTo = 'network-construction.html';
      } else if (status === 'pending') {
        msg = 'Contractor KYC Pending';
      } else if (status === 'declined') {
        msg = 'Contractor KYC Declined';
        redirectTo = 'contractorkyc.html';
      }

      return res.status(200).json({ status: 'ok', msg, container, redirectTo });
    }

    // Contractor found but no KYC record
    return res.status(200).json({
      status: 'ok',
      msg: 'Contractor found only in BEDCRegistered_Contractors',
      container,
      redirectTo: 'contractorkyc.html'
    });

  } catch (err) {
    console.error('RegCheck Error:', err);
    return res.status(500).json({ status: 'error', msg: 'Server error', err: err.message });
  }
});

module.exports = router;
