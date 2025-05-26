const express = require('express');
const multer = require('multer');
const { uploadImage } = require('../models/cloudinary_config'); // Import the uploadImage function from cloudinary_config.js
const sql = require('mssql');
const { poolPromise } = require('../db'); // Ensure you are importing the poolPromise

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Helper function to upload files to Cloudinary using the uploadImage method
const uploadFile = async (file) => {
    if (!file) return null;
    // Use the custom uploadImage method to handle timestamp and signature
    const result = await uploadImage(file.path, 'techcontract');  // Pass the folder name 'techcontract'
    return result.secure_url;  // Return the secure URL after uploading
};

// Submit Contractor Form
router.post('/submitContractor', upload.fields([
    { name: 'PPersonSampleSignature1', maxCount: 1 },
    { name: 'PPersonSampleSignature2', maxCount: 1 },
    { name: 'BEDCCertificate', maxCount: 1 },
    { name: 'ValidNEMSALicense', maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            contractorsName, contractorEmail, ContractorAddress, contractorPhoneNumber, BEDCRegNo,
            PPersonFName1, PPersonLName1, PPersonMName1, PPersonPosition1, PPersonPhoneNo1,
            PPersonFName2, PPersonLName2, PPersonMName2, PPersonPosition2, PPersonPhoneNo2
        } = req.body;

        if (!contractorsName || !contractorEmail || !ContractorAddress || !contractorPhoneNumber || !BEDCRegNo ||
            !PPersonFName1 || !PPersonLName1 || !PPersonMName1 || !PPersonPosition1 || !PPersonPhoneNo1 ||
            !PPersonFName2 || !PPersonLName2 || !PPersonMName2 || !PPersonPosition2 || !PPersonPhoneNo2) {
            return res.status(400).json({ status: 'error', msg: 'All required fields must be filled' });
        }

        // Upload Files to Cloudinary
        const fileUploads = {
            PPersonSampleSignature1: await uploadFile(req.files['PPersonSampleSignature1']?.[0]),
            PPersonSampleSignature2: await uploadFile(req.files['PPersonSampleSignature2']?.[0]),
            BEDCCerticate: await uploadFile(req.files['BEDCCertificate']?.[0]),
            ValidNEMSALicense: await uploadFile(req.files['ValidNEMSALicense']?.[0])
        };

        // Get the pool connection and query the database
        const pool = await poolPromise;  // Ensure you get the pool connection
        const request = pool.request();

        // SQL Query to Insert Data into SQL Server
        const query = `INSERT INTO RegisteredContractors_KYC
            (ContractorName, ContractorAddress, PhoneNo, Email, BEDCRegNo, 
            PPersonFName1, PPersonLName1, PPersonMName1, PPersonPosition1, PPersonPhoneNo1,
            PPersonFName2, PPersonLName2, PPersonMName2, PPersonPosition2, PPersonPhoneNo2,
            PPersonSampleSignature1, PPersonSampleSignature2, BEDCCertificate, ValidNEMSALicense, VendorConsent, EntryDate)
            VALUES
            (@ContractorName, @ContractorAddress, @PhoneNo, @Email, @BEDCRegNo, 
            @PPersonFName1, @PPersonLName1, @PPersonMName1, @PPersonPosition1, @PPersonPhoneNo1,
            @PPersonFName2, @PPersonLName2, @PPersonMName2, @PPersonPosition2, @PPersonPhoneNo2,
            @PPersonSampleSignature1, @PPersonSampleSignature2, @BEDCCertificate, @ValidNEMSALicense, @VendorConsent, @EntryDate);`;

        request.input('ContractorName', sql.NVarChar, contractorsName);
        request.input('ContractorAddress', sql.NVarChar, ContractorAddress);
        request.input('PhoneNo', sql.NVarChar, contractorPhoneNumber);
        request.input('Email', sql.NVarChar, contractorEmail);
        request.input('BEDCRegNo', sql.NVarChar, BEDCRegNo);
        request.input('PPersonFName1', sql.NVarChar, PPersonFName1);
        request.input('PPersonLName1', sql.NVarChar, PPersonLName1);
        request.input('PPersonMName1', sql.NVarChar, PPersonMName1);
        request.input('PPersonPosition1', sql.NVarChar, PPersonPosition1);
        request.input('PPersonPhoneNo1', sql.NVarChar, PPersonPhoneNo1);
        request.input('PPersonFName2', sql.NVarChar, PPersonFName2);
        request.input('PPersonLName2', sql.NVarChar, PPersonLName2);
        request.input('PPersonMName2', sql.NVarChar, PPersonMName2);
        request.input('PPersonPosition2', sql.NVarChar, PPersonPosition2);
        request.input('PPersonPhoneNo2', sql.NVarChar, PPersonPhoneNo2);
        request.input('PPersonSampleSignature1', sql.NVarChar, fileUploads.PPersonSampleSignature1);
        request.input('PPersonSampleSignature2', sql.NVarChar, fileUploads.PPersonSampleSignature2);
        request.input('BEDCCertificate', sql.NVarChar, fileUploads.BEDCCerticate);
        request.input('ValidNEMSALicense', sql.NVarChar, fileUploads.ValidNEMSALicense);
        request.input('VendorConsent', sql.NVarChar, 'Yes');
        request.input('EntryDate', sql.DateTime, new Date());

        await request.query(query);  // Execute the query with the connection
        res.status(200).json({ status: 'ok', msg: 'Contractor form submitted successfully!' });
    } catch (error) {
        console.error('Error submitting contractor form:', error);
        res.status(500).json({ status: 'error', msg: 'Internal Server Error' });
    }
});


