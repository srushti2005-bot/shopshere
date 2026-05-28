import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import StatCard from '../layout/StatCard';
import { useFetch } from '../../hooks/useFetch';
import { analyticsAPI } from '../../utils/api';
import { formatCurrency, formatNumber, formatDateTime, getStatusColor, getStatusBg } from '../../utils/format';
import './Overview.css';

const COLORS = ['#a78bfa', '#60a5fa', '#4ade80', '#fbbf24', '#f87171', '#34d399'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <div className="tooltip-label">{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color }}>
            {p.name}: {p.name === 'revenue' || p.name === 'Revenue'
              ? formatCurrency(p.value)
              : formatNumber(p.value)}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Overview = () => {
  const { data: overview, loading: ovLoading } = useFetch(analyticsAPI.getOverview);
  const { data: monthly } = useFetch(analyticsAPI.getMonthlyRevenue);
  const { data: categories } = useFetch(analyticsAPI.getCategorySales);
  const { data: statusData } = useFetch(analyticsAPI.getOrderStatus);
  const { data: orders } = useFetch(() => analyticsAPI.getPaymentMethods());

  const statsConfig = [
    {
      title: 'Total Revenue',
      value: formatCurrency(overview?.total_revenue),
      sub: `This month: ${formatCurrency(overview?.revenue_this_month)}`,
      icon: '₹',
      accent: '#a78bfa',
    },
    {
      title: 'Total Orders',
      value: formatNumber(overview?.total_orders),
      sub: `This month: ${formatNumber(overview?.orders_this_month)}`,
      icon: '📦',
      accent: '#60a5fa',
    },
    {
      title: 'Customers',
      value: formatNumber(overview?.total_customers),
      sub: 'All registered users',
      icon: '👤',
      accent: '#4ade80',
    },
    {
      title: 'Avg Order Value',
      value: formatCurrency(overview?.avg_order_value),
      sub: `${overview?.pending_orders} orders pending`,
      icon: '◎',
      accent: '#fbbf24',
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Overview</h1>
        <span className="page-time">Last updated: {new Date().toLocaleTimeString('en-IN')}</span>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        {statsConfig.map((s, i) => (
          <StatCard key={i} {...s} loading={ovLoading} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Monthly Revenue */}
        <div className="chart-card wide">
          <div className="chart-header">
            <h3>Monthly Revenue & Orders</h3>
            <span className="chart-sub">Last 12 months</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthly || []} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2130" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#a78bfa" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="total_orders" name="Orders" stroke="#60a5fa" strokeWidth={2} dot={false} yAxisId={1} hide />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie */}
        <div className="chart-card narrow">
          <div className="chart-header">
            <h3>Order Status</h3>
            <span className="chart-sub">All time</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData || []}
                cx="50%" cy="50%"
                innerRadius={55}
                outerRadius={80}
                dataKey="count"
                nameKey="status"
                paddingAngle={3}
              >
                {(statusData || []).map((entry, index) => (
                  <Cell key={index} fill={getStatusColor(entry.status)} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatNumber(v)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="status-legend">
            {(statusData || []).map((s, i) => (
              <div key={i} className="legend-item">
                <span className="legend-dot" style={{ background: getStatusColor(s.status) }} />
                <span className="legend-label">{s.status}</span>
                <span className="legend-pct">{s.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category & Payment Row */}
      <div className="charts-row">
        <div className="chart-card wide">
          <div className="chart-header">
            <h3>Revenue by Category</h3>
            <span className="chart-sub">Total sales</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categories || []} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2130" />
              <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue" radius={[6, 6, 0, 0]}>
                {(categories || []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card narrow">
          <div className="chart-header">
            <h3>Payment Methods</h3>
            <span className="chart-sub">Distribution</span>
          </div>
          <div className="payment-list">
            {(orders || []).map((p, i) => (
              <div key={i} className="payment-row">
                <div className="payment-info">
                  <span className="payment-name">{p.payment_method.toUpperCase()}</span>
                  <span className="payment-count">{formatNumber(p.count)} orders</span>
                </div>
                <div className="payment-bar-wrap">
                  <div
                    className="payment-bar-fill"
                    style={{ width: `${p.percentage}%`, background: COLORS[i] }}
                  />
                </div>
                <span className="payment-pct">{p.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
