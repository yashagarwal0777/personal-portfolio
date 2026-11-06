import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Check if device supports hover
    if (window.matchMedia('(hover: none)').matches) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let animationId;
    const loop = () => {
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;
      if (cursor) {
        cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      }
      animationId = requestAnimationFrame(loop);
    };
    loop();

    const hotSelector = 'a, button, .tile, .card--lift, .tag, .hstat, .stat, .hob, .cbtn, .foot-btn, input, textarea';

    const onMouseOver = (e) => {
      if (e.target.closest(hotSelector)) {
        cursor.classList.add('hot');
      }
    };

    const onMouseOut = (e) => {
      if (e.target.closest(hotSelector)) {
        cursor.classList.remove('hot');
      }
    };

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <div className="custom-cursor" ref={cursorRef} aria-hidden="true" />;
}
