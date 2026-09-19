const pool = require('../config/db');

// 1. Add / Register Customer
exports.createCustomer = async (req, res) => {
  const { name, mobile, email, address } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO customers (name, mobile, email, address)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, mobile, email || null, address || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Search Customer by Mobile or Name
exports.searchCustomers = async (req, res) => {
  const { query } = req.query;
  try {
    const result = await pool.query(
      `SELECT * FROM customers 
       WHERE mobile LIKE $1 OR LOWER(name) LIKE LOWER($1) 
       ORDER BY name ASC LIMIT 10`,
      [`%${query}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get Customer Ledger & Udhaar Balance
exports.getCustomerLedger = async (req, res) => {
  const { customerId } = req.params;
  try {
    const customerRes = await pool.query('SELECT * FROM customers WHERE id = $1', [customerId]);
    if (customerRes.rows.length === 0) return res.status(404).json({ message: 'Customer not found' });

    const ledgerRes = await pool.query(
      `SELECT * FROM customer_ledger WHERE customer_id = $1 ORDER BY created_at DESC`,
      [customerId]
    );

    res.json({
      customer: customerRes.rows[0],
      ledger: ledgerRes.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Record Payment Received for Customer Udhaar
exports.receiveUdhaarPayment = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { customer_id, amount, notes } = req.body;

    // Deduct credit balance
    await client.query(
      `UPDATE customers SET credit_balance = credit_balance - $1 WHERE id = $2`,
      [amount, customer_id]
    );

    // Insert Ledger Entry
    const ledgerRes = await client.query(
      `INSERT INTO customer_ledger (customer_id, transaction_type, amount, notes)
       VALUES ($1, 'PAYMENT_RECEIVED', $2, $3) RETURNING *`,
      [customer_id, amount, notes || 'Udhaar payment received']
    );

    await client.query('COMMIT');
    res.status(201).json({ message: 'Payment recorded successfully', entry: ledgerRes.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};