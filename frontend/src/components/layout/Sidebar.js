import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  { path: '/', label: 'Overview', icon: '◈' },
  { path: '/analytics', label: 'Analytics', icon: '◉' },
  { path: '/products', label: 'Products', icon: '▣' },
  { path: '/orders', label: 'Orders', icon: '◎' },
  { path: '/customers', label: 'Customers', icon: '◐' },
  { path: '/insights', label: 'AI Insights', icon: '◆' },
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">◈</span>
        <div>
          <div className="brand-name">ShopSphere</div>
          <div className="brand-sub">Analytics</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">DASHBOARD</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="footer-badge">
          <span className="status-dot"></span>
          <span>Live Data</span>
        </div>
        <div className="footer-ver">v1.0.0</div>
      </div>
    </aside>
  );
};

export default Sidebar;
