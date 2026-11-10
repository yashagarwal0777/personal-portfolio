import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { Eye, EyeOff, Loader2, AlertCircle, ExternalLink } from 'lucide-react';

export default function IncognitoView({ onClose, onSaveNotification }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = usePortfolio();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password) {
      setErrorMsg('Please enter both Administrator ID and Password.');
      return;
    }

    if (!isSupabaseConfigured()) {
      setErrorMsg(
        'Supabase is not configured yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to log in.'
      );
      return;
    }

    setIsLoading(true);

    try {
      await login(username, password);
      if (onSaveNotification) {
        onSaveNotification('Authenticated successfully! Redirecting to Dashboard...');
      }
      onClose();
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Incognito login error:', err);
      const msg = err.message || '';
      if (
        msg.toLowerCase().includes('invalid login credentials') ||
        msg.toLowerCase().includes('invalid_grant')
      ) {
        setErrorMsg('Invalid Administrator ID or password.');
      } else {
        setErrorMsg(msg || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="incog-screen" role="dialog" aria-modal="true" aria-label="Incognito Mode">
      <div className="incog__box">
        <span className="incog__badge">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="31" fill="#DDDEE0" />
            <path className="hat" d="M20 31l4-13c1-3 3-4 5-3l3 1.5L35 15c2-1 4 0 5 3l4 13z" />
            <rect className="hat" x="15" y="31" width="34" height="3.4" rx="1.7" />
            <circle className="specs" cx="24" cy="43" r="6.4" />
            <circle className="specs" cx="40" cy="43" r="6.4" />
            <path className="specs" d="M30.4 43h3.2" />
          </svg>
        </span>

        <h2 className="incog__title">You are in incognito mode now</h2>
        <p className="incog__sub">Private area — sign in to access Admin Dashboard.</p>

        {!isSupabaseConfigured() && (
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 12,
              color: '#fbbf24',
              marginBottom: 16,
              textAlign: 'left',
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>Supabase setup pending. Follow supabase/setup_guide.md to link free backend.</span>
          </div>
        )}

        <form className="ilogin" onSubmit={handleSubmit}>
          <label className="ifield">
            <span>Administrator ID or Email</span>
            <input
              type="text"
              placeholder="e.g. yash or your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              disabled={isLoading}
            />
          </label>

          <label className="ifield" style={{ position: 'relative' }}>
            <span>Password</span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={isLoading}
              style={{ paddingRight: 40 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: 'absolute',
                right: 12,
                top: 32,
                background: 'transparent',
                border: 'none',
                color: '#999',
                cursor: 'pointer',
              }}
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </label>

          {errorMsg && (
            <p className="ierror" style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <AlertCircle size={14} /> {errorMsg}
            </p>
          )}

          <button className="ibtn" type="submit" disabled={isLoading}>
            {isLoading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Loader2 size={16} className="animate-spin" /> SIGNING IN...
              </span>
            ) : (
              'SIGN IN TO DASHBOARD'
            )}
          </button>
        </form>

        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="iback" onClick={onClose}>
            ← leave incognito
          </button>
          <button
            className="iback"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
            onClick={() => {
              onClose();
              navigate('/admin/login');
            }}
          >
            <span>full login</span>
            <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
