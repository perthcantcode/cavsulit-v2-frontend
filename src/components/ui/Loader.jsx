import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const LETTERS = 'CAVSULIT'.split('');
const SESSION_KEY = 'cavsulit_booted';

function isLocalApi() {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return base.includes('localhost') || base.includes('127.0.0.1');
}

export function LoadingScreen({ onDone }) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [showWake, setShowWake] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      onDone?.();
      return undefined;
    }

    const local = isLocalApi();
    const wakeTimer = setTimeout(() => setShowWake(true), local ? 1500 : 2500);
    const minDelay = new Promise((r) => setTimeout(r, local ? 400 : 700));
    const ping = local
      ? Promise.resolve()
      : api.get('/ping', { timeout: 15000 }).catch(() => null);
    const cap = new Promise((r) => setTimeout(r, local ? 600 : 15000));

    Promise.race([Promise.all([ping, minDelay]), cap]).finally(() => {
      clearTimeout(wakeTimer);
      sessionStorage.setItem(SESSION_KEY, '1');
      setFadeOut(true);
      setTimeout(() => {
        setVisible(false);
        onDone?.();
      }, 300);
    });

    return () => clearTimeout(wakeTimer);
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center
        transition-opacity duration-300 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ background: 'var(--bg)' }}
      aria-live="polite"
    >
      <div className="flex gap-1 sm:gap-2 mb-6">
        {LETTERS.map((ch, i) => (
          <span
            key={i}
            className="text-3xl sm:text-5xl font-extrabold animate-[letterRise_0.5s_cubic-bezier(0.4,0,0.2,1)_forwards] opacity-0"
            style={{
              animationDelay: `${i * 0.08}s`,
              color: i % 2 === 0 ? 'var(--green-neon)' : 'var(--text)',
            }}
          >
            {ch}
          </span>
        ))}
      </div>

      <div
        className="w-40 h-0.5 rounded-full overflow-hidden"
        style={{ background: '#1a1a1a' }}
      >
        <div
          className="h-full w-1/3 rounded-full animate-loader-pulse"
          style={{ background: 'var(--green-neon)' }}
        />
      </div>

      {showWake && !fadeOut && !isLocalApi() && (
        <p
          className="mt-5 text-xs animate-[fadeUp_0.6s_ease_forwards]"
          style={{ color: 'var(--text-muted)' }}
        >
          Waking up server…
        </p>
      )}
    </div>
  );
}