// Submit Pointload Form
router.post('/submitPointLoad', upload.fields([
    { name: 'projectLoadEstimate', maxCount: 1 },
    { name: 'customerPremisesImage', maxCount: 1 },
    { name: 'adminFeePaymentEvidence', maxCount: 1 },
    { name: 'clientLetterOfIntroductionAndUndertaking', maxCount: 1 },
    { name: 'SingleLineDrawing', maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            contractorsName,
            contractorEmail,
            ContractorAddress,
            BEDCRegNo,
            businessNature,
            proposedSpanOfExtention,
            voltageLevelOfNetwork,
            clientName,
            clientAddress,
            clientPhoneNumber,
            PremisesUse,
            BEDCRegion,
            RelocationAddressDescription,
            contractorPhoneNumber,
            projectDurationEstimate
        } = req.body;

        if (!contractorsName || !contractorEmail || !ContractorAddress || !BEDCRegNo ||
            !businessNature || !proposedSpanOfExtention || !voltageLevelOfNetwork || !clientName ||
            !clientAddress || !clientPhoneNumber || !PremisesUse || !BEDCRegion || !RelocationAddressDescription ||
            !contractorPhoneNumber || !projectDurationEstimate) {
            return res.status(400).json({ status: 'error', msg: 'All required fields must be filled' });
        }

        // Upload Files to Cloudinary
        const fileUploads = {
            projectLoadEstimate: await uploadFile(req.files['projectLoadEstimate']?.[0]),
            customerPremisesImage: await uploadFile(req.files['customerPremisesImage']?.[0]),
            adminFeePaymentEvidence: await uploadFile(req.files['adminFeePaymentEvidence']?.[0]),
            clientLetterOfIntroductionAndUndertaking: await uploadFile(req.files['clientLetterOfIntroductionAndUndertaking']?.[0]),
            SingleLineDrawing: await uploadFile(req.files['SingleLineDrawing']?.[0]),
        };

        const query = `INSERT INTO PointLooad_Applications
            (ContractorName, ContractorEmail, ContractorAddress, BEDCRegNo, BusinessNature, ProposedSpanOfExtention,
            VoltageLevelOfNetwork, ClientFName, ClientLName, ClientMName, ClientPhoneNo, PremisesUse, BEDCRegion,
            RelocationAddressDescription, ContractorPhoneNumber, ProjectDurationEstimate, ProjectLoadEstimate,
            CustomerPremisesImage, AdminFeePaymentEvidence, ClientLetterofIntroductionAndUndertaking, SingleLineDrawing,
            EntryDate)
            VALUES (@ContractorName, @ContractorEmail, @ContractorAddress, @BEDCRegNo, @BusinessNature, @ProposedSpanOfExtention,
            @VoltageLevelOfNetwork, @ClientFName, @ClientLName, @ClientMName, @ClientPhoneNo, @PremisesUse, @BEDCRegion,
            @RelocationAddressDescription, @ContractorPhoneNumber, @ProjectDurationEstimate, @ProjectLoadEstimate,
            @CustomerPremisesImage, @AdminFeePaymentEvidence, @ClientLetterofIntroductionAndUndertaking, @SingleLineDrawing, @EntryDate);`;

        const request = new sql.Request();
        request.input('ContractorName', sql.NVarChar, contractorsName);
        request.input('ContractorEmail', sql.NVarChar, contractorEmail);
        request.input('ContractorAddress', sql.NVarChar, ContractorAddress);
        request.input('BEDCRegNo', sql.NVarChar, BEDCRegNo);
        request.input('BusinessNature', sql.NVarChar, businessNature);
        request.input('ProposedSpanOfExtention', sql.NVarChar, proposedSpanOfExtention);
        request.input('VoltageLevelOfNetwork', sql.NVarChar, voltageLevelOfNetwork);
        request.input('ClientFName', sql.NVarChar, clientName);
        request.input('ClientLName', sql.NVarChar, clientAddress);
        request.input('ClientMName', sql.NVarChar, clientPhoneNumber);
        request.input('ClientPhoneNo', sql.NVarChar, clientPhoneNumber);
        request.input('PremisesUse', sql.NVarChar, PremisesUse);
        request.input('BEDCRegion', sql.NVarChar, BEDCRegion);
        request.input('RelocationAddressDescription', sql.NVarChar, RelocationAddressDescription);
        request.input('ContractorPhoneNumber', sql.NVarChar, contractorPhoneNumber);
        request.input('ProjectDurationEstimate', sql.NVarChar, projectDurationEstimate);
        request.input('ProjectLoadEstimate', sql.NVarChar, fileUploads.projectLoadEstimate);
        request.input('CustomerPremisesImage', sql.NVarChar, fileUploads.customerPremisesImage);
        request.input('AdminFeePaymentEvidence', sql.NVarChar, fileUploads.adminFeePaymentEvidence);
        request.input('ClientLetterofIntroductionAndUndertaking', sql.NVarChar, fileUploads.clientLetterOfIntroductionAndUndertaking);
        request.input('SingleLineDrawing', sql.NVarChar, fileUploads.SingleLineDrawing);
        request.input('EntryDate', sql.DateTime, new Date());

        await request.query(query);

        res.status(200).json({ status: 'ok', msg: 'Pointload form submitted successfully!' });
    } catch (error) {
        console.error("❌ ERROR:", error);
        res.status(500).json({ status: 'error', msg: 'Internal Server Error' });
    }
});

