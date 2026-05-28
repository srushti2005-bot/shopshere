import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { ordersAPI } from '../../utils/api';
import { formatCurrency, formatDateTime, getStatusColor, getStatusBg } from '../../utils/format';
import './Overview.css';
import './TablePage.css';

const statusFilters = ['all', 'delivered', 'shipped', 'processing', 'pending', 'cancelled'];

const Orders = () => {
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  const { data, loading } = useFetch(
    () => ordersAPI.getOrders({ status: status === 'all' ? undefined : status, page, limit: 20 }),
    [status, page]
  );

  const orders = data?.data || data || [];
  const pagination = data?.pagination;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <div className="sort-tabs" style={{ flexWrap: 'wrap' }}>
          {statusFilters.map(s => (
            <button
              key={s}
              className={`sort-tab ${status === s ? 'active' : ''}`}
              onClick={() => { setStatus(s); setPage(1); }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h3>Recent Orders</h3>
          {pagination && (
            <span className="chart-sub">{pagination.total} total orders</span>
          )}
        </div>

        {loading ? (
          <div className="table-loading">Loading orders...</div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>City</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="mono" style={{ color: '#a78bfa' }}>#{o.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="product-name" style={{ fontSize: '0.8rem' }}>{o.customer_name}</span>
                        {o.is_premium && <span className="premium-badge">PRO</span>}
                      </div>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.75rem' }}>{o.city}</td>
                    <td className="mono">{o.item_count}</td>
                    <td className="mono accent">{formatCurrency(o.total_amount)}</td>
                    <td>
                      <span className="badge">{o.payment_method?.toUpperCase()}</span>
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          color: getStatusColor(o.status),
                          background: getStatusBg(o.status),
                          border: `1px solid ${getStatusColor(o.status)}33`
                        }}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td style={{ color: '#475569', fontSize: '0.72rem' }}>
                      {formatDateTime(o.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pagination && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                >← Prev</button>
                <span className="page-info">Page {page} of {pagination.pages}</span>
                <button
                  className="page-btn"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= pagination.pages}
                >Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;
