import { useEffect, useRef, useState } from 'react';
import { FadeIn } from '../ui/FadeIn';

const FAQ_ITEMS = [
  {
    kicker: 'Shops · Setup',
    q: 'How do I create a shop on CavSulit?',
    a: 'Sign up with your CvSU email, verify your account, then tap Post Shop. Add photos, location, and products — it takes under five minutes.',
  },
  {
    kicker: 'Account · Verify',
    q: 'Do I need a CvSU email to register?',
    a: 'Yes. A @cvsu.edu.ph email is required for the CvSU Verified badge. Anyone can browse, but posting requires verification.',
  },
  {
    kicker: 'Orders · Pre-order',
    q: 'How do I place a pre-order?',
    a: 'Go to any shop page, tap Pre-Order, fill in your info, and send. The seller will confirm via the messaging system.',
  },
  {
    kicker: 'Trust · Badges',
    q: 'How does seller verification work?',
    a: 'Register with your CvSU email and student ID. Once verified, you receive the CvSU Verified badge on your profile.',
  },
  {
    kicker: 'Messaging · Contact',
    q: 'How do I contact a seller?',
    a: 'Go to any shop page and tap “Message Seller” to open a chat directly.',
  },
];

function useTimelineReveal(side, delay = 0) {
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
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const hiddenX = side === 'left' ? '-32px' : '32px';

  return {
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : `translateX(${hiddenX})`,
      transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
    },
  };
}

function FaqCard({ item, index, isOpen, onToggle, cardRef, style }) {
  const panelId = `faq-panel-${index}`;

  return (
    <article
      ref={cardRef}
      className={`faq-card${isOpen ? ' faq-card--open' : ''}`}
      style={style}
    >
      <button
        type="button"
        className="faq-card-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="faq-card-trigger-copy">
          <span className="faq-card-kicker">{item.kicker}</span>
          <span className="faq-card-question">{item.q}</span>
        </span>
        <span className="faq-card-toggle" aria-hidden>
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div
        id={panelId}
        className="faq-card-panel"
        role="region"
        aria-hidden={!isOpen}
      >
        <div className="faq-card-panel-inner">
          <p className="faq-card-answer">{item.a}</p>
        </div>
      </div>
    </article>
  );
}

function FaqTimelineItem({ item, index, isOpen, onToggle }) {
  const side = index % 2 === 0 ? 'left' : 'right';
  const num = String(index + 1).padStart(2, '0');
  const { ref, style } = useTimelineReveal(side, index * 70);

  const card = (
    <FaqCard
      item={item}
      index={index}
      isOpen={isOpen}
      onToggle={onToggle}
      cardRef={ref}
      style={style}
    />
  );

  const node = (
    <div className="faq-node-wrap">
      <span className={`faq-node${isOpen ? ' faq-node--active' : ''}`} aria-hidden>
        <span className="faq-node-num">{num}</span>
      </span>
      <span className={`faq-connector faq-connector--${side}`} aria-hidden />
    </div>
  );

  return (
    <div className={`faq-timeline-row faq-timeline-row--${side}`}>
      {side === 'left' ? (
        <>
          {card}
          {node}
          <div className="faq-timeline-gap" aria-hidden />
        </>
      ) : (
        <>
          <div className="faq-timeline-gap" aria-hidden />
          {node}
          {card}
        </>
      )}
    </div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(-1);

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <div className="trending-section-inner">
        <FadeIn>
          <header className="faq-header">
            <p className="trending-section-label">FAQ</p>
            <h2 id="faq-heading" className="faq-heading">
              Got questions?
            </h2>
            <p className="faq-subline">
              Everything you need to know about CavSulit. Tap a question to expand.
            </p>
          </header>
        </FadeIn>

        <div className="faq-timeline">
          <div className="faq-spine" aria-hidden />
          {FAQ_ITEMS.map((item, i) => (
            <FaqTimelineItem
              key={item.q}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
