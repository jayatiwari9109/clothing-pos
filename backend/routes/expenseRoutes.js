const express = require("express");
const router = express.Router();
const { createExpense, getExpenses, getExpenseSummary } = require("../controllers/expenseController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createExpense);
router.get("/", authMiddleware, getExpenses);
router.get("/summary", authMiddleware, getExpenseSummary);

module.exports = router;