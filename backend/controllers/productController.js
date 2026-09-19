const pool = require("../config/db");

exports.createProduct = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { name, sku, barcode, category, brand, purchase_price, selling_price, tax_rate, variants } = req.body;

    const productResult = await client.query(
      `INSERT INTO products (name, sku, barcode, category, brand, purchase_price, selling_price, tax_rate)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, sku, barcode, category, brand, purchase_price, selling_price, tax_rate || 5.00]
    );

    const product = productResult.rows[0];

    if (variants && variants.length > 0) {
      for (let v of variants) {
        await client.query(
          `INSERT INTO product_variants (product_id, size, color, stock_quantity)
           VALUES ($1, $2, $3, $4)`,
          [product.id, v.size, v.color, v.stock_quantity || 0]
        );
      }
    }

    await client.query("COMMIT");
    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const query = `
      SELECT p.*, COALESCE(json_agg(pv.*) FILTER (WHERE pv.id IS NOT NULL), '[]') as variants
      FROM products p
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      GROUP BY p.id ORDER BY p.id DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};