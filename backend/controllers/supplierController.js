const pool = require("../config/db");

exports.createSupplier = async (req, res) => {
  const { name, company_name, phone, email, address, gst_number } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO suppliers (name, company_name, phone, email, address, gst_number)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, company_name, phone, email || null, address || null, gst_number || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSuppliers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM suppliers ORDER BY name ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPurchaseOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { supplier_id, invoice_no, total_amount, items } = req.body;

    const purchaseRes = await client.query(
      `INSERT INTO purchases (supplier_id, invoice_no, total_amount, payment_status)
       VALUES ($1, $2, $3, 'PAID') RETURNING *`,
      [supplier_id, invoice_no, total_amount]
    );

    const purchase = purchaseRes.rows[0];

    for (let item of items) {
      await client.query(
        `INSERT INTO purchase_items (purchase_id, product_id, variant_id, quantity, cost_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [purchase.id, item.product_id, item.variant_id, item.quantity, item.cost_price]
      );

      if (item.variant_id) {
        await client.query(
          `UPDATE product_variants SET stock_quantity = stock_quantity + $1 WHERE id = $2`,
          [item.quantity, item.variant_id]
        );
      }
    }

    await client.query("COMMIT");
    res.status(201).json({ message: "Stock Inward Purchase recorded & inventory updated!", purchase });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};