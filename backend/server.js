const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes Imports
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/overview", require("./routes/overviewRoutes"));
app.use("/api/pos", require("./routes/posRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/suppliers", require("./routes/supplierRoutes"));
app.use("/api/returns", require("./routes/returnRoutes"));
app.use("/api/reports", require("./routes/reportsRoutes"));

// Root Health Check Route
app.get("/", (req, res) => {
  res.send("🚀 URBANWEAR POS & Inventory API Backend Engine Live!");
});

// Port & Listen Configuration
const PORT = process.env.PORT || 5000;

// Vercel Serverless Function Deployment Fix
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;