import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const STATS_FALLBACK = [
  '42+ Active Shops',
  '300+ Products',
  'Verified Sellers',
  'Pre-orders Live',
  'CvSU Exclusive',
  'Free Always',
];

const SERVICES_ITEMS = [
  'Food & Drinks',
  'Merch & Clothing',
  'Freelance Services',
  'Campus Community',
  'Browse → Order → Pickup',
];

function MarqueeRow({ items, direction = 'left' }) {
  const animClass = direction === 'right' ? 'marquee-right' : 'marquee-left';

  return (
    <div className="marquee-track">
      <div className={`marquee-inner ${animClass}`}>
        {[0, 1].map(copy => (
          <div key={copy} className="marquee-group" aria-hidden={copy === 1 || undefined}>
            {items.map((label, i) => (
              <span
                key={`${copy}-${i}`}
                className="marquee-chip"
                data-hover={i % 2 === 0 ? 'neon' : 'yellow'}
              >
                {label}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TaglineMarqueeSection() {
  const [statsItems, setStatsItems] = useState(STATS_FALLBACK);

  useEffect(() => {
    api
      .get('/shops?limit=1')
      .then(({ data }) => {
        const total = data?.total;
        if (typeof total === 'number' && total > 0) {
          setStatsItems([
            `${total}+ Active Shops`,
            '300+ Products',
            'Verified Sellers',
            'Pre-orders Live',
            'CvSU Exclusive',
            'Free Always',
          ]);
        }
      })
      .catch(() => setStatsItems(STATS_FALLBACK));
  }, []);

  return (
    <section className="tagline-section" aria-labelledby="tagline-heading">
      <div className="tagline-section-inner">
        <h2 id="tagline-heading" className="tagline-heading">
          You&apos;ve got the{' '}
          <span className="tagline-highlight tagline-highlight--yellow">hustle</span>
          {' '}we&apos;ve got the{' '}
          <span className="tagline-highlight tagline-highlight--green">platform</span>.
        </h2>
        <p className="tagline-desc">
          CavSulit is the free campus marketplace where CvSU students, instructors,
          and community members connect, hustle, and thrive — all in one place.
        </p>

        <div className="marquee-rows">
          <MarqueeRow items={statsItems} direction="left" />
          <MarqueeRow items={SERVICES_ITEMS} direction="right" />
        </div>
      </div>
    </section>
  );
}

/** @deprecated Use TaglineMarqueeSection — kept for imports during migration */
export function MarqueeStrip() {
  return <TaglineMarqueeSection />;
}
