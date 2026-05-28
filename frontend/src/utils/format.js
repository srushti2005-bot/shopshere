export const formatCurrency = (value, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);
};

export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-IN').format(value || 0);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

export const getStatusColor = (status) => {
  const map = {
    delivered: '#4ade80',
    shipped: '#60a5fa',
    processing: '#fbbf24',
    pending: '#94a3b8',
    cancelled: '#f87171',
  };
  return map[status] || '#94a3b8';
};

export const getStatusBg = (status) => {
  const map = {
    delivered: 'rgba(74,222,128,0.12)',
    shipped: 'rgba(96,165,250,0.12)',
    processing: 'rgba(251,191,36,0.12)',
    pending: 'rgba(148,163,184,0.12)',
    cancelled: 'rgba(248,113,113,0.12)',
  };
  return map[status] || 'rgba(148,163,184,0.12)';
};
