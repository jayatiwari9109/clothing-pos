const express = require("express");
const router = express.Router();
const { checkout } = require("../controllers/posController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/checkout", authMiddleware, checkout);

module.exports = router;