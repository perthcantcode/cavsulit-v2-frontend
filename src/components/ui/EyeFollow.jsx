import { useRef, useState, useEffect } from 'react';

const SIZES = {
  default: {
    eyeW: 56,
    eyeH: 56,
    pupil: 24,
    maxDist: 8,
    gap: 24,
    border: 3,
    shadow: '5px 5px 0px #1a1a1a',
    oval: false,
    pupilColor: 'var(--green-neon)',
  },
  large: {
    eyeW: 88,
    eyeH: 88,
    pupil: 34,
    maxDist: 14,
    gap: 36,
    border: 4,
    shadow: '6px 6px 0px #1a1a1a',
    oval: false,
    pupilColor: 'var(--green-neon)',
  },
  cute: {
    eyeW: 112,
    eyeH: 168,
    pupil: 40,
    maxDist: 22,
    gap: 56,
    border: 4,
    shadow: '7px 7px 0px #1a1a1a',
    oval: true,
    pupilColor: '#1a1a1a',
  },
};

export function EyeFollow({ size = 'default' }) {
  const containerRef = useRef(null);
  const [pupils, setPupils] = useState([{ x: 0, y: 0 }, { x: 0, y: 0 }]);
  const cfg = SIZES[size] ?? SIZES.default;

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
        const ratio = Math.min(dist, cfg.maxDist) / (dist || 1);
        return { x: dx * ratio, y: dy * ratio };
      });
      setPupils(newPupils);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [cfg.maxDist]);

  return (
    <div
      ref={containerRef}
      className="eye-follow"
      style={{ gap: cfg.gap }}
    >
      {pupils.map((p, i) => (
        <div
          key={i}
          className={`eye-ball${cfg.oval ? ' eye-ball--oval' : ''}`}
          style={{
            width: cfg.eyeW,
            height: cfg.eyeH,
            background: 'var(--surface)',
            border: `${cfg.border}px solid #1a1a1a`,
            boxShadow: cfg.shadow,
          }}
        >
          <div
            className="eye-pupil"
            style={{
              width: cfg.pupil,
              height: cfg.pupil,
              background: cfg.pupilColor,
              transform: `translate(${p.x}px, ${p.y}px)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
