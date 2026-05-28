import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { productsAPI } from '../../utils/api';
import { formatCurrency, formatNumber } from '../../utils/format';
import './Overview.css';
import './TablePage.css';

const Products = () => {
  const [sort, setSort] = useState('revenue');
  const { data: products, loading } = useFetch(() => productsAPI.getTopProducts(), [sort]);
  const { data: lowStock } = useFetch(productsAPI.getLowStock);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <div className="sort-tabs">
          {['revenue', 'sold', 'rating'].map(s => (
            <button
              key={s}
              className={`sort-tab ${sort === s ? 'active' : ''}`}
              onClick={() => setSort(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card" style={{ flex: 1 }}>
          <div className="chart-header">
            <h3>Top 10 Products</h3>
            <span className="chart-sub">By Revenue</span>
          </div>
          {loading ? (
            <div className="table-loading">Loading...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {(products || []).map((p, i) => (
                  <tr key={p.id}>
                    <td className="rank">#{i + 1}</td>
                    <td className="product-name">{p.name}</td>
                    <td><span className="badge">{p.category}</span></td>
                    <td className="mono">{formatCurrency(p.price)}</td>
                    <td>
                      <span className="rating">
                        ★ {p.rating}
                      </span>
                    </td>
                    <td className="mono">{formatNumber(p.total_sold)}</td>
                    <td className="mono accent">{formatCurrency(p.total_revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="chart-card" style={{ flex: 0.6, minWidth: 260 }}>
          <div className="chart-header">
            <h3>⚠️ Low Stock Alert</h3>
            <span className="chart-sub">Below 100 units</span>
          </div>
          <div className="low-stock-list">
            {(lowStock || []).map((p) => (
              <div key={p.id} className="low-stock-row">
                <div className="low-stock-info">
                  <div className="low-stock-name">{p.name}</div>
                  <div className="low-stock-cat">{p.category}</div>
                </div>
                <div className={`stock-badge ${p.stock_quantity < 50 ? 'critical' : 'warn'}`}>
                  {p.stock_quantity} left
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
