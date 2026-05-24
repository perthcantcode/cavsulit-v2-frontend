import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import api from '../utils/api';
import { ShopCard } from '../components/ShopCard';
import { useAuth } from '../context/AuthContext';
import { FadeIn } from '../components/ui/FadeIn';
import { GlassCard } from '../components/ui/GlassCard';
import { MarqueeStrip } from '../components/ui/Marquee';
import { EyeFollow } from '../components/ui/EyeFollow';

const FEATURES = [
  { icon: '🔍', title: 'Discover Shops', desc: 'Browse by category, college, or search by name' },
  { icon: '💬', title: 'Message & Order', desc: 'Chat directly with sellers and place pre-orders' },
  { icon: '🏪', title: 'Post Your Shop', desc: 'Free shop setup in under 5 minutes' },
  { icon: '✅', title: 'Verified Sellers', desc: 'CvSU-verified badges for trusted community sellers' },
  { icon: '📦', title: 'Pre-orders', desc: 'Reserve items before they sell out on campus' },
  { icon: '⭐', title: 'Reviews & Ratings', desc: 'Community-driven trust and accountability' },
];

const STEPS = [
  { n: '01', title: 'Sign Up', desc: 'Create your free CvSU student account in seconds' },
  { n: '02', title: 'Verify', desc: 'Submit your student ID for the trusted badge' },
  { n: '03', title: 'Create Shop', desc: 'Set up your storefront in under 5 minutes' },
  { n: '04', title: 'Post Products', desc: 'Add your items, services, or food menu' },
  { n: '05', title: 'Sell & Earn', desc: 'Start earning from your campus community' },
];

const FAQ = [
  { q: 'How do I create a shop on CavSulit?', a: 'Sign up with your CvSU email, verify your account, then tap Post Shop. Add photos, location, and products — it takes under five minutes.' },
  { q: 'Do I need a CvSU email to register?', a: 'Anyone can browse. To post shops you need a verified @cvsu.edu.ph email so buyers know you are part of the campus community.' },
  { q: 'How do I place a pre-order?', a: 'Open a shop, fill in your items and pickup details, or message the seller directly from their shop page.' },
  { q: 'How does seller verification work?', a: 'Register with your CvSU email and verify it. Verified sellers get a CvSU badge on their profile and shops.' },
  { q: 'Is CavSulit free to use?', a: 'Yes — posting shops, browsing, messaging, and pre-orders are completely free for students.' },
  { q: 'How do I contact a seller?', a: 'Tap Message Seller on any shop page to start a real-time conversation.' },
];

const TRUST = [
  { icon: '✅', title: 'CvSU Verified', desc: 'Email confirmed, identity trusted', accent: true },
  { icon: '⏳', title: 'Pending Review', desc: 'Awaiting student ID verification', accent: false },
  { icon: '🏆', title: 'Top Seller', desc: 'Highest-rated shops on campus', gold: true },
];

