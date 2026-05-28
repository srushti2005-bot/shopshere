import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error?.response?.data || error.message);
    return Promise.reject(error?.response?.data || { error: 'Network error' });
  }
);

export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview'),
  getMonthlyRevenue: () => api.get('/analytics/monthly-revenue'),
  getCategorySales: () => api.get('/analytics/category-sales'),
  getOrderStatus: () => api.get('/analytics/order-status'),
  getPaymentMethods: () => api.get('/analytics/payment-methods'),
  getTopCities: () => api.get('/analytics/top-cities'),
  getDailyTrend: () => api.get('/analytics/daily-trend'),
  getAIInsights: () => api.get('/analytics/ai-insights'),
};

export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getTopProducts: () => api.get('/products/top'),
  getLowStock: () => api.get('/products/low-stock'),
};

export const ordersAPI = {
  getOrders: (params) => api.get('/orders', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
};

export const customersAPI = {
  getCustomers: (params) => api.get('/customers', { params }),
  getCustomerStats: () => api.get('/customers/stats'),
  getTopCustomers: () => api.get('/customers/top'),
};

export default api;
