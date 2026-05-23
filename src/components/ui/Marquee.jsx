import React from 'react';

export function Marquee({ items, direction = 'ltr', speed = 25, className = '' }) {
  const anim = direction === 'rtl' ? 'animate-marquee-rtl' : 'animate-marquee-ltr';
  const text = items.join('  •  ');

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className={`inline-flex ${anim}`} style={{ animationDuration: `${speed}s` }}>
        <span className="px-8 text-sm text-white/80">{text}</span>
        <span className="px-8 text-sm text-white/80" aria-hidden="true">{text}</span>
      </div>
    </div>
  );
}

export function MarqueeStrip() {
  const row1 = ['🚀 42+ Shops', '300+ Products', 'Verified Sellers', 'Pre-orders Live', 'CvSU Only', 'CavSulit'];
  const row2 = ['Food', 'Merch', 'Services', 'Freelance', 'Campus Exclusive', 'Free to Join'];

  return (
    <section className="py-6 border-y border-white/10 bg-white/[0.06] backdrop-blur-xl">
      <Marquee items={row1} direction="ltr" speed={25} className="mb-3" />
      <Marquee items={row2} direction="rtl" speed={20} />
    </section>
  );
}
