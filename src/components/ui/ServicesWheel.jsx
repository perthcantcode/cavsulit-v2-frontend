import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from './GlassCard';

const SERVICES = [
  { name: 'Food',      icon: '🍜', desc: 'Order meals from campus food stalls' },
  { name: 'Merch',     icon: '🛍️', desc: 'Buy student-made products and campus merch' },
  { name: 'Services',  icon: '💼', desc: 'Book tutoring, printing, and more' },
  { name: 'Freelance', icon: '🎨', desc: 'Hire student designers, editors, and devs' },
];

export function ServicesWheel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((i) => (i + 1) % SERVICES.length), 4000);
    return () => clearInterval(t);
  }, [paused]);

  const s = SERVICES[active];

  return (
    <div
      className="max-w-2xl mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <GlassCard className="p-8 text-center mb-6 min-h-[200px] flex flex-col items-center justify-center">
        <span className="text-5xl mb-3">{s.icon}</span>
        <h3 className="text-2xl font-bold text-white">{s.name}</h3>
        <p className="text-white/55 mt-2 max-w-sm">{s.desc}</p>
        <Link to="/browse" className="mt-4 text-cav-accent font-semibold hover:underline">
          Explore →
        </Link>
      </GlassCard>
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {SERVICES.map((item, i) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setActive(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-350 ease-smooth border
              ${i === active
                ? 'bg-cav-primary border-cav-primary text-white shadow-glow-green'
                : 'bg-white/5 border-white/15 text-white/70 hover:border-cav-accent/50'}`}
          >
            {item.icon} {item.name}
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        <button
          type="button"
          onClick={() => setActive((i) => (i - 1 + SERVICES.length) % SERVICES.length)}
          className="w-10 h-10 rounded-full border border-white/20 text-white hover:bg-white/10"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => setActive((i) => (i + 1) % SERVICES.length)}
          className="w-10 h-10 rounded-full border border-white/20 text-white hover:bg-white/10"
        >
          →
        </button>
      </div>
    </div>
  );
}
