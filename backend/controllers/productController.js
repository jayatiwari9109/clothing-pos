const pool = require('../config/db');

exports.createSaleInvoice = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      customer_id,
      items, // Array of { product_id, variant_id, quantity, unit_price, discount, tax, total_price }
      subtotal,
      discount_amount,
      tax_amount,
      final_total,
      payment_method
    } = req.body;

    const cashier_id = req.user.id;
    const invoice_number = 'INV-' + Date.now();

    // 1. Create Sales Invoice
    const invoiceRes = await client.query(
      `INSERT INTO sales_invoices 
       (invoice_number, customer_id, cashier_id, subtotal, discount_amount, tax_amount, final_total, payment_method, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        invoice_number,
        customer_id || null,
        cashier_id,
        subtotal,
        discount_amount || 0.00,
        tax_amount || 0.00,
        final_total,
        payment_method,
        payment_method === 'CREDIT_UDHAAR' ? 'PENDING' : 'PAID'
      ]
    );

    const invoice = invoiceRes.rows[0];

    // 2. Insert Invoice Items and Deduct Inventory Stock
    for (let item of items) {
      // Check available variant stock
      const variantRes = await client.query(
        'SELECT stock_quantity FROM product_variants WHERE id = $1 FOR UPDATE',
        [item.variant_id]
      );

      if (variantRes.rows.length === 0 || variantRes.rows[0].stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for variant ID: ${item.variant_id}`);
      }

      // Insert line item
      await client.query(
        `INSERT INTO sales_invoice_items 
         (invoice_id, product_id, variant_id, quantity, unit_price, discount, tax, total_price)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          invoice.id,
          item.product_id,
          item.variant_id,
          item.quantity,
          item.unit_price,
          item.discount || 0.00,
          item.tax || 0.00,
          item.total_price
        ]
      );

      // Auto-deduct variant stock
      await client.query(
        `UPDATE product_variants 
         SET stock_quantity = stock_quantity - $1 
         WHERE id = $2`,
        [item.quantity, item.variant_id]
      );
    }

    // 3. Handle Udhaar / Credit Ledger if payment_method is CREDIT_UDHAAR
    if (payment_method === 'CREDIT_UDHAAR' && customer_id) {
      await client.query(
        `UPDATE customers SET credit_balance = credit_balance + $1 WHERE id = $2`,
        [final_total, customer_id]
      );

      await client.query(
        `INSERT INTO customer_ledger (customer_id, invoice_id, transaction_type, amount, notes)
         VALUES ($1, $2, 'CREDIT_GIVEN', $3, $4)`,
        [customer_id, invoice.id, final_total, `Credit sale for invoice ${invoice_number}`]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Checkout successful', invoice });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};