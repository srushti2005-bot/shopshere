const pool = require('../db/connection');

// GET /api/analytics/overview
const getOverview = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM orders WHERE status != 'cancelled') AS total_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status != 'cancelled') AS total_revenue,
        (SELECT COUNT(*) FROM customers) AS total_customers,
        (SELECT COUNT(*) FROM products) AS total_products,
        (SELECT COALESCE(AVG(total_amount), 0) FROM orders WHERE status != 'cancelled') AS avg_order_value,
        (SELECT COUNT(*) FROM orders WHERE status = 'pending') AS pending_orders,
        (SELECT COUNT(*) FROM orders 
         WHERE created_at >= NOW() - INTERVAL '30 days' AND status != 'cancelled') AS orders_this_month,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders 
         WHERE created_at >= NOW() - INTERVAL '30 days' AND status != 'cancelled') AS revenue_this_month
    `);

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/analytics/monthly-revenue
const getMonthlyRevenue = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YYYY') AS month,
        DATE_TRUNC('month', created_at) AS month_date,
        COUNT(*) AS total_orders,
        ROUND(SUM(total_amount)::numeric, 2) AS revenue,
        ROUND(AVG(total_amount)::numeric, 2) AS avg_order_value
      FROM orders
      WHERE status != 'cancelled'
        AND created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month_date ASC
    `);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/analytics/category-sales
const getCategorySales = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.name AS category,
        COUNT(DISTINCT o.id) AS orders,
        SUM(oi.quantity) AS units_sold,
        ROUND(SUM(oi.subtotal)::numeric, 2) AS revenue
      FROM categories c
      JOIN products p ON p.category_id = c.id
      JOIN order_items oi ON oi.product_id = p.id
      JOIN orders o ON o.id = oi.order_id
      WHERE o.status != 'cancelled'
      GROUP BY c.name
      ORDER BY revenue DESC
    `);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/analytics/order-status
const getOrderStatus = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        status,
        COUNT(*) AS count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage
      FROM orders
      GROUP BY status
      ORDER BY count DESC
    `);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/analytics/payment-methods
const getPaymentMethods = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        payment_method,
        COUNT(*) AS count,
        ROUND(SUM(total_amount)::numeric, 2) AS revenue,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage
      FROM orders
      WHERE status != 'cancelled'
      GROUP BY payment_method
      ORDER BY count DESC
    `);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/analytics/top-cities
const getTopCities = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        cu.city,
        COUNT(DISTINCT o.id) AS orders,
        COUNT(DISTINCT cu.id) AS customers,
        ROUND(SUM(o.total_amount)::numeric, 2) AS revenue
      FROM customers cu
      JOIN orders o ON o.customer_id = cu.id
      WHERE o.status != 'cancelled'
      GROUP BY cu.city
      ORDER BY revenue DESC
      LIMIT 10
    `);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/analytics/daily-trend (last 30 days)
const getDailyTrend = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        DATE(created_at) AS date,
        COUNT(*) AS orders,
        ROUND(SUM(total_amount)::numeric, 2) AS revenue
      FROM orders
      WHERE status != 'cancelled'
        AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/analytics/ai-insights
const getAIInsights = async (req, res) => {
  try {
    // Gather data for AI analysis
    const [revenue, categories, status] = await Promise.all([
      pool.query(`
        SELECT TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') AS month,
          ROUND(SUM(total_amount)::numeric, 2) AS revenue
        FROM orders WHERE status != 'cancelled' AND created_at >= NOW() - INTERVAL '3 months'
        GROUP BY DATE_TRUNC('month', created_at) ORDER BY DATE_TRUNC('month', created_at)
      `),
      pool.query(`
        SELECT c.name AS category, ROUND(SUM(oi.subtotal)::numeric, 2) AS revenue
        FROM categories c JOIN products p ON p.category_id = c.id
        JOIN order_items oi ON oi.product_id = p.id JOIN orders o ON o.id = oi.order_id
        WHERE o.status != 'cancelled' GROUP BY c.name ORDER BY revenue DESC LIMIT 3
      `),
      pool.query(`
        SELECT status, COUNT(*) AS count FROM orders GROUP BY status ORDER BY count DESC
      `)
    ]);

    const summaryData = {
      monthlyRevenue: revenue.rows,
      topCategories: categories.rows,
      orderStatus: status.rows,
    };

    // Static AI insights (replace with actual Anthropic API call in production)
    const insights = generateInsights(summaryData);

    res.json({ success: true, data: insights, rawData: summaryData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

function generateInsights(data) {
  const insights = [];

  if (data.monthlyRevenue.length >= 2) {
    const latest = data.monthlyRevenue[data.monthlyRevenue.length - 1];
    const prev = data.monthlyRevenue[data.monthlyRevenue.length - 2];
    if (latest && prev) {
      const growth = (((latest.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1);
      const trend = growth > 0 ? '📈 Growing' : '📉 Declining';
      insights.push({
        type: growth > 0 ? 'positive' : 'warning',
        title: `Revenue ${trend}`,
        message: `Revenue ${growth > 0 ? 'grew' : 'declined'} by ${Math.abs(growth)}% from ${prev.month} to ${latest.month}. ${growth > 0 ? 'Maintain momentum with targeted campaigns.' : 'Consider promotional offers to boost sales.'}`,
      });
    }
  }

  if (data.topCategories.length > 0) {
    insights.push({
      type: 'info',
      title: '🏆 Top Revenue Driver',
      message: `"${data.topCategories[0].category}" is your best-performing category with ₹${Number(data.topCategories[0].revenue).toLocaleString('en-IN')} in revenue. Consider expanding its product range.`,
    });
  }

  const cancelledOrders = data.orderStatus.find(s => s.status === 'cancelled');
  const totalOrders = data.orderStatus.reduce((sum, s) => sum + parseInt(s.count), 0);
  if (cancelledOrders) {
    const cancelRate = ((cancelledOrders.count / totalOrders) * 100).toFixed(1);
    insights.push({
      type: cancelRate > 10 ? 'warning' : 'positive',
      title: cancelRate > 10 ? '⚠️ High Cancellation Rate' : '✅ Healthy Cancellation Rate',
      message: `Cancellation rate is ${cancelRate}%. ${cancelRate > 10 ? 'Investigate common cancellation reasons — this may indicate checkout friction or delivery delays.' : 'Your fulfillment process is working well. Keep it up!'}`,
    });
  }

  insights.push({
    type: 'info',
    title: '💡 Recommendation',
    message: 'Premium customers account for a disproportionate share of revenue. Consider a loyalty program with early access to new products to retain them long-term.',
  });

  return insights;
}

module.exports = {
  getOverview,
  getMonthlyRevenue,
  getCategorySales,
  getOrderStatus,
  getPaymentMethods,
  getTopCities,
  getDailyTrend,
  getAIInsights,
};
