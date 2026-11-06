import React, { useEffect } from 'react';
import AboutSection from './sections/AboutSection';
import ExperienceSection from './sections/ExperienceSection';
import SkillsSection from './sections/SkillsSection';
import EducationSection from './sections/EducationSection';
import CertificationsSection from './sections/CertificationsSection';
import HobbiesSection from './sections/HobbiesSection';
import ContactSection from './sections/ContactSection';

export default function Modal({
  sectionId,
  cards,
  portfolioData,
  onClose,
  onNavigate,
  onToast,
}) {
  const currentIndex = cards.findIndex((c) => c.id === sectionId);
  const currentCard = cards[currentIndex] || cards[0];

  const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
  const nextIndex = (currentIndex + 1) % cards.length;
  const prevCard = cards[prevIndex];
  const nextCard = cards[nextIndex];

  const sectionData = portfolioData[sectionId] || {};

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onNavigate(prevCard.id);
      } else if (e.key === 'ArrowRight') {
        onNavigate(nextCard.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards, onClose, onNavigate, prevCard.id, nextCard.id]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderSectionContent = () => {
    switch (sectionId) {
      case 'about':
        return <AboutSection data={sectionData} />;
      case 'experience':
        return <ExperienceSection data={sectionData} />;
      case 'skills':
        return <SkillsSection data={sectionData} />;
      case 'education':
        return <EducationSection data={sectionData} />;
      case 'certifications':
        return <CertificationsSection data={sectionData} />;
      case 'hobbies':
        return <HobbiesSection data={sectionData} />;
      case 'contact':
        return <ContactSection data={sectionData} onToast={onToast} />;
      default:
        return null;
    }
  };

  const accentColor = currentCard.accent || (currentCard.dark ? 'var(--lime)' : currentCard.bg);

  return (
    <div
      className="modal-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`${currentCard.title} section dialog`}
      style={{ '--accent': accentColor }}
    >
      <div className="modal-window">
        {/* Sticky Header */}
        <header className="pgtop">
          <button className="back" onClick={onClose} aria-label="Close dialog and back to menu">
            ← MENU
          </button>
          <nav className="pgdots" aria-label="Sections">
            {cards.map((c) => (
              <button
                key={c.id}
                className={`pgdot ${c.id === sectionId ? 'is-on' : ''}`}
                title={c.title}
                aria-label={`Go to ${c.title}`}
                onClick={() => onNavigate(c.id)}
                style={{ '--accent': c.bg }}
              />
            ))}
          </nav>
        </header>

        <div className="modal-content-wrap">
          {/* Section Hero Banner */}
          <section
            className={`phero ${currentCard.dark ? 'phero--dark' : ''}`}
            style={{ backgroundColor: currentCard.bg }}
          >
            <span className="phero__ico" aria-hidden="true">
              {currentCard.icon}
            </span>
            <span className="phero__n">{currentCard.number}</span>
            <h1>{sectionData.title || currentCard.title}</h1>
            <p className="phero__sub">{sectionData.subtitle || currentCard.subtitle}</p>
          </section>

          {/* Section Dynamic Content */}
          {renderSectionContent()}

          {/* Footer Navigation */}
          <nav className="pgfoot" aria-label="Section navigation">
            <button
              className="foot-btn"
              onClick={() => onNavigate(prevCard.id)}
              style={{ '--accent': prevCard.bg }}
            >
              ← {prevCard.title}
            </button>
            <button
              className="foot-btn"
              onClick={() => onNavigate(nextCard.id)}
              style={{ '--accent': nextCard.bg }}
            >
              {nextCard.title} →
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
