import React from 'react';

export default function IncognitoToggle({ isIncognito, onToggle }) {
  return (
    <div className="swap" id="swap">
      <span className="swap__tip" id="swapTip">
        {isIncognito ? 'tap to exit incognito mode' : 'tap to switch to incognito mode'}
      </span>
      <button
        className="swap__btn"
        id="swapBtn"
        role="switch"
        aria-checked={isIncognito}
        aria-label="Switch incognito mode"
        onClick={onToggle}
      >
        <span className="swap__track">
          <span className="swap__knob">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <path className="hat" d="M20 31l4-13c1-3 3-4 5-3l3 1.5L35 15c2-1 4 0 5 3l4 13z" />
              <rect className="hat" x="15" y="31" width="34" height="3.4" rx="1.7" />
              <circle className="specs" cx="24" cy="43" r="6.4" />
              <circle className="specs" cx="40" cy="43" r="6.4" />
              <path className="specs" d="M30.4 43h3.2" />
            </svg>
          </span>
        </span>
      </button>
    </div>
  );
}
