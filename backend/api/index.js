const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');

// Route Imports
const authRoutes = require('../routes/authRoutes');
const customerRoutes = require('../routes/customerRoutes');
const expenseRoutes = require('../routes/expenseRoutes');
const inventoryRoutes = require('../routes/inventoryRoutes');
const overviewRoutes = require('../routes/overviewRoutes');
const posRoutes = require('../routes/posRoutes');
const productRoutes = require('../routes/productRoutes');
const reportsRoutes = require('../routes/reportsRoutes');
const returnRoutes = require('../routes/returnRoutes');
const supplierRoutes = require('../routes/supplierRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serverless DB Connection Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database Connection Failed' });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/overview', overviewRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/suppliers', supplierRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Serverless POS API is Active' });
});

// Export Serverless App Handler for Vercel
module.exports = app;