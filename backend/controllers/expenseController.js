const pool = require('../config/db');

const getExpenses = async (req, res) => {
  try {
    const resDb = await pool.query(`SELECT * FROM expenses ORDER BY id DESC`);
    res.json(resDb.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addExpense = async (req, res) => {
  try {
    const { category, amount, description } = req.body;
    const resDb = await pool.query(
      `INSERT INTO expenses (category, amount, description) VALUES ($1, $2, $3) RETURNING *`,
      [category, amount, description]
    );
    res.json({ success: true, expense: resDb.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getExpenses, addExpense };