export function Landing() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [trending, setTrending] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saved, setSaved]       = useState(new Set());
  const [openFaq, setOpenFaq]   = useState(0);
  const [query, setQuery]       = useState('');
  const [hoverFeature, setHoverFeature] = useState(null);
  const [stats, setStats]       = useState({ shops: 42, users: 300 });

  useEffect(() => {
    api.get('/shops?sort=popular&limit=4')
      .then(({ data }) => setTrending(data.shops || []))
      .catch(() => setTrending([]))
      .finally(() => setLoading(false));

    api.get('/stats').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) return;
    api.get('/wishlist')
      .then(({ data }) => setSaved(new Set(data.map(i => i.shopId))))
      .catch(() => {});
  }, [user]);

  const handleSaveToggle = (id, isSaved) => {
    setSaved(prev => {
      const n = new Set(prev);
      isSaved ? n.add(id) : n.delete(id);
      return n;
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/browse?q=${encodeURIComponent(query.trim())}`);
    else navigate('/browse');
  };

  return (
    <div style={{ color: 'var(--text)' }}>

      {/* ── HERO ── */}
      <section
        className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 py-24 text-center overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, var(--primary) 0%, #1B5C40 60%, var(--bg) 100%)',
        }}
      >
        {/* Subtle radial overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(255,255,255,0.07), transparent)',
          }}
        />

        <div className="relative max-w-3xl mx-auto">
          {/* Tag */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-7"
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(8px)',
            }}
          >
            🎓 For every CvSU entrepreneur
          </div>

          <h1
            className="font-extrabold leading-[1.0] mb-4 text-white"
            style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}
          >
            You've got the hustle
          </h1>
          <p
            className="font-bold mb-6"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4.5rem)',
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.1,
            }}
          >
            we've got the platform.
          </p>

          <p className="text-base sm:text-lg mb-10 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)' }}>
            CavSulit is the free campus marketplace where CvSU students, instructors, and
            community members promote their businesses, sidelines, and services.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-8">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search shops, food, services…"
                className="w-full pl-10 pr-4 py-3 rounded-full text-sm font-medium focus:outline-none"
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                  backdropFilter: 'blur(8px)',
                }}
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-full font-semibold text-sm flex-shrink-0 transition-all hover:opacity-90"
              style={{ background: '#fff', color: 'var(--primary)' }}
            >
              Search
            </button>
          </form>

          {/* Stats */}
          <div className="flex items-center justify-center gap-10 text-center">
            {[
              { val: `${stats.shops || 42}+`, label: 'Active Shops' },
              { val: `${stats.users || 300}+`, label: 'Community' },
              { val: 'Free', label: 'Always' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-extrabold text-white">{s.val}</div>
                <div className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: '#fff', color: 'var(--primary)' }}
            >
              Get Started <ArrowRight size={15} />
            </Link>
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5"
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff',
                backdropFilter: 'blur(8px)',
              }}
            >
              Browse Shops
            </Link>
          </div>
        </div>
      </section>

      <MarqueeStrip />

      {/* ── TRUST BADGES ── */}
      <section id="about" className="py-24 sm:py-32 px-4 max-w-6xl mx-auto">
        <FadeIn>
          <div className="section-tag">Trust System</div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: 'var(--text)' }}>Built on trust.</h2>
          <p className="mb-12 max-w-lg" style={{ color: 'var(--text-muted)' }}>
            Every shop is reviewed. Every seller is accountable. Verified badges mean real students.
          </p>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-5">
          {TRUST.map((c, i) => (
            <FadeIn key={c.title} delay={i * 100}>
              <div
                className="p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'var(--surface)',
                  border: c.accent
                    ? '2px solid var(--accent)'
                    : c.gold
                    ? '2px solid #F59E0B'
                    : '1px solid var(--border)',
                  boxShadow: c.accent ? '0 4px 24px var(--green-glow)' : 'var(--shadow-card)',
                }}
              >
                <span className="text-3xl">{c.icon}</span>
                <h3 className="font-bold text-lg mt-3 mb-1" style={{ color: 'var(--text)' }}>{c.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{c.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── FEATURES LIST ── */}
      <section style={{ background: 'var(--bg-alt)' }} className="py-24 sm:py-32 px-4">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <div className="section-tag">Platform</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: 'var(--text)' }}>All-in-one platform.</h2>
            <p className="mb-10" style={{ color: 'var(--text-muted)' }}>Everything a CvSU student seller and buyer needs.</p>
          </FadeIn>
          <div style={{ borderLeft: '2px solid var(--border)' }}>
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 50}>
                <div
                  className="flex items-center gap-4 py-5 px-5 -ml-px rounded-r-xl transition-all duration-300 cursor-default"
                  style={{
                    borderLeft: hoverFeature === i ? '2px solid var(--accent)' : '2px solid transparent',
                    background: hoverFeature === i ? 'rgba(64,145,108,0.06)' : 'transparent',
                    marginLeft: -1,
                  }}
                  onMouseEnter={() => setHoverFeature(i)}
                  onMouseLeave={() => setHoverFeature(null)}
                >
                  <span className="text-xl flex-shrink-0">{f.icon}</span>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{f.title}</div>
                    <div className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{f.desc}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 sm:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="mb-10">
            <div className="section-tag">Process</div>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--text)' }}>How it works.</h2>
          </FadeIn>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {STEPS.map((s, i) => (
              <FadeIn key={s.n} delay={i * 70} className="flex-shrink-0 w-56 snap-start">
                <div
                  className="p-6 rounded-2xl h-full transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-card)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <span className="text-4xl font-bold" style={{ color: 'var(--border)' }}>{s.n}</span>
                  <h3 className="font-bold text-base mt-3 mb-1.5" style={{ color: 'var(--text)' }}>{s.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING SHOPS ── */}
      <section style={{ background: 'var(--bg-alt)' }} className="py-24 sm:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="flex items-end justify-between mb-8">
            <div>
              <div className="section-tag">Community</div>
              <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--text)' }}>Trending on campus.</h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>Real shops from real CvSU students.</p>
            </div>
            <Link
              to="/browse?sort=popular"
              className="hidden sm:inline-flex text-sm font-semibold items-center gap-1 transition-opacity hover:opacity-70"
              style={{ color: 'var(--accent)' }}
            >
              Browse all <ArrowRight size={13} />
            </Link>
          </FadeIn>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-56 rounded-2xl animate-pulse"
                  style={{ background: 'var(--border)' }}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trending.map(s => (
                <ShopCard key={s.id} shop={s} saved={saved.has(s.id)} onSaveToggle={handleSaveToggle} />
              ))}
            </div>
          )}
          <Link to="/browse" className="btn-secondary mt-8 inline-flex sm:hidden">Browse all shops</Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 sm:py-32 px-4">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <div className="section-tag">FAQ</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-10" style={{ color: 'var(--text)' }}>Got questions?</h2>
          </FadeIn>
          <div className="space-y-1">
            {FAQ.map((item, i) => (
              <FadeIn key={i} delay={i * 40}>
                <div
                  className="rounded-xl overflow-hidden transition-all duration-200"
                  style={{
                    border: openFaq === i ? '1px solid var(--accent)' : '1px solid var(--border)',
                    background: openFaq === i ? 'rgba(64,145,108,0.04)' : 'var(--surface)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    className="w-full text-left px-5 py-4 font-semibold text-sm flex items-center justify-between gap-3"
                    style={{ color: 'var(--text)' }}
                  >
                    {item.q}
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-transform"
                      style={{
                        background: openFaq === i ? 'var(--accent)' : 'var(--bg-alt)',
                        color: openFaq === i ? '#fff' : 'var(--text-muted)',
                        transform: openFaq === i ? 'rotate(45deg)' : 'none',
                      }}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className="text-sm overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight: openFaq === i ? '120px' : '0',
                      opacity: openFaq === i ? 1 : 0,
                      padding: openFaq === i ? '0 20px 16px' : '0 20px 0',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {item.a}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOTTO + EYE ── */}
      <section style={{ background: 'var(--bg-alt)' }} className="py-24 sm:py-32 px-4 text-center">
        <FadeIn>
          <p
            className="text-2xl sm:text-3xl font-medium italic max-w-xl mx-auto mb-12"
            style={{ color: 'var(--text-muted)' }}
          >
            &ldquo;Empowering campus entrepreneurs, one hustle at a time.&rdquo;
          </p>
          <EyeFollow />
        </FadeIn>
      </section>

      {/* ── CTA FOOTER ── */}
      <section
        className="py-24 px-4 text-center relative overflow-hidden"
        style={{ background: 'var(--primary)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 100%, rgba(255,255,255,0.06), transparent)' }}
        />
        {/* Large watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ fontSize: 'clamp(5rem, 14vw, 10rem)', fontWeight: 900, color: 'rgba(255,255,255,0.05)', whiteSpace: 'nowrap' }}
        >
          CAVSULIT
        </div>
        <div className="relative z-10 max-w-xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Ready to start selling?</h2>
            <p className="mb-8" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Join hundreds of CvSU students already on CavSulit. Free forever.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: '#fff', color: 'var(--primary)' }}
              >
                Get Started <ArrowRight size={15} />
              </Link>
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                }}
              >
                Browse Shops
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Footer nav */}
        <nav className="relative z-10 flex flex-wrap justify-center gap-6 mt-16 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <Link to="/browse" className="hover:text-white transition-colors">Browse</Link>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <Link to="/messages" className="hover:text-white transition-colors">Contact</Link>
          <Link to="/post-shop" className="hover:text-white transition-colors">Post a Shop</Link>
        </nav>
        <p className="relative z-10 text-xs mt-6" style={{ color: 'rgba(255,255,255,0.3)' }}>
          © 2026 CavSulit · ITEC Group 3 · Cavite State University
        </p>
      </section>
    </div>
  );
}
