const pool = require('../config/db');

const getOverviewData = async (req, res) => {
  try {
    // 1. Total Sales & Total Orders
    const salesRes = await pool.query(
      `SELECT COALESCE(SUM(grand_total), 0) AS total_sales, COUNT(id) AS total_orders FROM sales_invoices`
    );

    // 2. Pending Udhaar / Credit Balance
    const udhaarRes = await pool.query(
      `SELECT COALESCE(SUM(current_balance), 0) AS total_udhaar, COUNT(id) AS total_customers FROM customers`
    );

    // 3. Low Stock Items Count
    const lowStockRes = await pool.query(
      `SELECT COUNT(id) AS low_stock_count FROM product_variants WHERE stock_quantity <= 5`
    );

    // 4. Recent 5 Invoices
    const recentInvoicesRes = await pool.query(
      `SELECT i.invoice_number, c.name as customer_name, i.grand_total, i.payment_method, i.created_at
       FROM sales_invoices i
       LEFT JOIN customers c ON i.customer_id = c.id
       ORDER BY i.created_at DESC LIMIT 5`
    );

    res.json({
      success: true,
      metrics: {
        total_sales: salesRes.rows[0].total_sales,
        total_orders: salesRes.rows[0].total_orders,
        total_udhaar: udhaarRes.rows[0].total_udhaar,
        total_customers: udhaarRes.rows[0].total_customers,
        low_stock_count: lowStockRes.rows[0].low_stock_count
      },
      recentInvoices: recentInvoicesRes.rows
    });
  } catch (error) {
    console.error('Overview Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getOverviewData };