// Submit Network Form
router.post('/submitNetwork', upload.fields([
    { name: 'clientLetterOfIntroductionAndUndertaking', maxCount: 1 },
    { name: 'SingleLineDrawing', maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            contractorsName,
            contractorEmail,
            BEDCRegNo,
            contractorPhoneNumber,
            proposedSpanOfExtention,
            voltageLevelOfNetwork,
            projectDurationEstimate,
            relocationAddressDescription,
            BEDCRegion
        } = req.body;

        if (!contractorsName || !contractorEmail || !BEDCRegNo || !contractorPhoneNumber ||
            !proposedSpanOfExtention || !voltageLevelOfNetwork || !projectDurationEstimate || !relocationAddressDescription || !BEDCRegion) {
            return res.status(400).json({ status: 'error', msg: 'All required fields must be filled' });
        }

        const fileUploads = {
            clientLetterOfIntroductionAndUndertaking: await uploadFile(req.files['clientLetterOfIntroductionAndUndertaking']?.[0]),
            SingleLineDrawing: await uploadFile(req.files['SingleLineDrawing']?.[0]),
        };

        const query = `INSERT INTO Network_Applications
            (ContractorName, ContractorEmail, BEDCRegNo, ContractorPhoneNumber, ProposedSpanOfExtention, VoltageLevelOfNetwork, 
            ProjectDurationEstimate, RelocationAddressDescription, BEDCRegion, ClientLetterofIntroductionAndUndertaking, 
            SingleLineDrawing, EntryDate)
            VALUES (@ContractorName, @ContractorEmail, @BEDCRegNo, @ContractorPhoneNumber, @ProposedSpanOfExtention, 
            @VoltageLevelOfNetwork, @ProjectDurationEstimate, @RelocationAddressDescription, @BEDCRegion, 
            @ClientLetterofIntroductionAndUndertaking, @SingleLineDrawing, @EntryDate);`;

        const request = new sql.Request();
        request.input('ContractorName', sql.NVarChar, contractorsName);
        request.input('ContractorEmail', sql.NVarChar, contractorEmail);
        request.input('BEDCRegNo', sql.NVarChar, BEDCRegNo);
        request.input('ContractorPhoneNumber', sql.NVarChar, contractorPhoneNumber);
        request.input('ProposedSpanOfExtention', sql.NVarChar, proposedSpanOfExtention);
        request.input('VoltageLevelOfNetwork', sql.NVarChar, voltageLevelOfNetwork);
        request.input('ProjectDurationEstimate', sql.NVarChar, projectDurationEstimate);
        request.input('RelocationAddressDescription', sql.NVarChar, relocationAddressDescription);
        request.input('BEDCRegion', sql.NVarChar, BEDCRegion);
        request.input('ClientLetterofIntroductionAndUndertaking', sql.NVarChar, fileUploads.clientLetterOfIntroductionAndUndertaking);
        request.input('SingleLineDrawing', sql.NVarChar, fileUploads.SingleLineDrawing);
        request.input('EntryDate', sql.DateTime, new Date());

        await request.query(query);
        res.status(200).json({ status: 'ok', msg: 'Network form submitted successfully!' });
    } catch (error) {
        console.error('Error submitting network form:', error);
        res.status(500).json({ status: 'error', msg: 'Internal Server Error' });
    }
});

