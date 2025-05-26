const express = require('express');
const multer = require('multer');
const path = require('path');
const { sql, poolPromise } = require('../db'); // path to db.js
const cors = require('cors');
const fs = require('fs');
const dotenv = require('dotenv');


const router = express.Router();

// Configure multer for file handling
// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Adjust this to your actual folder
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

// Multer instance expecting specific fields
// ...top setup remains unchanged...

// Multer instance expecting specific fields
const upload = multer({ storage }).fields([
  { name: 'BEDCCertificate', maxCount: 1 },
  { name: 'ValidNEMSALicense', maxCount: 1 },
   { name: 'clientLetterOfIntroductionAndUndertaking', maxCount: 1 },
   { name: 'clientLetterOfIntroduction', maxCount: 1 },
  { name: 'adminFeePaymentEvidence', maxCount: 1 },
   { name: 'projectLoadEstimate', maxCount: 1 },
  { name: 'LetterOfDonation', maxCount: 1 }
   
]);


// Correct route using the `upload` instance
router.post('/submitContractor', upload, async (req, res) => {
  try {
    // Get contractor form data
    const {
      contractorName,
      contractorAddress,
      phoneNo,
      email,
      bedcRegNo,
      pPersonFName1,
      pPersonLName1,
      pPersonMName1,
      pPersonPosition1,
      pPersonPhoneNo1,
      pPersonFName2,
      pPersonLName2,
      pPersonMName2,
      pPersonPosition2,
      pPersonPhoneNo2,
      vendorConsent,
    } = req.body;

    // Files (with checks)
    const ValidNEMSALicense = req.files['ValidNEMSALicense']?.[0];
    const BEDCCertificate = req.files['BEDCCertificate']?.[0];

    if ( !BEDCCertificate || !ValidNEMSALicense) {
      return res.status(400).json({ status: 'error', msg: 'All file fields are required.' });
    }

    // Convert uploaded files to buffer
    const fs = require('fs');
    const licenseBuffer = fs.readFileSync(ValidNEMSALicense.path);
    const certificateBuffer = fs.readFileSync(BEDCCertificate.path);

    // Connect to SQL Server
    const pool = await poolPromise;
    const result = await pool.request()
      .input('contractorName', sql.NVarChar, contractorName)
      .input('contractorAddress', sql.NVarChar, contractorAddress)
      .input('phoneNo', sql.NVarChar, phoneNo)
      .input('email', sql.NVarChar, email)
      .input('bedcRegNo', sql.NVarChar, bedcRegNo)
      .input('pPersonFName1', sql.NVarChar, pPersonFName1)
      .input('pPersonLName1', sql.NVarChar, pPersonLName1)
      .input('pPersonMName1', sql.NVarChar, pPersonMName1)
      .input('pPersonPosition1', sql.NVarChar, pPersonPosition1)
      .input('pPersonPhoneNo1', sql.NVarChar, pPersonPhoneNo1)
      .input('pPersonFName2', sql.NVarChar, pPersonFName2)
      .input('pPersonLName2', sql.NVarChar, pPersonLName2)
      .input('pPersonMName2', sql.NVarChar, pPersonMName2)
      .input('pPersonPosition2', sql.NVarChar, pPersonPosition2)
      .input('pPersonPhoneNo2', sql.NVarChar, pPersonPhoneNo2)
      .input('vendorConsent', sql.Bit, vendorConsent)
        .input('license', sql.VarBinary, licenseBuffer)
      .input('certificate', sql.VarBinary, certificateBuffer)
      .query(`
        INSERT INTO RegisteredContractors_KYC 
          (ContractorName, ContractorAddress, PhoneNo, Email, BEDCRegNo, 
           PPersonFName1, PPersonLName1, PPersonMName1, PPersonPosition1, PPersonPhoneNo1,
           PPersonFName2, PPersonLName2, PPersonMName2, PPersonPosition2, PPersonPhoneNo2,
           VendorConsent, BEDCCerticate, ValidNEMSALicense, EntryDate)
        VALUES
          (@contractorName, @contractorAddress, @phoneNo, @email, @bedcRegNo, 
           @pPersonFName1, @pPersonLName1, @pPersonMName1, @pPersonPosition1, @pPersonPhoneNo1,
           @pPersonFName2, @pPersonLName2, @pPersonMName2, @pPersonPosition2, @pPersonPhoneNo2,
           @vendorConsent, @certificate, @license, GETDATE());
      `);

    return res.status(200).json({ status: 'ok', msg: 'Contractor added successfully.' });
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).json({ status: 'error', msg: 'An error occurred while processing the request.' });
  }
});

