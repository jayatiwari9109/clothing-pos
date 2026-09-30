const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Neon PG connection serverless crash rokne ke liye ZARURI hai
  }
});

module.exports = pool;