// Submit Substation Form
router.post('/submitSubstation', upload.fields([
    { name: 'clientLetterOfIntroductionAndUndertaking', maxCount: 1 },
    { name: 'SingleLineDrawing', maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            contractorsName,
            contractorEmail,
            BEDCRegNo,
            contractorPhoneNumber,
            projectDurationEstimate,
            substationLocationDescription,
            BEDCRegion
        } = req.body;

        if (!contractorsName || !contractorEmail || !BEDCRegNo || !contractorPhoneNumber ||
            !projectDurationEstimate || !substationLocationDescription || !BEDCRegion) {
            return res.status(400).json({ status: 'error', msg: 'All required fields must be filled' });
        }

        const fileUploads = {
            clientLetterOfIntroductionAndUndertaking: await uploadFile(req.files['clientLetterOfIntroductionAndUndertaking']?.[0]),
            SingleLineDrawing: await uploadFile(req.files['SingleLineDrawing']?.[0]),
        };

        const query = `INSERT INTO Substation_Applications
            (ContractorName, ContractorEmail, BEDCRegNo, ContractorPhoneNumber, ProjectDurationEstimate, 
            SubstationLocationDescription, BEDCRegion, ClientLetterofIntroductionAndUndertaking, 
            SingleLineDrawing, EntryDate)
            VALUES (@ContractorName, @ContractorEmail, @BEDCRegNo, @ContractorPhoneNumber, @ProjectDurationEstimate, 
            @SubstationLocationDescription, @BEDCRegion, @ClientLetterofIntroductionAndUndertaking, 
            @SingleLineDrawing, @EntryDate);`;

        const request = new sql.Request();
        request.input('ContractorName', sql.NVarChar, contractorsName);
        request.input('ContractorEmail', sql.NVarChar, contractorEmail);
        request.input('BEDCRegNo', sql.NVarChar, BEDCRegNo);
        request.input('ContractorPhoneNumber', sql.NVarChar, contractorPhoneNumber);
        request.input('ProjectDurationEstimate', sql.NVarChar, projectDurationEstimate);
        request.input('SubstationLocationDescription', sql.NVarChar, substationLocationDescription);
        request.input('BEDCRegion', sql.NVarChar, BEDCRegion);
        request.input('ClientLetterofIntroductionAndUndertaking', sql.NVarChar, fileUploads.clientLetterOfIntroductionAndUndertaking);
        request.input('SingleLineDrawing', sql.NVarChar, fileUploads.SingleLineDrawing);
        request.input('EntryDate', sql.DateTime, new Date());

        await request.query(query);
        res.status(200).json({ status: 'ok', msg: 'Substation form submitted successfully!' });
    } catch (error) {
        console.error('Error submitting substation form:', error);
        res.status(500).json({ status: 'error', msg: 'Internal Server Error' });
    }
}
);

module.exports = router;
