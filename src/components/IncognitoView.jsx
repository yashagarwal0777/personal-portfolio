import React, { useState } from 'react';

export default function IncognitoView({ onClose, onSaveNotification }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'yash' || username.trim() === 'admin' || password === 'admin' || password === '1234') {
      setIsUnlocked(true);
      setErrorMsg('');
      if (onSaveNotification) onSaveNotification('Unlocked incognito vault');
    } else {
      setErrorMsg('Incorrect ID or password. Try ID: yash');
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

        {!isUnlocked ? (
          <>
            <h2 className="incog__title">You are in incognito mode now</h2>
            <p className="incog__sub">Private area — sign in to continue.</p>

            <form className="ilogin" onSubmit={handleSubmit}>
              <label className="ifield">
                <span>ID</span>
                <input
                  type="text"
                  placeholder="enter your ID (e.g. yash)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>

              <label className="ifield">
                <span>Password</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              {errorMsg && <p className="ierror">{errorMsg}</p>}

              <button className="ibtn" type="submit">
                SIGN IN
              </button>
            </form>
          </>
        ) : (
          <div className="vault-unlocked" style={{ textAlign: 'center', marginTop: 10 }}>
            <h2 className="incog__title">Welcome to Vault</h2>
            <p className="incog__sub">All portfolio records and settings unlocked.</p>
            <div style={{ background: '#2B2B2B', padding: '16px', borderRadius: 12, marginTop: 16, border: '2px solid #3D3D3D' }}>
              <p style={{ fontSize: 13, color: '#A0E4B0', fontWeight: 800 }}>✓ Single source of truth active</p>
              <p style={{ fontSize: 12, color: '#9A9A9A', marginTop: 6 }}>Customizations loaded from portfolioData.js</p>
            </div>
          </div>
        )}

        <button className="iback" onClick={onClose}>
          ← leave incognito
        </button>
      </div>
    </div>
  );
}
