import React from 'react';

export default function Hud({ profile, onToast }) {
  return (
    <footer className="hud">
      <span className="hud__keys">
        <kbd>↑</kbd>
        <kbd>↓</kbd>
        <kbd>←</kbd>
        <kbd>→</kbd> move <kbd>↵</kbd> select
      </span>
      <span className="hud__links">
        <a href={`mailto:${profile.email}`} onClick={() => onToast && onToast('Opening email client...')}>
          Email
        </a>
        <a href={`tel:${profile.phone}`} onClick={() => onToast && onToast('Calling...')}>
          Phone
        </a>
        {profile.linkedin && (
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        )}
        {profile.github && (
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        )}
      </span>
    </footer>
  );
}
