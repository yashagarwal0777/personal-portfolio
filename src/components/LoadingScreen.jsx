import React, { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const logs = [
    { text: 'loading character sprites', status: 'OK' },
    { text: 'connecting database pipelines', status: 'OK' },
    { text: 'compiling power-up badges', status: 'OK' },
    { text: 'calibrating interactive board', status: 'READY' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        return next > 100 ? 100 : next;
      });
    }, 90);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const logStep = Math.min(Math.floor((progress / 100) * logs.length), logs.length);
    setLogIndex(logStep);
  }, [progress, logs.length]);

  const handleStart = () => {
    setIsFading(true);
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  const handleSkip = () => {
    setIsFading(true);
    setTimeout(() => {
      onComplete();
    }, 250);
  };

  const totalCells = 20;
  const activeCells = Math.round((progress / 100) * totalCells);

  return (
    <section className={`load-screen ${isFading ? 'fade-out' : ''}`}>
      <span className="load-deco load-deco--a" aria-hidden="true" />
      <span className="load-deco load-deco--b" aria-hidden="true" />
      <span className="load-deco load-deco--c" aria-hidden="true" />

      <div className="load-box">
        <p className="load-kicker">NOW LOADING</p>
        <h1 className="load-name">
          YASH<br />AGRAWAL
        </h1>
        <p className="load-role">WEB DEVELOPER &amp; SOFTWARE ENGINEER</p>

        <div className="pbar" aria-hidden="true">
          <div className="pbar__cells">
            {Array.from({ length: totalCells }).map((_, i) => (
              <i key={i} className={i < activeCells ? 'on' : ''} />
            ))}
          </div>
        </div>

        <div className="pbar__meta">
          <span>{progress < 100 ? 'warming up' : 'ready player 1'}</span>
          <span className="pbar__pct">
            <b>{progress}</b>%
          </span>
        </div>

        <div className="load-log">
          {logs.slice(0, logIndex).map((log, idx) => (
            <p key={idx}>
              <span>{log.text}</span>
              <span className="lead" />
              <b>{log.status}</b>
            </p>
          ))}
        </div>

        {progress >= 100 ? (
          <button className="btn-start" onClick={handleStart}>
            <span>PRESS START</span>
          </button>
        ) : (
          <button className="btn-skip" onClick={handleSkip}>
            skip intro
          </button>
        )}
      </div>
    </section>
  );
}
