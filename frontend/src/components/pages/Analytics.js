import React from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useFetch } from '../../hooks/useFetch';
import { analyticsAPI } from '../../utils/api';
import { formatCurrency, formatNumber } from '../../utils/format';
import './Overview.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <div className="tooltip-label">{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color }}>
            {p.name}: {p.name === 'revenue' ? formatCurrency(p.value) : formatNumber(p.value)}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const { data: daily } = useFetch(analyticsAPI.getDailyTrend);
  const { data: monthly } = useFetch(analyticsAPI.getMonthlyRevenue);
  const { data: cities } = useFetch(analyticsAPI.getTopCities);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <span className="page-time">Deep-dive reports</span>
      </div>

      {/* Daily Trend */}
      <div className="chart-card" style={{ marginBottom: 20 }}>
        <div className="chart-header">
          <h3>Daily Revenue — Last 30 Days</h3>
          <span className="chart-sub">Trend analysis</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={daily || []} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2130" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }}
              tickFormatter={(v) => new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" name="revenue" stroke="#a78bfa" strokeWidth={2} fill="url(#revenueGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="charts-row">
        {/* Monthly Orders */}
        <div className="chart-card wide">
          <div className="chart-header">
            <h3>Monthly Order Volume</h3>
            <span className="chart-sub">12-month view</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly || []} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2130" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total_orders" name="orders" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Cities */}
        <div className="chart-card narrow">
          <div className="chart-header">
            <h3>Top Cities by Revenue</h3>
            <span className="chart-sub">Customer locations</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
            {(cities || []).slice(0, 8).map((city, i) => {
              const maxRev = cities[0]?.revenue || 1;
              const pct = ((city.revenue / maxRev) * 100).toFixed(0);
              return (
                <div key={city.city} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 16, color: '#475569', fontSize: '0.68rem', fontFamily: 'Space Mono, monospace', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ width: 72, fontSize: '0.75rem', color: '#cbd5e1', flexShrink: 0 }}>{city.city}</div>
                  <div style={{ flex: 1, height: 5, background: '#0f1117', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: '#4ade80', borderRadius: 3 }} />
                  </div>
                  <div style={{ width: 72, textAlign: 'right', fontSize: '0.7rem', fontFamily: 'Space Mono, monospace', color: '#a78bfa', flexShrink: 0 }}>
                    {formatCurrency(city.revenue)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
