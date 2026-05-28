const pool = require('../db/connection');

// GET /api/orders - paginated recent orders
const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 15, status } = req.query;
    const offset = (page - 1) * limit;
    const params = [];
    let whereClause = '';

    if (status) {
      params.push(status);
      whereClause = `WHERE o.status = $${params.length}`;
    }

    params.push(limit, offset);

    const result = await pool.query(`
      SELECT
        o.id,
        o.total_amount,
        o.status,
        o.payment_method,
        o.created_at,
        cu.name AS customer_name,
        cu.city,
        cu.is_premium,
        COUNT(oi.id) AS item_count
      FROM orders o
      JOIN customers cu ON cu.id = o.customer_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      ${whereClause}
      GROUP BY o.id, o.total_amount, o.status, o.payment_method, o.created_at,
               cu.name, cu.city, cu.is_premium
      ORDER BY o.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `, params);

    const countQuery = status
      ? pool.query('SELECT COUNT(*) FROM orders WHERE status = $1', [status])
      : pool.query('SELECT COUNT(*) FROM orders');
    const countResult = await countQuery;
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

// GET /api/orders/:id - order details
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const orderResult = await pool.query(`
      SELECT o.*, cu.name AS customer_name, cu.email, cu.city, cu.is_premium
      FROM orders o JOIN customers cu ON cu.id = o.customer_id
      WHERE o.id = $1
    `, [id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const itemsResult = await pool.query(`
      SELECT oi.quantity, oi.unit_price, oi.subtotal, p.name AS product_name, c.name AS category
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE oi.order_id = $1
    `, [id]);

    res.json({ success: true, data: { ...orderResult.rows[0], items: itemsResult.rows } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getOrders, getOrderById };
