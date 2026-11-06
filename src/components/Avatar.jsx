import React from 'react';

export default function Avatar({ className = '', customSrc = null }) {
  if (customSrc) {
    return (
      <div className={`avatar-wrapper ${className}`}>
        <img
          src={customSrc}
          alt="Avatar"
          className="avatar custom-avatar-img"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    );
  }

  return (
    <svg
      className={`avatar ${className}`}
      id="avatar"
      viewBox="0 0 260 300"
      aria-label="Illustrated cartoon character of Yash Agrawal"
    >
      {/* Ground shadow with subtle pulsing scale */}
      <g className="av-shadow">
        <ellipse cx="130" cy="288" rx="66" ry="9" fill="var(--ink)" opacity="0.18" />
      </g>

      {/* Main bobbing body */}
      <g className="av-bob">
        {/* Backpack straps behind */}
        <path
          d="M92 168c-4-22 2-36 8-42M168 168c4-22-2-36-8-42"
          fill="none"
          stroke="var(--strap)"
          strokeWidth="15"
          strokeLinecap="round"
        />
        <path
          d="M92 168c-4-22 2-36 8-42M168 168c4-22-2-36-8-42"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="18"
          strokeLinecap="round"
          opacity="0.18"
        />

        {/* Left arm */}
        <g className="av-arm av-arm--l">
          <path
            d="M84 176c-12 14-16 40-14 60"
            fill="none"
            stroke="var(--skin)"
            strokeWidth="20"
            strokeLinecap="round"
          />
        </g>

        {/* Right arm (sways and waves on hover) */}
        <g className="av-arm av-arm--r">
          <path
            d="M176 176c12 14 16 40 14 60"
            fill="none"
            stroke="var(--skin)"
            strokeWidth="20"
            strokeLinecap="round"
          />
        </g>

        {/* Torso: maroon tee */}
        <path
          className="ln"
          d="M76 286v-88c0-26 20-44 46-48h16c26 4 46 22 46 48v88z"
          fill="var(--tee)"
        />
        <path
          d="M122 150h16c26 4 46 22 46 48v20c-16-22-40-32-62-32s-46 10-62 32v-20c0-26 20-44 46-48z"
          fill="var(--tee-dark)"
          opacity="0.45"
        />

        {/* Collar */}
        <path
          className="ln"
          d="M112 150c6 12 12 18 18 18s12-6 18-18"
          fill="var(--skin-dark)"
        />

        {/* Front backpack straps & chest clip */}
        <path
          d="M104 152l-6 134M156 152l6 134"
          stroke="var(--strap)"
          strokeWidth="13"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="96" y="212" width="70" height="13" rx="6" fill="var(--strap)" />

        {/* Neck */}
        <path
          className="ln"
          d="M116 122h28v26a14 14 0 0 1-28 0z"
          fill="var(--skin-dark)"
        />

        {/* Head */}
        <g className="av-head">
          {/* Ears */}
          <ellipse className="ln" cx="84" cy="78" rx="9" ry="12" fill="var(--skin)" />
          <ellipse className="ln" cx="176" cy="78" rx="9" ry="12" fill="var(--skin)" />

          {/* Face */}
          <path
            className="ln"
            d="M88 62c0-26 19-44 42-44s42 18 42 44v22c0 28-19 46-42 46s-42-18-42-46z"
            fill="var(--skin)"
          />

          {/* Beard */}
          <path
            d="M88 76v8c0 28 19 46 42 46s42-18 42-46v-8c-6 16-10 22-16 26-8 5-16 7-26 7s-18-2-26-7c-6-4-10-10-16-26z"
            fill="var(--hair)"
          />
          <path d="M112 100h36c-2 7-8 11-18 11s-16-4-18-11z" fill="#3A2F35" />

          {/* Moustache */}
          <path
            d="M112 92c5-5 12-6 18-6s13 1 18 6c-5 2-11 3-18 3s-13-1-18-3z"
            fill="var(--hair)"
          />

          {/* Hair */}
          <path
            className="ln"
            d="M86 66c-2-30 18-50 44-50s46 20 44 50c-4-4-6-12-8-16-6 6-14 8-24 8-14 0-24-4-32-10-6 6-18 12-24 18z"
            fill="var(--hair)"
          />

          {/* Sunglasses */}
          <g className="av-shades">
            <path d="M84 62h92" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
            <rect className="ln" x="92" y="58" width="34" height="24" rx="8" fill="var(--lens)" />
            <rect className="ln" x="134" y="58" width="34" height="24" rx="8" fill="var(--lens)" />
            <path d="M126 66h8" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />

            {/* Lens Glint Animation */}
            <g className="av-glint">
              <rect
                x="98"
                y="62"
                width="7"
                height="16"
                rx="3"
                fill="#fff"
                opacity="0.55"
                transform="rotate(18 101 70)"
              />
              <rect
                x="140"
                y="62"
                width="7"
                height="16"
                rx="3"
                fill="#fff"
                opacity="0.55"
                transform="rotate(18 143 70)"
              />
            </g>
          </g>

          {/* Cheerful smile */}
          <path
            d="M114 96c5 6 10 9 16 9s11-3 16-9"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
}
