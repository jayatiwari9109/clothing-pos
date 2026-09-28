const pool = require('../config/db');

// 1. Search Customers by Mobile or Name
const searchCustomers = async (req, res) => {
  try {
    const { query } = req.query;
    const result = await pool.query(
      `SELECT id, name, mobile, current_balance FROM customers 
       WHERE mobile ILIKE $1 OR name ILIKE $1 LIMIT 10`,
      [`%${query}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database search error' });
  }
};

// 2. Add New Customer to Database
const addCustomer = async (req, res) => {
  try {
    const { name, mobile, email } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({ error: 'Name and Mobile number are required!' });
    }

    // Check if customer mobile already exists
    const existing = await pool.query('SELECT * FROM customers WHERE mobile = $1', [mobile]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Customer with this mobile already exists!' });
    }

    const result = await pool.query(
      `INSERT INTO customers (name, mobile, email, current_balance) 
       VALUES ($1, $2, $3, 0.00) RETURNING *`,
      [name, mobile, email || null]
    );

    res.status(201).json({
      success: true,
      message: 'Customer added successfully!',
      customer: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { searchCustomers, addCustomer };