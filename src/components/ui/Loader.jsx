import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const LETTERS = 'CAVSULIT'.split('');

export function LoadingScreen({ onDone }) {
  const [visible,  setVisible]  = useState(true);
  const [fadeOut,  setFadeOut]  = useState(false);
  const [showWake, setShowWake] = useState(false);

  useEffect(() => {
    const wakeTimer = setTimeout(() => setShowWake(true), 3000);
    const minDelay  = new Promise(r => setTimeout(r, 1800));
    const ping      = api.get('/ping', { timeout: 65000 }).catch(() => null);
    const timeout   = new Promise(r => setTimeout(r, 65000));

    Promise.race([Promise.all([ping, minDelay]), timeout]).finally(() => {
      clearTimeout(wakeTimer);
      setFadeOut(true);
      setTimeout(() => { setVisible(false); onDone?.(); }, 500);
    });

    return () => clearTimeout(wakeTimer);
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center
        transition-opacity duration-500 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ background: 'var(--bg)' }}
      aria-live="polite"
    >
      {/* Letters */}
      <div className="flex gap-1 sm:gap-2 mb-6">
        {LETTERS.map((ch, i) => (
          <span
            key={i}
            className="text-3xl sm:text-5xl font-extrabold animate-[letterRise_0.5s_cubic-bezier(0.4,0,0.2,1)_forwards] opacity-0"
            style={{
              animationDelay: `${i * 0.08}s`,
              color: i % 2 === 0 ? 'var(--primary)' : 'var(--text)',
            }}
          >
            {ch}
          </span>
        ))}
      </div>

      {/* Progress bar */}
      <div
        className="w-40 h-0.5 rounded-full overflow-hidden"
        style={{ background: 'var(--border)' }}
      >
        <div
          className="h-full w-1/3 rounded-full animate-loader-pulse"
          style={{ background: 'var(--accent)' }}
        />
      </div>

      {showWake && !fadeOut && (
        <p
          className="mt-5 text-xs animate-[fadeUp_0.6s_ease_forwards]"
          style={{ color: 'var(--text-muted)' }}
        >
          Waking up server, this may take ~30s…
        </p>
      )}
    </div>
  );
}
