const pool = require('../config/db');

// Get all inventory products with category and variant details
const getInventory = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.name, p.sku, p.category_name, p.selling_price, p.cost_price, p.total_stock, p.barcode
      FROM products p
      ORDER BY p.id DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Inventory Fetch Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add New Product
const addProduct = async (req, res) => {
  try {
    const { name, sku, category_name, selling_price, cost_price, total_stock } = req.body;

    if (!name || !sku || !selling_price) {
      return res.status(400).json({ success: false, error: 'Name, SKU, and Selling Price are required!' });
    }

    const result = await pool.query(
      `INSERT INTO products (name, sku, category_name, selling_price, cost_price, total_stock)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, sku, category_name || 'General', selling_price, cost_price || 0, total_stock || 0]
    );

    res.status(201).json({ success: true, product: result.rows[0] });
  } catch (error) {
    console.error('Add Product Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update Product Stock Level
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { adjustment } = req.body; // e.g. +5 or -1

    const result = await pool.query(
      `UPDATE products SET total_stock = GREATEST(0, total_stock + $1) WHERE id = $2 RETURNING *`,
      [adjustment, id]
    );

    res.json({ success: true, product: result.rows[0] });
  } catch (error) {
    console.error('Stock Update Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getInventory, addProduct, updateStock };