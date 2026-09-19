const express = require("express");
const router = express.Router();
const { createProduct, getAllProducts } = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createProduct);
router.get("/", authMiddleware, getAllProducts);

module.exports = router;