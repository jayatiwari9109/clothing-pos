const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
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

app.get("/", (req, res) => {
  res.send("🚀 URBANWEAR POS & Inventory API Backend Engine Live!");
});

// Port listen logic (Sirf Local Development ke liye)
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Vercel Serverless Function Output
module.exports = app;