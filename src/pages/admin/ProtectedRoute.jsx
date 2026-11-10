import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { Loader2 } from 'lucide-react';
import './admin.css';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoadingAuth } = usePortfolio();
  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="admin-login-wrap" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--admin-text-muted)' }}>
          <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 12px', color: '#3b82f6' }} />
          <p style={{ fontSize: 14 }}>Verifying administrator session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
