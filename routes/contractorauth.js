// routes/auth.js
const express = require('express');
const router = express.Router(); 
const bcrypt = require('bcryptjs');
const { sql, poolPromise } = require('../db'); // adjust path to your db config


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

// Signup Route - Skipping OTP Verification
router.post('/signup', async (req, res) => {
  const { BEDCRegNo, email, phoneNumber, username, password } = req.body;

  if (!BEDCRegNo || !email || !phoneNumber || !username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const pool = await poolPromise;

    // Step 1: Check if BEDCRegNo and Email exist in BEDCRegistered_Contractors
    const contractorCheck = await pool.request()
      .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
      .input('Email', sql.VarChar, email)
      .query(`
        SELECT * FROM BEDCRegistered_Contractors
        WHERE BEDCRegNo = @BEDCRegNo AND Email = @Email
      `);

    if (contractorCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'No matching contractor found in registry' });
    }

    // Step 2: Check if username already exists in ContractorAccounts
    const existingUserCheck = await pool.request()
      .input('Username', sql.VarChar, username)
      .query(`SELECT * FROM ContractorAccounts WHERE Username = @Username`);

    if (existingUserCheck.recordset.length > 0) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    // Step 3: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 4: Save new account to ContractorAccounts
    await pool.request()
      .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
      .input('Username', sql.VarChar, username)
      .input('PhoneNumber', sql.VarChar, phoneNumber)
      .input('EmailAddress', sql.VarChar, email)
      .input('Password', sql.VarChar, hashedPassword)
      .input('CreatedAt', sql.DateTime, new Date())
      .query(`
        INSERT INTO ContractorAccounts 
        (BEDCRegNo, Username, PhoneNumber, EmailAddress, Password, CreatedAt)
        VALUES (@BEDCRegNo, @Username, @PhoneNumber, @EmailAddress, @Password, @CreatedAt)
      `);

    return res.status(201).json({ message: 'Signup successful' });

  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Login Route - Returns contractor container directly, no session
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ status: 'error', msg: 'Username and password are required' });
  }

  try {
    const pool = await poolPromise;

    // Step 1: Find user by username
    const userResult = await pool.request()
      .input('Username', sql.VarChar, username)
      .query('SELECT * FROM ContractorAccounts WHERE Username = @Username');

    if (userResult.recordset.length === 0) {
      return res.status(401).json({ status: 'error', msg: 'Invalid Username' });
    }

    const user = userResult.recordset[0];

    // Step 2: Verify password
    const match = await bcrypt.compare(password, user.Password);
    if (!match) {
      return res.status(401).json({ status: 'error', msg: 'Invalid Password' });
    }

    const BEDCRegNo = user.BEDCRegNo;

    // Step 3: Fetch contractor details from BEDCRegistered_Contractors
    const resultContractors = await pool.request()
      .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
      .query(`
        SELECT CompanyName, CompanyAddress, PhoneNumber, Email, BEDCRegNo
        FROM BEDCRegistered_Contractors
        WHERE BEDCRegNo = @BEDCRegNo
      `);

    const contractor = resultContractors.recordset[0];

    if (!contractor) {
      return res.status(404).json({ status: 'error', msg: 'Contractor not found in BEDCRegistered_Contractors' });
    }

    // Step 4: Check KYC status (optional redirect logic)
    const resultKYC = await pool.request()
      .input('BEDCRegNo', sql.VarChar, BEDCRegNo)
      .query(`
        SELECT TOP 1 BEDCRegNo, Status
        FROM RegisteredContractors_KYC
        WHERE BEDCRegNo = @BEDCRegNo
      `);

    const kycRecord = resultKYC.recordset[0];
    let msg = 'Contractor found only in BEDCRegistered_Contractors';
    let redirectTo = 'contractorkyc.html';

    if (kycRecord) {
      const status = kycRecord.Status?.trim().toLowerCase();
      if (status === 'approved') {
        msg = 'Contractor Approved';
        redirectTo = 'network-construction.html';
      } else if (status === 'pending') {
        msg = 'Contractor KYC Pending';
        redirectTo = 'Success.html';
      } else if (status === 'declined') {
        msg = 'Contractor KYC Declined';
      } else {
        msg = 'Contractor KYC Status: ' + status;
      }
    }

    // ✅ Final Contractor Container
    const container = {
      contractorName: contractor.CompanyName,
      contractorAddress: contractor.CompanyAddress,
      PhoneNo: contractor.PhoneNumber,
      contractorEmail: contractor.Email,
      BEDCRegNumber: contractor.BEDCRegNo
    };

    return res.status(200).json({
      status: 'ok',
      msg,
      container,
      redirectTo
    });

  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ status: 'error', msg: 'Server error', err: err.message });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('EmailAddress', sql.VarChar, email)
      .query('SELECT * FROM ContractorAccounts WHERE EmailAddress = @EmailAddress');

    if (result.recordset.length === 0) {
      return res.status(404).json({ status: 'error', msg: 'Email not found' });
    }

    const otp = generateOTP();
    otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });
    await sendEmail(email, 'Reset Password OTP', `Your reset OTP is ${otp}`);

    res.json({ status: 'ok', msg: 'Reset OTP sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', msg: 'Server error' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const stored = otpStore.get(email);

  if (!stored || stored.otp !== otp || Date.now() > stored.expiresAt) {
    return res.status(400).json({ status: 'error', msg: 'Invalid or expired OTP' });
  }

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    const pool = await poolPromise;
    await pool.request()
      .input('EmailAddress', sql.VarChar, email)
      .input('Password', sql.VarChar, hashed)
      .query('UPDATE ContractorAccounts SET Password = @Password WHERE EmailAddress = @EmailAddress');

    otpStore.delete(email);
    res.json({ status: 'ok', msg: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', msg: 'Server error' });
  }
});

router.get('/session-info', (req, res) => {
  if (req.session.container) {
    res.json({ success: true, data: req.session.container });
  } else {
    res.status(401).json({ success: false, message: 'Not logged in' });
  }
});


// Admin Signup Route — Plaintext password (not hashed)
router.post('/admin_signup', async (req, res) => {
  const {
    username,
    password,
    firstName,
    lastName,
    otherName,
    email,            // <-- now accepted
    phoneNumber,
    region,
    bu,
    role,
    bedcRegNo
  } = req.body;

  const fullName = `${firstName} ${lastName}${otherName ? ' ' + otherName : ''}`;
  const staffId = phoneNumber;
  const status = 'Active';
  const created = new Date();

  try {
    const pool = await poolPromise;

    // Check if username or email already exists
    const check = await pool.request()
      .input('Username', sql.VarChar, username)
      .input('Email', sql.VarChar, email)
      .query(`
        SELECT * FROM TechCon_login 
        WHERE Username = @Username OR Email = @Email
      `);

    if (check.recordset.length > 0) {
      return res.status(409).json({ msg: 'Username or Email already exists' });
    }

    // Insert new admin into the DB
    await pool.request()
      .input('Username', sql.VarChar, username)
      .input('Password', sql.VarChar, password)
      .input('Name', sql.VarChar, fullName)
      .input('Staffid', sql.VarChar, staffId)
      .input('Role', sql.VarChar, role)
      .input('Status', sql.VarChar, status)
      .input('Created', sql.DateTime, created)
      .input('BEDCRegNo', sql.VarChar, bedcRegNo)
      .input('Region', sql.VarChar, region)
      .input('BU', sql.VarChar, bu)
      .input('Email', sql.VarChar, email) // <-- inserted here
      .query(`
        INSERT INTO TechCon_login 
        (Username, Password, Name, Staffid, Role, Status, Created, BEDCRegNo, Region, BU, Email)
        VALUES 
        (@Username, @Password, @Name, @Staffid, @Role, @Status, @Created, @BEDCRegNo, @Region, @BU, @Email)
      `);

    return res.status(201).json({ msg: 'Admin signup successful' });
  } catch (err) {
    console.error('Admin signup error:', err);
    return res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// POST /contractors/admin_login
router.post('/admin_login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Username/Email and password are required.' });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('emailOrUsername', sql.VarChar, email)
      .query(`
        SELECT TOP 1 * 
        FROM [TechContract].[dbo].[TechCon_login]
        WHERE Username = @emailOrUsername OR Email = @emailOrUsername
      `);

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ msg: 'Invalid username/email or password' });
    }

    // Simple password check (not hashed)
    if (user.Password !== password) {
      return res.status(401).json({ msg: 'Invalid username/email or password' });
    }

    res.status(200).json({
      msg: 'Login successful',
      user: {
        id: user.id,
        username: user.Username,
        email: user.Email,
        name: user.Name,
        staffId: user.Staffid,
        role: user.Role,
        status: user.Status,
        region: user.Region,
        BU: user.BU,
        BEDCRegNo: user.BEDCRegNo
      }
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
