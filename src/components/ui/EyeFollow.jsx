import React, { useRef, useState, useEffect } from 'react';

export function EyeFollow() {
  const containerRef = useRef(null);
  const [pupils, setPupils] = useState([{ x: 0, y: 0 }, { x: 0, y: 0 }]);

  useEffect(() => {
    const onMove = (e) => {
      const eyes = containerRef.current?.querySelectorAll('.eye-ball');
      if (!eyes) return;
      const newPupils = Array.from(eyes).map((eye) => {
        const r = eye.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 8;
        const ratio = Math.min(dist, maxDist) / (dist || 1);
        return { x: dx * ratio, y: dy * ratio };
      });
      setPupils(newPupils);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div ref={containerRef} className="flex gap-6 justify-center items-center">
      {pupils.map((p, i) => (
        <div
          key={i}
          className="eye-ball w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: 'var(--surface)',
            border: '2px solid var(--border)',
            boxShadow: '0 2px 16px var(--green-glow)',
          }}
        >
          <div
            className="w-6 h-6 rounded-full transition-transform"
            style={{
              background: 'var(--primary)',
              transform: `translate(${p.x}px, ${p.y}px)`,
              transition: 'transform 0.08s ease-out',
            }}
          />
        </div>
      ))}
    </div>
  );
}
