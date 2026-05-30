import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Home,
  Laptop,
  Mic2,
  Palette,
  ShoppingBag,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FadeIn } from './FadeIn';

const SERVICES = [
  {
    Icon: ShoppingBag,
    title: 'Products & Merch',
    desc: 'Shop campus-made clothing, accessories, and collectibles from fellow students.',
  },
  {
    Icon: UtensilsCrossed,
    title: 'Food & Drinks',
    desc: 'Pre-order meals, snacks, and drinks from sellers around campus.',
  },
  {
    Icon: Laptop,
    title: 'Freelance Services',
    desc: 'Find design, coding, tutoring, and repair help from student freelancers.',
  },
  {
    Icon: BookOpen,
    title: 'Academic Help',
    desc: 'Get notes, tutoring, and exam reviews from peers who know your courses.',
  },
  {
    Icon: Palette,
    title: 'Creative Services',
    desc: 'Book photography, art commissions, and printing for projects and events.',
  },
  {
    Icon: Sparkles,
    title: 'Personal Care',
    desc: 'Browse skincare, beauty, and wellness products from trusted campus sellers.',
  },
  {
    Icon: Home,
    title: 'Rentals & Lend',
    desc: 'Borrow gear, equipment, and everyday items without buying new.',
  },
  {
    Icon: Mic2,
    title: 'Events & Gigs',
    desc: 'Hire performers, emcees, and photographers for campus events.',
  },
];

export function ServicesCarousel() {
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);
  const activeRef = useRef(0);
  const len = SERVICES.length;

  const getCards = useCallback(() => {
    const track = trackRef.current;
    if (!track) return [];
    return [...track.querySelectorAll('.services-card')];
  }, []);

  const syncEdgePadding = useCallback(() => {
    const track = trackRef.current;
    const card = getCards()[0];
    if (!track || !card) return;
    const pad = Math.max(12, (track.clientWidth - card.offsetWidth) / 2);
    track.style.setProperty('--services-edge', `${pad}px`);
  }, [getCards]);

  const scrollToIndex = useCallback(
    (index, behavior = 'smooth') => {
      const track = trackRef.current;
      if (!track) return;

      const run = () => {
        const cards = getCards();
        const card = cards[index];
        if (!card) return;

        syncEdgePadding();

        const pad =
          parseFloat(getComputedStyle(track).getPropertyValue('--services-edge')) ||
          Math.max(12, (track.clientWidth - card.offsetWidth) / 2);
        const ideal = card.offsetLeft - pad;
        const max = Math.max(0, track.scrollWidth - track.clientWidth);
        const left = Math.max(0, Math.min(ideal, max));

        track.scrollTo({ left, behavior });
      };

      requestAnimationFrame(() => requestAnimationFrame(run));
    },
    [getCards, syncEdgePadding],
  );

  const navigateTo = useCallback(
    (index, behavior = 'smooth') => {
      const next = ((index % len) + len) % len;
      activeRef.current = next;
      setActive(next);
      scrollToIndex(next, behavior);
    },
    [len, scrollToIndex],
  );

  const go = useCallback(
    (dir) => {
      navigateTo(activeRef.current + dir, 'smooth');
    },
    [navigateTo],
  );

  useLayoutEffect(() => {
    syncEdgePadding();
    scrollToIndex(0, 'instant');
    activeRef.current = 0;
  }, [scrollToIndex, syncEdgePadding]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const ro = new ResizeObserver(() => {
      syncEdgePadding();
      scrollToIndex(activeRef.current, 'instant');
    });
    ro.observe(track);
    return () => ro.disconnect();
  }, [scrollToIndex, syncEdgePadding]);

  return (
    <section className="services-section" aria-labelledby="services-heading">
      <div className="services-section-inner">
        <FadeIn>
          <div className="services-section-header">
            <p className="trending-section-label">Services</p>
            <h2 id="services-heading" className="trending-section-title">
              What CavSulit supports.
            </h2>
          </div>
        </FadeIn>

        <div className="services-carousel-wrap">
          <button
            type="button"
            className="services-arrow carousel-arrow"
            onClick={() => go(-1)}
            aria-label="Previous service"
          >
            <ChevronLeft size={22} strokeWidth={2.5} aria-hidden />
          </button>

          <div className="services-carousel-viewport">
            <div className="services-track" ref={trackRef}>
              <div className="services-track-edge" aria-hidden />
              {SERVICES.map((service, i) => {
                const { Icon } = service;
                const isActive = i === active;
                return (
                  <article
                    key={service.title}
                    className={`services-card${isActive ? ' is-active' : ''}`}
                    onClick={() => navigateTo(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigateTo(i);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                  >
                    <span className="services-card-icon" aria-hidden>
                      <Icon size={28} strokeWidth={2.25} color="#1a1a1a" />
                    </span>
                    <h3 className="services-card-title">{service.title}</h3>
                    <p className="services-card-desc">{service.desc}</p>
                  </article>
                );
              })}
              <div className="services-track-edge" aria-hidden />
            </div>
          </div>

          <button
            type="button"
            className="services-arrow carousel-arrow"
            onClick={() => go(1)}
            aria-label="Next service"
          >
            <ChevronRight size={22} strokeWidth={2.5} aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}

/** @deprecated Use ServicesCarousel */
export function ServicesWheel() {
  return <ServicesCarousel />;
}
