import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const LETTERS = 'CAVSULIT'.split('');

export function LoadingScreen({ onDone }) {
  const [visible, setVisible]   = useState(true);
  const [fadeOut, setFadeOut]   = useState(false);
  const [showWake, setShowWake] = useState(false);

  useEffect(() => {
    const wakeTimer = setTimeout(() => setShowWake(true), 3000);
    const minDelay  = new Promise((r) => setTimeout(r, 1800));
    const ping      = api.get('/ping', { timeout: 65000 }).catch(() => null);
    const timeout   = new Promise((r) => setTimeout(r, 65000));

    Promise.race([
      Promise.all([ping, minDelay]),
      timeout,
    ]).finally(() => {
      clearTimeout(wakeTimer);
      setFadeOut(true);
      setTimeout(() => {
        setVisible(false);
        onDone?.();
      }, 500);
    });

    return () => clearTimeout(wakeTimer);
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#052e16] transition-opacity duration-500 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      aria-live="polite"
      aria-busy={!fadeOut}
    >
      <div className="flex gap-1 sm:gap-2 mb-8">
        {LETTERS.map((ch, i) => (
          <span
            key={i}
            className="text-3xl sm:text-5xl font-extrabold text-white animate-[letterRise_0.5s_cubic-bezier(0.4,0,0.2,1)_forwards] opacity-0"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {ch}
          </span>
        ))}
      </div>
      <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-[#22c55e] rounded-full animate-loader-pulse" />
      </div>
      {showWake && !fadeOut && (
        <p className="mt-6 text-sm text-white/55 animate-fade-up">
          Waking up server, this may take ~30s…
        </p>
      )}
    </div>
  );
}
