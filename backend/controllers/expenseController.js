// Sample expenseController.js

const getExpenses = async (req, res) => {
  try {
    // DB fetch logic
    res.status(200).json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addExpense = async (req, res) => {
  try {
    // DB create logic
    res.status(201).json({ message: 'Expense added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Functions ko export karna zaroori hai
module.exports = {
  getExpenses,
  addExpense
};