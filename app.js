// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const contractorRoutes = require('./routes/contractorauth');
const formsRoutes = require('./routes/forms');
const newFormRoutes = require('./routes/newform');
const dashboardRoutes = require('./routes/newdashboard');

// Load .env variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route mounting
app.use('/api/contractor', contractorRoutes);     // e.g., POST /api/contractor/register
app.use('/api/forms', formsRoutes);               // e.g., GET /api/forms
app.use('/api/newform', newFormRoutes);           // e.g., POST /api/newform
app.use('/api/dashboard', dashboardRoutes);       // e.g., GET /api/dashboard

// Health check route
app.get('/', (req, res) => {
  res.send('🚀 Server is running...');
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
