// routes/contractor.js
const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');  // Make sure to import sql from db.js

// Contractor Signup Route
router.post('/signup_contractor', async (req, res) => {
    const { CompanyName, Email, CompanyAddress, ContractorCategory, BEDCRegNo, NEMSAClass, PhoneNumber } = req.body;

    if (!CompanyName || !Email || !CompanyAddress || !ContractorCategory || !BEDCRegNo || !NEMSAClass || !PhoneNumber) {
        return res.status(400).send({ status: 'error', msg: 'All fields must be filled' });
    }

    try {
        const pool = await poolPromise;

        // Check if contractor already exists
        const existing = await pool.request()
            .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
            .query('SELECT * FROM BEDCRegistered_Contractors WHERE BEDCRegNo = @BEDCRegNo');

        if (existing.recordset.length > 0) {
            return res.status(400).send({ status: 'error', msg: 'Contractor already exists' });
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

        res.status(200).send({ status: 'ok', msg: 'Contractor registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: 'error', msg: 'Server error', err });
    }
});

// Contractor Registration Check Route
// Contractor Registration Check Route
router.post('/regcheck', async (req, res) => {
    const { BEDCRegNo } = req.body;

    if (!BEDCRegNo) {
        return res.status(400).send({ status: 'error', msg: 'BEDC Registration Number is required' });
    }

    try {
        const pool = await poolPromise;

        // Check if in BEDCRegistered_Contractors
        const resultContractors = await pool.request()
            .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
            .query(`
                SELECT CompanyName, CompanyAddress, PhoneNumber, Email, BEDCRegNo
                FROM BEDCRegistered_Contractors
                WHERE BEDCRegNo = @BEDCRegNo
            `);

        const contractor = resultContractors.recordset[0];

        if (!contractor) {
            return res.status(404).send({ status: 'error', msg: 'Contractor not found in BEDCRegistered_Contractors' });
        }

        // Check if in RegisteredContractors_KYC with status
        const resultKYC = await pool.request()
            .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
            .query(`
                SELECT TOP 1 BEDCRegNo, Status
                FROM RegisteredContractors_KYC
                WHERE BEDCRegNo = @BEDCRegNo
            `);

        const kycRecord = resultKYC.recordset[0];

        const container = {
            contractorName: contractor.CompanyName,
            contractorAddress: contractor.CompanyAddress,
            PhoneNo: contractor.PhoneNumber,
            contractorEmail: contractor.Email,
            BEDCRegNumber: contractor.BEDCRegNo,
        };

        // Redirect logic based on presence and KYC status
      if (kycRecord) {
    const kycStatus = kycRecord.Status?.trim().toLowerCase();

    if (kycStatus === 'approved') {
        res.status(200).send({ status: 'ok', msg: 'Contractor Approved', container, redirectTo: 'network-construction.html' });
    } else if (kycStatus === 'pending') {
        res.status(200).send({ status: 'ok', msg: 'Contractor KYC Pending', container, redirectTo: 'test.html' });
    } else {
        res.status(200).send({ status: 'ok', msg: `Contractor KYC Status: ${kycRecord.Status}`, container, redirectTo: 'test.html' });
    }
}
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: 'error', msg: 'Server error', err });
    }
});

module.exports = router;