//submit Pointload form
router.post('/submitPointload', (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError || err) {
      return res.status(500).json({ status: 'error', msg: err.message });
    }

    try {
      const {
        contractorName,
        contractorEmail,
        BEDCRegNo,
        BEDCRegion,
        PremisesUse,
        businessNature,
        projectDurationEstimate,
        proposedSpanOfExtention,
        voltageLevelOfNetwork,
        clientName,
        RelocationAddressDescription,
        clientPhoneNumber,
        NameOfProject,
        clientLetterOfIntroductionAndUndertaking  // This is the checkbox
      } = req.body;

      // Check if checkbox is ticked
      const clientLetterAgreement = clientLetterOfIntroductionAndUndertaking === 'on' || clientLetterOfIntroductionAndUndertaking === 'true';
      if (!clientLetterAgreement) {
        return res.status(400).json({ status: 'error', msg: 'You must agree to the Client Letter of Undertaking.' });
      }

      const adminFeeFile = req.files['adminFeePaymentEvidence']?.[0];
      const loadEstimateFile = req.files['projectLoadEstimate']?.[0];
      const clientLetterFile = req.files['clientLetterOfIntroduction']?.[0];

      if (!adminFeeFile || !loadEstimateFile || !clientLetterFile) {
        return res.status(400).json({ status: 'error', msg: 'All required files must be uploaded.' });
      }

      const pool = await poolPromise;
      const request = pool.request();

     request
  .input('ContractorName', sql.VarChar, contractorName)
  .input('ContractorEmail', sql.VarChar, contractorEmail)
  .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
  .input('BEDCRegion', sql.VarChar, BEDCRegion)
  .input('PremisesUse', sql.VarChar, PremisesUse)
  .input('NatureOfBusiness', sql.VarChar, businessNature)
  .input('ProjectDurationEstimate', sql.VarChar, projectDurationEstimate)
  .input('NameOfProject', sql.VarChar, NameOfProject)
  .input('ProposedCapacityofSubstation', sql.VarChar, proposedSpanOfExtention)
  .input('VoltageLevelofSubstation', sql.VarChar, voltageLevelOfNetwork)
  .input('ClientName', sql.VarChar, clientName)
  .input('ClientPhoneNumber', sql.VarChar, clientPhoneNumber)
  .input('RelocationAddressDescription', sql.VarChar, RelocationAddressDescription)
  .input('ClientLetterAgreement', sql.Bit, clientLetterAgreement)
  .input('AdminFeePaymentEvidence', sql.VarBinary(sql.MAX), fs.readFileSync(adminFeeFile.path))
  .input('ProjectLoadEstimate', sql.VarBinary(sql.MAX), fs.readFileSync(loadEstimateFile.path))
  .input('ClientLetterOfIntroduction', sql.VarBinary(sql.MAX), fs.readFileSync(clientLetterFile.path));

      await request.query(`
        INSERT INTO PointLoad_Applications (
          ContractorName, ContractorEmail, BEDCRegNo, BEDCRegion, PremisesUse,
          NatureOfBusiness, ProjectDurationEstimate, NameOfProject,
          ProposedCapacityofSubstation, VoltageLevelofSubstation,
          ClientName, ClientPhoneNumber, RelocationAddressDescription,
          ClientLetterAgreement, AdminFeePaymentEvidence, ProjectLoadEstimate, ClientLetterOfIntroduction
        ) VALUES (
          @ContractorName, @ContractorEmail, @BEDCRegNo, @BEDCRegion, @PremisesUse,
          @NatureOfBusiness, @ProjectDurationEstimate, @NameOfProject,
          @ProposedCapacityofSubstation, @VoltageLevelofSubstation,
          @ClientName, @ClientPhoneNumber, @RelocationAddressDescription,
          @ClientLetterAgreement, @AdminFeePaymentEvidence, @ProjectLoadEstimate, @ClientLetterOfIntroduction
        )
      `);

      res.status(200).json({ status: 'ok', msg: 'Point Load Application submitted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', msg: 'Internal Server Error' });
    }
  });
});

