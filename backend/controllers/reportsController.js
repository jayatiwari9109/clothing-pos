const pool = require('../config/db');

const getSalesReport = async (req, res) => {
  try {
    const salesSummary = await pool.query(`
      SELECT 
        COUNT(id) as total_bills,
        COALESCE(SUM(subtotal), 0) as gross_sales,
        COALESCE(SUM(tax_amount), 0) as total_gst,
        COALESCE(SUM(grand_total), 0) as net_sales
      FROM sales_invoices
    `);

    const expenseSummary = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as total_expenses FROM expenses
    `);

    const gross = parseFloat(salesSummary.rows[0].gross_sales || 0);
    const gst = parseFloat(salesSummary.rows[0].total_gst || 0);
    const expenses = parseFloat(expenseSummary.rows[0].total_expenses || 0);

    res.json({
      success: true,
      grossSales: gross,
      totalGST: gst,
      totalExpenses: expenses,
      netProfit: gross - expenses,
      totalBills: parseInt(salesSummary.rows[0].total_bills || 0)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getSalesReport };