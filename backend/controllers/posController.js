const pool = require('../config/db');

// 1. Process POS Checkout & Save Invoice to Database
const processCheckout = async (req, res) => {
  const client = await pool.connect();
  try {
    const { customer_id, items, subtotal, tax_amount, final_total, payment_method } = req.body;

    await client.query('BEGIN');

    // Generate Invoice Number
    const invNumber = `INV-${Date.now().toString().slice(-6)}`;

    // Insert Invoice Entry
    const invoiceRes = await client.query(
      `INSERT INTO sales_invoices (invoice_number, customer_id, subtotal, tax_amount, grand_total, payment_status, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        invNumber,
        customer_id || null,
        subtotal || 0,
        tax_amount || 0,
        final_total || 0,
        payment_method === 'CREDIT_UDHAAR' ? 'UNPAID' : 'PAID',
        payment_method
      ]
    );

    const invoice = invoiceRes.rows[0];

    // Insert Invoice Items & Deduct Stock
    for (const item of items) {
      await client.query(
        `INSERT INTO invoice_items (invoice_id, product_id, variant_id, quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [invoice.id, item.id || null, item.variant_id || null, item.qty, item.price, item.total]
      );

      // Decrement Variant Stock if variant_id exists
      if (item.variant_id) {
        await client.query(
          `UPDATE product_variants SET stock_quantity = GREATEST(0, stock_quantity - $1) WHERE id = $2`,
          [item.qty, item.variant_id]
        );
      }
    }

    // If Payment Mode is UDHAAR, update Customer Balance Ledger
    if (payment_method === 'CREDIT_UDHAAR' && customer_id) {
      await client.query(
        `UPDATE customers SET current_balance = current_balance + $1 WHERE id = $2`,
        [final_total, customer_id]
      );

      await client.query(
        `INSERT INTO customer_ledger (customer_id, transaction_type, amount, balance_after, reference_id)
         VALUES ($1, 'DEBIT_UDHAAR', $2, (SELECT current_balance FROM customers WHERE id = $1), $3)`,
        [customer_id, final_total, invoice.id]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Sale Completed Successfully!',
      invoice
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Checkout Error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
};

module.exports = { processCheckout };