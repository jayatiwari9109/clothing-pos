const pool = require('../config/db');

// Search Invoice Details
const getInvoiceDetails = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    const invRes = await pool.query(`SELECT * FROM sales_invoices WHERE invoice_number = $1`, [invoiceNumber]);
    if (invRes.rows.length === 0) return res.status(404).json({ error: "Invoice not found!" });

    const itemsRes = await pool.query(
      `SELECT ii.*, p.name FROM invoice_items ii JOIN products p ON ii.product_id = p.id WHERE ii.invoice_id = $1`,
      [invRes.rows[0].id]
    );

    res.json({ invoice: invRes.rows[0], items: itemsRes.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Process Return & Restock
const processReturn = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { invoice_id, product_id, return_qty } = req.body;

    await client.query(`UPDATE products SET total_stock = total_stock + $1 WHERE id = $2`, [return_qty, product_id]);

    await client.query('COMMIT');
    res.json({ success: true, message: "Item Returned and Inventory Restocked!" });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

module.exports = { getInvoiceDetails, processReturn };