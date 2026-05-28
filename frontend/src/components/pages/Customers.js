import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { customersAPI } from '../../utils/api';
import { formatCurrency, formatNumber, formatDate } from '../../utils/format';
import './Overview.css';
import './TablePage.css';

const Customers = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useFetch(
    () => customersAPI.getCustomers({ page, limit: 20 }),
    [page]
  );
  const { data: stats } = useFetch(customersAPI.getCustomerStats);

  const customers = data?.data || data || [];
  const pagination = data?.pagination;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Customers</h1>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Customers', value: formatNumber(stats?.total_customers), icon: '👤' },
          { label: 'Premium Members', value: formatNumber(stats?.premium_customers), icon: '⭐' },
          { label: 'New This Month', value: formatNumber(stats?.new_this_month), icon: '🆕' },
          { label: 'Top City', value: stats?.top_city || '—', icon: '📍' },
        ].map((s, i) => (
          <div className="stat-card" key={i} style={{ '--accent': '#60a5fa' }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-title" style={{ fontSize: '0.72rem', color: '#64748b', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h3>All Customers</h3>
          {pagination && <span className="chart-sub">{pagination.total} registered</span>}
        </div>

        {loading ? (
          <div className="table-loading">Loading customers...</div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Type</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Joined</th>
                  <th>Last Order</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td className="product-name" style={{ fontSize: '0.8rem' }}>{c.name}</td>
                    <td style={{ color: '#64748b', fontSize: '0.72rem' }}>{c.email}</td>
                    <td style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{c.city}</td>
                    <td>
                      {c.is_premium
                        ? <span className="premium-badge">PREMIUM</span>
                        : <span style={{ color: '#475569', fontSize: '0.68rem' }}>Standard</span>
                      }
                    </td>
                    <td className="mono">{formatNumber(c.total_orders)}</td>
                    <td className="mono accent">{formatCurrency(c.total_spent)}</td>
                    <td style={{ color: '#475569', fontSize: '0.72rem' }}>{formatDate(c.joined_at)}</td>
                    <td style={{ color: '#475569', fontSize: '0.72rem' }}>
                      {c.last_order_date ? formatDate(c.last_order_date) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pagination && (
              <div className="pagination">
                <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Prev</button>
                <span className="page-info">Page {page} of {pagination.pages}</span>
                <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page >= pagination.pages}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Customers;
