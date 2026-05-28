import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, sub, icon, accent = '#a78bfa', loading }) => {
  if (loading) {
    return (
      <div className="stat-card skeleton">
        <div className="sk-line short" />
        <div className="sk-line long" />
        <div className="sk-line short" />
      </div>
    );
  }

  return (
    <div className="stat-card" style={{ '--accent': accent }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
};

export default StatCard;
