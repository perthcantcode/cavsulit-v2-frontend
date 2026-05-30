import {
  LogIn,
  MailCheck,
  PlusSquare,
  Store,
  UserPlus,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FadeIn } from '../ui/FadeIn';

const STEPS = [
  {
    Icon: UserPlus,
    title: 'Sign Up',
    desc: 'Register with your @cvsu.edu.ph email to join the campus marketplace.',
    tone: 'step-1',
    shape: 'circle',
  },
  {
    Icon: MailCheck,
    title: 'Verify Email',
    desc: 'Open the verification link in your inbox — check spam if you do not see it.',
    tone: 'step-2',
    shape: 'square',
  },
  {
    Icon: LogIn,
    title: 'Log In',
    desc: 'Sign back in with your verified CvSU account and get your CvSU verified badge.',
    tone: 'step-3',
    shape: 'square',
  },
  {
    Icon: Store,
    title: 'Create Shop',
    desc: 'Set up your shop profile — name, details, and what you sell on campus.',
    tone: 'step-4',
    shape: 'circle',
  },
  {
    Icon: PlusSquare,
    title: 'Post Shop',
    desc: 'Publish your shop so fellow CvSU students can browse, message, and order.',
    tone: 'step-5',
    shape: 'square',
  },
];

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
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return {
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(18px)',
      transition: `opacity 0.45s ease ${delay}ms, transform 0.45s ease ${delay}ms`,
    },
  };
}

function HowItWorksBentoCard({ step, index }) {
  const { Icon } = step;
  const { ref, style } = useScrollReveal(index * 90);

  return (
    <article
      ref={ref}
      className={`how-bento-card how-bento-card--${step.tone}`}
      style={style}
    >
      <span className={`how-icon-tile how-icon-tile--${step.shape}`} aria-hidden>
        <Icon size={30} strokeWidth={2.35} color="#1a1a1a" />
      </span>
      <p className="how-bento-step-num">Step {index + 1}</p>
      <h3 className="how-bento-title">{step.title}</h3>
      <p className="how-bento-desc">{step.desc}</p>
    </article>
  );
}

export function HowItWorksSection() {
  const ctaReveal = useScrollReveal(450);

  return (
    <section className="how-it-works-section" aria-labelledby="how-it-works-heading">
      <div className="how-it-works-inner">
        <FadeIn>
          <aside className="how-it-works-quote">
            <p className="trending-section-label">Process</p>
            <div className="how-quote-panel">
              <h2 id="how-it-works-heading" className="how-quote-heading">
                Verify your CvSU email. Start selling on campus.
              </h2>
            </div>
            <blockquote className="how-quote-line">
              “Your @cvsu.edu.ph account unlocks posting — and the CvSU verified
              badge students trust.”
            </blockquote>
            <p className="how-it-works-lead">
              Sign up, confirm your email, log back in, create your shop, and
              post it for the campus to see.
            </p>
            <p className="how-access-notice">
              <strong>No CvSU email?</strong> You can browse shops, order, and
              pre-order — but you cannot post a shop until you register with a
              verified @cvsu.edu.ph account.
            </p>
          </aside>
        </FadeIn>

        <div className="how-bento-frame">
          <div className="how-bento-grid">
            {STEPS.map((step, i) => (
              <HowItWorksBentoCard key={step.title} step={step} index={i} />
            ))}
            <div
              ref={ctaReveal.ref}
              className="how-bento-cta"
              style={ctaReveal.style}
            >
              <p className="how-bento-cta-kicker">Access levels</p>
              <p className="how-bento-cta-text">
                Browse &amp; order: everyone. Post a shop: verified CvSU email
                only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
