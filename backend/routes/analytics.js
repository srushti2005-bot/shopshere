const express = require('express');
const router = express.Router();
const {
  getOverview,
  getMonthlyRevenue,
  getCategorySales,
  getOrderStatus,
  getPaymentMethods,
  getTopCities,
  getDailyTrend,
  getAIInsights,
} = require('../controllers/analyticsController');

router.get('/overview', getOverview);
router.get('/monthly-revenue', getMonthlyRevenue);
router.get('/category-sales', getCategorySales);
router.get('/order-status', getOrderStatus);
router.get('/payment-methods', getPaymentMethods);
router.get('/top-cities', getTopCities);
router.get('/daily-trend', getDailyTrend);
router.get('/ai-insights', getAIInsights);

module.exports = router;
