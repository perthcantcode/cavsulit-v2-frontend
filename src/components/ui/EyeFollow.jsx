import React, { useEffect, useRef } from 'react';

export function EyeFollow() {
  const eyeRef   = useRef(null);
  const pupilRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      const eye = eyeRef.current;
      const pupil = pupilRef.current;
      if (!eye || !pupil) return;
      const rect = eye.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
      const moveX = Math.cos(angle) * 12;
      const moveY = Math.sin(angle) * 12;
      pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={eyeRef}
      className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center mx-auto will-change-transform"
    >
      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
        <div
          ref={pupilRef}
          className="w-6 h-6 rounded-full bg-black transition-transform duration-150 ease-smooth will-change-transform"
        />
      </div>
    </div>
  );
}
