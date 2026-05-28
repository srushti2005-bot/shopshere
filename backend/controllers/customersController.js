const pool = require('../db/connection');

// GET /api/customers - paginated
const getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 15, premium } = req.query;
    const offset = (page - 1) * limit;
    const params = [];
    let whereClause = '';

    if (premium !== undefined) {
      params.push(premium === 'true');
      whereClause = `WHERE cu.is_premium = $${params.length}`;
    }

    params.push(limit, offset);

    const result = await pool.query(`
      SELECT
        cu.id, cu.name, cu.email, cu.city, cu.is_premium, cu.joined_at,
        COUNT(DISTINCT o.id) AS total_orders,
        COALESCE(ROUND(SUM(o.total_amount)::numeric, 2), 0) AS total_spent,
        MAX(o.created_at) AS last_order_date
      FROM customers cu
      LEFT JOIN orders o ON o.customer_id = cu.id AND o.status != 'cancelled'
      ${whereClause}
      GROUP BY cu.id, cu.name, cu.email, cu.city, cu.is_premium, cu.joined_at
      ORDER BY total_spent DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `, params);

    const countResult = await pool.query('SELECT COUNT(*) FROM customers');
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

// GET /api/customers/stats
const getCustomerStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) AS total_customers,
        SUM(CASE WHEN is_premium THEN 1 ELSE 0 END) AS premium_customers,
        SUM(CASE WHEN joined_at >= NOW() - INTERVAL '30 days' THEN 1 ELSE 0 END) AS new_this_month,
        (SELECT city FROM customers GROUP BY city ORDER BY COUNT(*) DESC LIMIT 1) AS top_city
      FROM customers
    `);

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/customers/top
const getTopCustomers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        cu.id, cu.name, cu.email, cu.city, cu.is_premium,
        COUNT(o.id) AS total_orders,
        ROUND(SUM(o.total_amount)::numeric, 2) AS total_spent
      FROM customers cu
      JOIN orders o ON o.customer_id = cu.id
      WHERE o.status != 'cancelled'
      GROUP BY cu.id, cu.name, cu.email, cu.city, cu.is_premium
      ORDER BY total_spent DESC
      LIMIT 10
    `);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getCustomers, getCustomerStats, getTopCustomers };
