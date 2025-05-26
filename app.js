// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const contractorRoutes = require('./routes/contractorauth'); // Import the contractor routes





dotenv.config();

const app = express();
app.use(express.json()); // to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // to parse URL-encoded request bodies
app.use(cors()); // Enable CORS for all routes

// Route middleware
app.use('/api', contractorRoutes);
app.use('/contractor', require('./routes/contractorauth')); // Use the contractor routes
app.use('/forms', require('./routes/forms')); // Use the forms routes
app.use('/newform', require('./routes/newform')); // Use the new form routes
app.use('/newdashboard', require('./routes/newdashboard')); // Use the new dashboard routes



// Root route (optional)
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
