import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Eye, EyeOff, Lock, User, ArrowLeft, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import './admin.css';

export default function AdminLogin() {
  const [idOrEmail, setIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login, isAuthenticated, isLoadingAuth } = usePortfolio();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoadingAuth, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!idOrEmail.trim()) {
      setErrorMsg('Please enter your Administrator ID or Email.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    if (!isSupabaseConfigured()) {
      setErrorMsg(
        'Supabase is not configured yet. Please check supabase/setup_guide.md and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
      );
      return;
    }

    setIsLoading(true);

    try {
      await login(idOrEmail, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.message || 'Authentication failed. Please verify your ID and password.';
      if (msg.toLowerCase().includes('invalid login credentials') || msg.toLowerCase().includes('invalid_grant')) {
        setErrorMsg('Invalid Administrator ID or password.');
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-box">
        <div className="admin-login__logo">
          <ShieldCheck size={28} />
        </div>

        <h1 className="admin-login__title">Admin Portal</h1>
        <p className="admin-login__subtitle">
          Sign in with your Administrator ID to access the portfolio dashboard.
        </p>

        {!isSupabaseConfigured() && (
          <div className="admin-login__alert admin-login__alert--info">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>Setup Notice:</strong> Supabase environment variables are pending. Configure your free Supabase project to authenticate.
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="admin-login__alert admin-login__alert--error" role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group" style={{ marginBottom: 18 }}>
            <label className="admin-label">
              <span>Administrator ID or Email</span>
            </label>
            <div className="admin-password-wrap">
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. yash or your email"
                value={idOrEmail}
                onChange={(e) => setIdOrEmail(e.target.value)}
                autoComplete="username"
                required
                disabled={isLoading}
              />
              <span className="admin-toggle-pwd" style={{ cursor: 'default' }}>
                <User size={16} />
              </span>
            </div>
          </div>

          <div className="admin-form-group" style={{ marginBottom: 24 }}>
            <label className="admin-label">
              <span>Password</span>
            </label>
            <div className="admin-password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                className="admin-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="admin-toggle-pwd"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn--primary"
            style={{ width: '100%', padding: '11px', fontSize: '14.5px' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Authenticating...
              </>
            ) : (
              <>
                <Lock size={16} /> Sign In to Dashboard
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              color: 'var(--admin-text-muted)',
              textDecoration: 'none',
              fontSize: '13px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <ArrowLeft size={14} /> Return to public portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
