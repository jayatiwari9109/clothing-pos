const pool = require("../config/db");

exports.checkout = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { customer_id, items, subtotal, discount_amount, tax_amount, final_total, payment_method } = req.body;

    const invoiceNumber = "INV-" + Date.now();

    const invoiceRes = await client.query(
      `INSERT INTO sales_invoices (invoice_number, customer_id, subtotal, discount_amount, tax_amount, final_total, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [invoiceNumber, customer_id || null, subtotal, discount_amount || 0, tax_amount || 0, final_total, payment_method]
    );

    const invoice = invoiceRes.rows[0];

    for (let item of items) {
      await client.query(
        `INSERT INTO sales_items (invoice_id, product_id, variant_id, quantity, unit_price, discount, tax, total_price)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [invoice.id, item.product_id, item.variant_id, item.quantity, item.unit_price, item.discount || 0, item.tax || 0, item.total_price]
      );

      if (item.variant_id) {
        await client.query(
          `UPDATE product_variants SET stock_quantity = stock_quantity - $1 WHERE id = $2`,
          [item.quantity, item.variant_id]
        );
      }
    }

    if (payment_method === "CREDIT_UDHAAR" && customer_id) {
      await client.query(
        `UPDATE customers SET credit_balance = credit_balance + $1 WHERE id = $2`,
        [final_total, customer_id]
      );

      await client.query(
        `INSERT INTO customer_ledger (customer_id, transaction_type, amount, invoice_id, notes)
         VALUES ($1, 'SALE_UDHAAR', $2, $3, 'Udhaar purchase via POS')`,
        [customer_id, final_total, invoice.id]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ message: "Sale completed successfully", invoice });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};