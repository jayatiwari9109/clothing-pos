const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Helper function to safely mount routes if file exists
const safeUse = (path, routePath) => {
  try {
    app.use(path, require(routePath));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND' && err.message.includes(routePath)) {
      console.warn(`⚠️ Warning: Route module ${routePath} not found. Skipping...`);
    } else {
      throw err; // Real syntax/runtime errors pass-through
    }
  }
};

// Routes
safeUse("/api/auth", "./routes/authRoutes");
safeUse("/api/customers", "./routes/customerRoutes");
safeUse("/api/expenses", "./routes/expenseRoutes");
safeUse("/api/inventory", "./routes/inventoryRoutes");
safeUse("/api/overview", "./routes/overviewRoutes");
safeUse("/api/pos", "./routes/posRoutes");
safeUse("/api/products", "./routes/productRoutes");
safeUse("/api/suppliers", "./routes/supplierRoutes");
safeUse("/api/returns", "./routes/returnRoutes");
safeUse("/api/reports", "./routes/reportsRoutes");

app.get("/", (req, res) => {
  res.send("🚀 URBANWEAR POS & Inventory API Backend Engine Live!");
});

const cors = require("cors");

app.use(cors({
  origin: "*", // Testing ke liye allowed. Production par frontend URL paas karein.
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Vercel Serverless Function Output
module.exports = app;