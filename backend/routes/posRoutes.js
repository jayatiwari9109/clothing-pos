const express = require("express");
const router = express.Router();
const { createSaleInvoice } = require("../controllers/posController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/checkout", authMiddleware, createSaleInvoice);

module.exports = router;