//submit substation form
router.post('/substation', upload, async (req, res) => {
  try {
    const {
      contractorName,
      contractorEmail,
      BEDCRegNo,
      SubstationName,
      SubstationLocation,
      proposedSpanOfSubstation,
      voltageLevelOfSubstation,
      BEDCRegion
    } = req.body;

    // Parse client letter checkbox
    const clientLetterAccepted = req.body.clientLetterOfIntroductionAndUndertaking === 'on' ? 1 : 0;

    // Uploaded files
    const AdminFeeFile = req.files['adminFeePaymentEvidence']?.[0];
    const LetterOfDonationFile = req.files['LetterOfDonation']?.[0];

    if (!AdminFeeFile || !LetterOfDonationFile) {
      return res.status(400).json({ success: false, message: 'All required files must be uploaded.' });
    }

    const adminFeeBuffer = fs.readFileSync(AdminFeeFile.path);
    const donationBuffer = fs.readFileSync(LetterOfDonationFile.path);

    const pool = await poolPromise;

    await pool.request()
      .input('contractorName', sql.NVarChar, contractorName)
      .input('contractorEmail', sql.NVarChar, contractorEmail)
      .input('BEDCRegNo', sql.NVarChar, BEDCRegNo)
      .input('SubstationName', sql.NVarChar, SubstationName)
      .input('SubstationLocation', sql.NVarChar, SubstationLocation)
      .input('proposedSpanOfSubstation', sql.NVarChar, proposedSpanOfSubstation)
      .input('voltageLevelOfSubstation', sql.NVarChar, voltageLevelOfSubstation)
      .input('BEDCRegion', sql.NVarChar, BEDCRegion)
      .input('clientLetterAccepted', sql.Bit, clientLetterAccepted)
      .input('AdminFeePaymentEvidence', sql.VarBinary, adminFeeBuffer)
      .input('LetterOfDonation', sql.VarBinary, donationBuffer)
      .input('status', sql.NVarChar, 'pending') // default status
      .input('createdAt', sql.DateTime, new Date())
      .query(`
        INSERT INTO Substation_Applications (
          contractorName,
          contractorEmail,
          BEDCRegNo,
          SubstationName,
          SubstationLocation,
          proposedSpanOfSubstation,
          voltageLevelOfSubstation,
          BEDCRegion,
          clientLetterAccepted,
          AdminFeePaymentEvidence,
          LetterOfDonation,
          status,
          createdAt
        ) VALUES (
          @contractorName,
          @contractorEmail,
          @BEDCRegNo,
          @SubstationName,
          @SubstationLocation,
          @proposedSpanOfSubstation,
          @voltageLevelOfSubstation,
          @BEDCRegion,
          @clientLetterAccepted,
          @AdminFeePaymentEvidence,
          @LetterOfDonation,
          @status,
          @createdAt
        )
      `);

    return res.json({ success: true, message: 'Substation form submitted successfully.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// Submit Line Works
router.post('/lineWorks', upload, async (req, res) => {         
  try {
    const {
      contractorName,
      contractorEmail,
      BEDCRegNo,
      BEDCRegion,
      projectDurationEstimate,
      voltageLevelOfNetwork,
      RelocationAddressDescription,
      proposedSpanOfExtention,
    } = req.body;

    // Parse client letter checkbox
    const clientLetterAccepted = req.body.clientLetterOfIntroductionAndUndertaking === 'on' ? 1 : 0;

    
  const pool = await poolPromise;

  await pool.request()
    .input('contractorName', sql.NVarChar, contractorName)
    .input('contractorEmail', sql.NVarChar, contractorEmail)
    .input('BEDCRegNo', sql.NVarChar, BEDCRegNo)
    .input('BEDCRegion', sql.NVarChar, BEDCRegion)
    .input('projectDurationEstimate', sql.NVarChar, projectDurationEstimate)
    .input('voltageLevelOfNetwork', sql.NVarChar, voltageLevelOfNetwork)
    .input('RelocationAddressDescription', sql.NVarChar, RelocationAddressDescription)
    .input('proposedSpanOfExtention', sql.NVarChar, proposedSpanOfExtention)
    .input('clientLetterAccepted', sql.Bit, clientLetterAccepted)
    .input('status', sql.NVarChar, 'pending') // default status
    .input('createdAt', sql.DateTime, new Date())
    .query(`
      INSERT INTO LineWorks_Applications (
        contractorName,
        contractorEmail,
        BEDCRegNo,
        BEDCRegion,
        projectDurationEstimate,
        voltageLevelOfNetwork,
        RelocationAddressDescription,
        proposedSpanOfExtention,
        clientLetterAccepted,
        status,
        createdAt
      ) VALUES (
        @contractorName,
        @contractorEmail,
        @BEDCRegNo,
        @BEDCRegion,
        @projectDurationEstimate,
        @voltageLevelOfNetwork,
        @RelocationAddressDescription,
        @proposedSpanOfExtention,
        @clientLetterAccepted,
        @status,
        @createdAt
      )
    `);
    return res.json({ success: true, message: 'Line Works form submitted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// Check KYC status by BEDCRegNo
router.post('/checkKYCStatus', async (req, res) => {
    try {
        const { BEDCRegNo } = req.query;

        if (!BEDCRegNo) {
            return res.status(400).json({ status: 'error', msg: 'BEDCRegNo is required' });
        }

        const pool = await poolPromise;
        const request = pool.request();
        request.input('BEDCRegNo', sql.NVarChar, BEDCRegNo);

        const result = await request.query(`
            SELECT * FROM RegisteredContractors_KYC 
            WHERE BEDCRegNo = @BEDCRegNo AND status = 'Approved'
        `);

        if (result.recordset.length > 0) {
            return res.status(200).json({ status: 'ok', msg: 'Contractor KYC is approved', data: result.recordset[0] });
        } else {
            return res.status(404).json({ status: 'not_found', msg: 'No approved KYC found for this BEDCRegNo' });
        }
    } catch (error) {
        console.error('Error checking KYC status:', error);
        res.status(500).json({ status: 'error', msg: 'Internal Server Error' });
    }
});



        module.exports = router; 
