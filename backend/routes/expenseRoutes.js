const express = require('express');
const router = express.Router();

// Controller functions ko sahi se import karein
const { 
  getExpenses, 
  addExpense 
} = require('../controllers/expenseController'); // Path verify karein

// Check karein ki second argument (addExpense) undefined toh nahi hai
router.get('/', getExpenses);
router.post('/', addExpense); 

module.exports = router;