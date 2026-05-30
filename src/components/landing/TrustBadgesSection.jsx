import {
  Award,
  Check,
  ShieldCheck,
  Unlock,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FadeIn } from '../ui/FadeIn';

const BADGE_ORDER = ['unverified', 'cvsu', 'top_seller'];

const BADGES = {
  unverified: {
    key: 'unverified',
    Icon: Unlock,
    title: 'Unverified',
    pill: 'Guest access',
    pillClass: 'badge-trusted',
    desc: 'Browse and order without a verified CvSU account.',
    perks: [
      { ok: true, text: 'View shops and products' },
      { ok: true, text: 'Message sellers' },
      { ok: true, text: 'Order and pre-order items' },
      { ok: false, text: 'Cannot post or create a shop' },
      { ok: false, text: 'No verified indicator shown' },
    ],
    tone: 'neutral',
    stackClass: 'trust-stack-card--unverified',
  },
  cvsu: {
    key: 'cvsu',
    Icon: ShieldCheck,
    title: 'CvSU Verified',
    pill: '★ CvSU Verified',
    pillClass: 'badge-cvsu',
    desc: 'Full campus seller access after email verification.',
    perks: [
      { ok: true, text: 'Full platform access' },
      { ok: true, text: 'Create and manage shops' },
      { ok: true, text: 'Verified badge on profile & shops' },
      { ok: true, text: 'Confirmed via @cvsu.edu.ph + Student ID' },
    ],
    tone: 'featured',
    stackClass: 'trust-stack-card--cvsu',
  },
  top_seller: {
    key: 'top_seller',
    Icon: Award,
    title: 'Top Seller',
    pill: '★★★ Top Seller',
    pillClass: 'badge-top',
    desc: 'Highest badge — earned through consistent campus sales.',
    perks: [
      { ok: true, text: 'Highest badge level on CavSulit' },
      { ok: true, text: '50+ completed transactions' },
      { ok: true, text: '4.5+ overall rating' },
      { ok: true, text: '10+ positive reviews · 30+ days active' },
    ],
    tone: 'gold',
    stackClass: 'trust-stack-card--top',
  },
};

function useScrollReveal(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return {
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(22px)',
      transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
    },
  };
}

function PerkList({ perks }) {
  return (
    <ul className="trust-perk-list">
      {perks.map((perk) => (
        <li key={perk.text} className={perk.ok ? 'trust-perk--ok' : 'trust-perk--no'}>
          {perk.ok ? (
            <Check size={15} strokeWidth={2.75} aria-hidden />
          ) : (
            <X size={15} strokeWidth={2.75} aria-hidden />
          )}
          <span>{perk.text}</span>
        </li>
      ))}
    </ul>
  );
}

function TrustStackCard({ badge, stackIndex }) {
  const { Icon } = badge;

  return (
    <article
      className={`trust-stack-card ${badge.stackClass}`}
      style={{ zIndex: stackIndex + 1 }}
    >
      <div className="trust-stack-card-top">
        <span className="trust-stack-icon" aria-hidden>
          <Icon size={22} strokeWidth={2.35} />
        </span>
        <span className={badge.pillClass}>{badge.pill}</span>
      </div>
      <p className="trust-stack-title">{badge.title}</p>
      <p className="trust-stack-tag">{badge.desc}</p>
      <div className="trust-stack-strip" aria-hidden />
    </article>
  );
}

function TrustDetailCard({ badge, index }) {
  const { Icon } = badge;
  const { ref, style } = useScrollReveal(index * 100);

  return (
    <article
      ref={ref}
      className={`trust-detail-card trust-detail-card--${badge.tone}`}
      style={style}
    >
      <div className="trust-detail-head">
        <span className="trust-detail-icon" aria-hidden>
          <Icon size={26} strokeWidth={2.35} />
        </span>
        <div>
          <span className={badge.pillClass}>{badge.pill}</span>
          <h3 className="trust-detail-title">{badge.title}</h3>
        </div>
      </div>
      <hr className="trust-detail-rule" />
      <PerkList perks={badge.perks} />
    </article>
  );
}

export function TrustBadgesSection() {
  const stackReveal = useScrollReveal(80);

  return (
    <section id="about" className="trust-badges-section" aria-labelledby="trust-badges-heading">
      <div className="trending-section-inner">
        <div className="trust-badges-hero">
          <FadeIn>
            <div className="trust-badges-copy">
              <p className="trending-section-label">Trust System</p>
              <h2 id="trust-badges-heading" className="trust-badges-heading">
                Built on trust.
              </h2>
              <p className="trust-badges-subline">
                Every shop is reviewed. Every seller is accountable. Verified badges
                mean real students.
              </p>
              <blockquote className="trust-badges-quote">
                “Badges stack up as you grow — from browsing guest to campus-verified
                seller to top-rated shop.”
              </blockquote>
            </div>
          </FadeIn>

          <div ref={stackReveal.ref} className="trust-stack-stage" style={stackReveal.style}>
            <div className="trust-stack-cascade">
              {BADGE_ORDER.map((key, i) => (
                <TrustStackCard
                  key={key}
                  badge={BADGES[key]}
                  stackIndex={i}
                />
              ))}
            </div>
            <p className="trust-stack-caption">3 badge levels · one campus marketplace</p>
          </div>
        </div>

        <div className="trust-detail-grid">
          {BADGE_ORDER.map((key, i) => (
            <TrustDetailCard key={key} badge={BADGES[key]} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
