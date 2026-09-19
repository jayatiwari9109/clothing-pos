const pool = require("../config/db");

// 1. Add New Expense (Rent, Bills, Salary, etc.)
exports.createExpense = async (req, res) => {
  const { category, amount, description, payment_mode } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO expenses (category, amount, description, payment_mode)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [category, amount, description || null, payment_mode || 'CASH']
    );
    res.status(201).json({ message: "Expense recorded successfully", expense: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Get All Expenses (with optional date/category filter)
exports.getExpenses = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM expenses ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get Expense Summary (Total spent by category)
exports.getExpenseSummary = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT category, SUM(amount) as total_amount 
       FROM expenses 
       GROUP BY category 
       ORDER BY total_amount DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};