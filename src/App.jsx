import React, { useState, useEffect, useCallback } from 'react';
import { portfolioData } from './data/portfolioData';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import BoardCard from './components/BoardCard';
import Avatar from './components/Avatar';
import IncognitoToggle from './components/IncognitoToggle';
import IncognitoView from './components/IncognitoView';
import Modal from './components/Modal';
import Hud from './components/Hud';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  const [isIncognito, setIsIncognito] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [focusedCardIndex, setFocusedCardIndex] = useState(0);

  const { profile, cards } = portfolioData;

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? '' : current));
    }, 2400);
  }, []);

  // Keyboard navigation for main board when modal is closed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeSection || isIncognito || isLoading) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedCardIndex((prev) => (prev + 1) % cards.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        setActiveSection(cards[focusedCardIndex].id);
      } else if (e.key.toLowerCase() === 'i') {
        setIsIncognito((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, isIncognito, isLoading, cards, focusedCardIndex]);

  const handleCardClick = (id) => {
    setActiveSection(id);
  };

  const handleStatClick = (statLabel) => {
    if (statLabel.includes('site')) {
      setActiveSection('experience');
    } else if (statLabel.includes('intern')) {
      setActiveSection('experience');
    } else if (statLabel.includes('cert')) {
      setActiveSection('certifications');
    } else {
      setActiveSection('about');
    }
  };

  return (
    <div className={`portfolio-app ${isIncognito ? 'incognito' : ''}`}>
      {/* Smooth Trailing Custom Cursor */}
      <CustomCursor />

      {/* Arcade Retro Loading Screen */}
      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      )}

      {/* Top-Right Incognito Mode Switch Toggle */}
      <IncognitoToggle
        isIncognito={isIncognito}
        onToggle={() => setIsIncognito((prev) => !prev)}
      />

      {/* Secret Incognito Overlay Screen */}
      {isIncognito && (
        <IncognitoView
          onClose={() => setIsIncognito(false)}
          onSaveNotification={showToast}
        />
      )}

      {/* Main Single-Screen Asymmetrical Board */}
      <main className="portfolio-main">
        <div className="board">
          {/* 01 ABOUT CARD (Top-Left) */}
          <BoardCard
            card={cards.find((c) => c.id === 'about')}
            onClick={handleCardClick}
          />

          {/* 02 EXPERIENCE CARD (Lower-Left) */}
          <BoardCard
            card={cards.find((c) => c.id === 'experience')}
            onClick={handleCardClick}
          />

          {/* 03 SKILLS CARD (Beside Experience) */}
          <BoardCard
            card={cards.find((c) => c.id === 'skills')}
            onClick={handleCardClick}
          />

          {/* CENTER HERO REGION */}
          <section className="hero">
            {/* Player status tag with blip indicator */}
            <div className="hero__tag">
              <i className="pip" />
              {profile.status}
            </div>

            {/* Stage with character illustration and floating objects */}
            <div
              className="hero__stage"
              onClick={() => setActiveSection('about')}
              title="Click character to view About me"
            >
              <span className="hero__pop hero__pop--1" aria-hidden="true" />
              <span className="hero__pop hero__pop--2" aria-hidden="true" />
              <Avatar />
            </div>

            {/* Name and Professional Role */}
            <h1 className="hero__name">{profile.name}</h1>
            <p className="hero__role">
              {profile.role} <span>&middot;</span> {profile.location}
            </p>

            {/* Quick Stat Badges */}
            <div className="hero__stats">
              {profile.stats.map((st) => (
                <div
                  key={st.id}
                  className="hstat"
                  style={{ backgroundColor: st.bg }}
                  onClick={() => handleStatClick(st.label)}
                  title={`View ${st.label}`}
                >
                  <b>{st.value}</b>
                  {st.suffix && <i>{st.suffix}</i>}
                  <span>{st.label}</span>
                </div>
              ))}
            </div>

            {/* Distinct Dark Resume Button */}
            <a
              className="hero__cta"
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download="Yash-Agrawal-Resume.pdf"
              title="Download or view Résumé"
              onClick={() => showToast('Opening Résumé...')}
            >
              GRAB RESUME
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M8 1v10M4 7l4 4 4-4M2 14h12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </section>

          {/* 04 EDUCATION CARD (Top-Right) */}
          <BoardCard
            card={cards.find((c) => c.id === 'education')}
            onClick={handleCardClick}
          />

          {/* 05 CERTIFICATIONS CARD (Middle-Right Left) */}
          <BoardCard
            card={cards.find((c) => c.id === 'certifications')}
            onClick={handleCardClick}
          />

          {/* 06 HOBBIES CARD (Middle-Right Right) */}
          <BoardCard
            card={cards.find((c) => c.id === 'hobbies')}
            onClick={handleCardClick}
          />

          {/* 07 CONTACT CARD (Bottom-Right) */}
          <BoardCard
            card={cards.find((c) => c.id === 'contact')}
            onClick={handleCardClick}
          />
        </div>

        {/* HUD Bar at Bottom */}
        <Hud profile={profile} onToast={showToast} />
      </main>

      {/* Detail Overlay / Modal */}
      {activeSection && (
        <Modal
          sectionId={activeSection}
          cards={cards}
          portfolioData={portfolioData}
          onClose={() => setActiveSection(null)}
          onNavigate={(newSectionId) => setActiveSection(newSectionId)}
          onToast={showToast}
        />
      )}

      {/* Toast Alert Feedback */}
      <div className={`toast ${toastMessage ? 'on' : ''}`} role="alert">
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}
