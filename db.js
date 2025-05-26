const sql = require('mssql');

const config = {
  user: 'TechContract',
  password: '100Milion$$$$',
  server: 'netapp.beninelectric.com',
  port: 45720,
  database: 'TechContract',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => console.error('SQL Connection Failed:', err));

module.exports = { sql, poolPromise };
