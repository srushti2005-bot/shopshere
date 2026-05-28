import React from 'react';
import { useFetch } from '../../hooks/useFetch';
import { analyticsAPI } from '../../utils/api';
import { formatCurrency } from '../../utils/format';
import './Overview.css';
import './Insights.css';

const typeConfig = {
  positive: { border: '#4ade80', bg: 'rgba(74,222,128,0.06)', icon: '✅' },
  warning: { border: '#fbbf24', bg: 'rgba(251,191,36,0.06)', icon: '⚠️' },
  info: { border: '#60a5fa', bg: 'rgba(96,165,250,0.06)', icon: '💡' },
};

const Insights = () => {
  const { data: insights, loading, error } = useFetch(analyticsAPI.getAIInsights);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">AI Insights</h1>
        <span className="page-time">Powered by business analytics</span>
      </div>

      <div className="insights-header-card">
        <div className="insights-icon">◆</div>
        <div>
          <div className="insights-title">Smart Business Analysis</div>
          <div className="insights-desc">
            Automated analysis of your sales data, order patterns, and customer behaviour — surfacing actionable recommendations to grow your store.
          </div>
        </div>
      </div>

      {loading && (
        <div className="insights-loading">
          <div className="loading-spinner" />
          <div>Analysing your data...</div>
        </div>
      )}

      {error && (
        <div className="insight-card" style={{ borderColor: '#f87171', background: 'rgba(248,113,113,0.06)' }}>
          <div className="insight-title">⚠️ Could not load insights</div>
          <div className="insight-message">{error}</div>
        </div>
      )}

      <div className="insights-grid">
        {(insights || []).map((insight, i) => {
          const cfg = typeConfig[insight.type] || typeConfig.info;
          return (
            <div
              key={i}
              className="insight-card"
              style={{ borderColor: cfg.border, background: cfg.bg }}
            >
              <div className="insight-icon">{cfg.icon}</div>
              <div className="insight-title">{insight.title}</div>
              <div className="insight-message">{insight.message}</div>
            </div>
          );
        })}
      </div>

      {insights?.rawData && (
        <div className="chart-card" style={{ marginTop: 24 }}>
          <div className="chart-header">
            <h3>Data Summary Used for Analysis</h3>
            <span className="chart-sub">Last 3 months</span>
          </div>
          <div className="raw-data-grid">
            <div>
              <div className="raw-label">Top Categories</div>
              {insights.rawData.topCategories?.map((c, i) => (
                <div key={i} className="raw-row">
                  <span>{c.category}</span>
                  <span className="mono" style={{ color: '#a78bfa' }}>{formatCurrency(c.revenue)}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="raw-label">Order Status Breakdown</div>
              {insights.rawData.orderStatus?.map((s, i) => (
                <div key={i} className="raw-row">
                  <span style={{ textTransform: 'capitalize' }}>{s.status}</span>
                  <span className="mono" style={{ color: '#60a5fa' }}>{s.count} orders</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;
