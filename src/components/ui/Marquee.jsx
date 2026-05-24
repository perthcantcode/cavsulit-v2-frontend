import React, { useRef, useState } from 'react';

export function Marquee({ items, direction = 'ltr', speed = 28, className = '' }) {
  const anim = direction === 'rtl' ? 'animate-marquee-rtl' : 'animate-marquee-ltr';
  const [paused, setPaused] = useState(false);
  const text = items.join('   ·   ');

  return (
    <div
      className={`overflow-hidden whitespace-nowrap cursor-default select-none ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`inline-flex ${anim}`}
        style={{
          animationDuration: `${speed}s`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        <span className="px-8 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{text}</span>
        <span className="px-8 text-sm font-medium" style={{ color: 'var(--text-muted)' }} aria-hidden="true">{text}</span>
      </div>
    </div>
  );
}

export function MarqueeStrip() {
  const row1 = ['42+ Active Shops', '300+ Products', 'Verified Sellers', 'Pre-orders Live', 'CvSU Exclusive', 'Free Always'];
  const row2 = ['Food & Drinks', 'Merch & Clothing', 'Freelance Services', 'Campus Community', 'Browse → Order → Pickup'];

  return (
    <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-alt)' }} className="py-5">
      <Marquee items={row1} direction="ltr" speed={28} className="mb-2.5" />
      <Marquee items={row2} direction="rtl" speed={22} />
    </section>
  );
}
