const pool = require('../db/connection');

// GET /api/products - with pagination and filters
const getProducts = async (req, res) => {
  try {
    const { category, sort = 'revenue', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params = [];

    if (category) {
      params.push(category);
      whereClause = `WHERE c.name ILIKE $${params.length}`;
    }

    const validSorts = { revenue: 'total_revenue', sold: 'total_sold', rating: 'p.rating', price: 'p.price' };
    const sortCol = validSorts[sort] || 'total_revenue';

    params.push(limit, offset);

    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        c.name AS category,
        p.price,
        p.stock_quantity,
        p.rating,
        COALESCE(SUM(oi.quantity), 0) AS total_sold,
        COALESCE(ROUND(SUM(oi.subtotal)::numeric, 2), 0) AS total_revenue
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN order_items oi ON oi.product_id = p.id
      ${whereClause}
      GROUP BY p.id, p.name, c.name, p.price, p.stock_quantity, p.rating
      ORDER BY ${sortCol} DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `, params);

    const countResult = await pool.query('SELECT COUNT(*) FROM products');
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: result.rows,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/products/top
const getTopProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id, p.name, c.name AS category, p.price, p.rating,
        COALESCE(SUM(oi.quantity), 0) AS total_sold,
        COALESCE(ROUND(SUM(oi.subtotal)::numeric, 2), 0) AS total_revenue
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN order_items oi ON oi.product_id = p.id
      LEFT JOIN orders o ON o.id = oi.order_id AND o.status != 'cancelled'
      GROUP BY p.id, p.name, c.name, p.price, p.rating
      ORDER BY total_revenue DESC
      LIMIT 10
    `);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/products/low-stock
const getLowStock = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.name, c.name AS category, p.stock_quantity, p.price
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.stock_quantity < 100
      ORDER BY p.stock_quantity ASC
    `);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getProducts, getTopProducts, getLowStock };
