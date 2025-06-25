const sql = require('mssql');

const config = {
  user: 'TechContract',
  password: '100Milion$$$$',
  server: 'netapp.beninelectric.com',
  port: 45720,
  database: 'TechContract',
  options: {
    encrypt: true,
    trustServerCertificate: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  connectionTimeout: 30000, // Increased timeout to avoid ETIMEOUT
  requestTimeout: 30000
};

let pool;

const getConnection = async () => {
  if (pool) return pool;

  try {
    pool = await sql.connect(config);
    console.log('✅ Connected to SQL Server');
    return pool;
  } catch (err) {
    console.error('❌ SQL Connection Failed:', err.message);
    throw err; // Let routes handle the failure gracefully
  }
};

module.exports = {
  sql,
  getConnection
};
