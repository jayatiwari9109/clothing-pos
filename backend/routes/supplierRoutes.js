const express = require("express");
const router = express.Router();
const { createSupplier, getSuppliers, createPurchaseOrder } = require("../controllers/supplierController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createSupplier);
router.get("/", authMiddleware, getSuppliers);
router.post("/purchase", authMiddleware, createPurchaseOrder);

module.exports = router;
