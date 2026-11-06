import React from 'react';

export default function BoardCard({ card, onClick }) {
  const { id, number, title, subtitle, icon, bg, dark, rotation, gridArea } = card;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open section ${number}: ${title} - ${subtitle}`}
      className={`tile tile--${id} ${dark ? 'tile--contact' : ''}`}
      style={{
        '--bg': bg,
        '--rot': `${rotation}deg`,
        backgroundColor: bg,
      }}
      onClick={() => onClick(id)}
      onKeyDown={handleKeyDown}
    >
      <span className="tile__n">{number}</span>
      <span className="tile__ico" aria-hidden="true">{icon}</span>
      <span className="tile__t">{title}</span>
      <span className="tile__d">{subtitle}</span>
    </div>
  );
}
