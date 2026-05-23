import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import api from '../utils/api';
import { ShopCard } from '../components/ShopCard';
import { useAuth } from '../context/AuthContext';
import { FadeIn } from '../components/ui/FadeIn';
import { GlassCard } from '../components/ui/GlassCard';
import { MarqueeStrip } from '../components/ui/Marquee';
import { EyeFollow } from '../components/ui/EyeFollow';
import { ServicesWheel } from '../components/ui/ServicesWheel';

const FLOATING = [
  { label: 'Merch', emoji: '🛍️', className: 'top-[8%] left-[5%] delay-1' },
  { label: 'Food', emoji: '🍜', className: 'top-[12%] right-[8%] delay-2' },
  { label: 'Services', emoji: '💼', className: 'bottom-[28%] left-[2%] delay-3' },
  { label: 'Freelance', emoji: '🎨', className: 'bottom-[22%] right-[5%] delay-4' },
  { label: 'Reviews', emoji: '⭐', className: 'top-[42%] left-[0%] delay-2' },
  { label: 'Pre-orders', emoji: '📦', className: 'top-[38%] right-[0%] delay-1' },
];

const FEATURES = [
  { icon: '🔍', title: 'Discover Shops', desc: 'Browse by category or college building' },
  { icon: '💬', title: 'Message & Order', desc: 'Chat directly with sellers, place pre-orders' },
  { icon: '🏪', title: 'Post Your Shop', desc: 'Free shop setup in under 5 minutes' },
  { icon: '✅', title: 'Verified Sellers', desc: 'CvSU-verified badges for trusted sellers' },
  { icon: '📦', title: 'Pre-orders', desc: 'Reserve items before they sell out' },
  { icon: '⭐', title: 'Reviews & Ratings', desc: 'Community-driven trust system' },
];

const STEPS = [
  { n: '01', title: 'Sign Up', desc: 'Create your CvSU student account' },
  { n: '02', title: 'Verify', desc: 'Submit your student ID for the verified badge' },
  { n: '03', title: 'Create Shop', desc: 'Set up your shop in under 5 minutes' },
  { n: '04', title: 'Post', desc: 'Add your products, services, or menu' },
  { n: '05', title: 'Sell', desc: 'Start earning from your campus community' },
];

const FAQ = [
  { q: 'How do I create a shop on CavSulit?', a: 'Sign up with your CvSU email, verify your account, then tap Post Shop. Add photos, location, and products — it takes under five minutes.' },
  { q: 'Do I need a CvSU email to register?', a: 'Anyone can browse. To post shops you need a verified @cvsu.edu.ph email so buyers know you are part of the campus community.' },
  { q: 'How do I place a pre-order?', a: 'Open a shop, go to the Pre-Order tab, fill in your items and pickup details, or message the seller directly from their shop page.' },
  { q: 'How does seller verification work?', a: 'Register with your CvSU email and verify it in Firebase. Verified sellers get a CvSU badge on their profile and shops.' },
  { q: 'Is CavSulit free to use?', a: 'Yes — posting shops, browsing, messaging, and pre-orders are completely free for students.' },
  { q: 'How do I contact a seller?', a: 'Tap Message Seller on any shop page to start a real-time conversation.' },
];

const TRUST = [
  { icon: '✅', title: 'Verified Seller', desc: 'CvSU email confirmed', glow: 'border-cav-accent shadow-glow-green' },
  { icon: '⏳', title: 'Pending Verification', desc: 'Awaiting student ID review', glow: 'border-white/20' },
  { icon: '🏆', title: 'Top Seller', desc: 'Highest-rated campus shops', glow: 'border-amber-500/50' },
];

function PhoneMockup() {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    setTilt({
      x: (e.clientX - cx) / 20,
      y: -(e.clientY - cy) / 20,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative w-[260px] sm:w-[280px] mx-auto will-change-transform"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
    >
      <div className="rounded-[2rem] border border-white/20 bg-white/10 backdrop-blur-xl p-3 shadow-2xl">
        <div className="rounded-[1.5rem] overflow-hidden bg-[#064e3b] aspect-[9/16] flex flex-col">
          <div className="p-3 border-b border-white/10 text-xs font-bold text-white">Browse</div>
          <div className="flex-1 p-2 space-y-2 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-white/10 border border-white/10" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Landing() {
  const { user } = useAuth();
  const [trending, setTrending] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saved, setSaved]       = useState(new Set());
  const [openFaq, setOpenFaq]     = useState(0);
  const [hoverFeature, setHoverFeature] = useState(null);

  useEffect(() => {
    api.get('/shops?sort=popular&limit=4')
      .then(({ data }) => setTrending(data.shops || []))
      .catch(() => setTrending([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    api.get('/wishlist')
      .then(({ data }) => setSaved(new Set(data.map((item) => item.shopId))))
      .catch(() => {});
  }, [user]);

  const handleSaveToggle = (id, isSaved) => {
    setSaved((prev) => {
      const n = new Set(prev);
      isSaved ? n.add(id) : n.delete(id);
      return n;
    });
  };

  return (
    <div className="text-white">
      {/* HERO */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 py-24 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: 'linear-gradient(180deg, #052e16 0%, #064e3b 45%, #000 100%)',
          }}
        />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-30 -z-10"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%)' }}
        />

        <div className="max-w-4xl mx-auto text-center w-full">
          <div className="animate-fade-up opacity-0 inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-semibold mb-6">
            🎓 CvSU Exclusive
          </div>
          <h1
            className="animate-fade-up opacity-0 font-extrabold leading-[1.05] mb-2"
            style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', animationDelay: '0.1s' }}
          >
            INTRODUCING
          </h1>
          <p
            className="animate-fade-up opacity-0 text-cav-accent font-bold mb-4"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', animationDelay: '0.2s' }}
          >
            CavSulit
          </p>
          <p className="animate-fade-up opacity-0 text-lg text-white/55 mb-10 max-w-xl mx-auto" style={{ animationDelay: '0.3s' }}>
            Your campus marketplace, reimagined.
          </p>

          <div className="relative animate-fade-up opacity-0 my-8" style={{ animationDelay: '0.4s' }}>
            {FLOATING.map((f) => (
              <span
                key={f.label}
                className={`absolute hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs font-medium animate-float ${f.className}`}
              >
                {f.emoji} {f.label}
              </span>
            ))}
            <PhoneMockup />
          </div>

          <div className="animate-fade-up opacity-0 flex flex-wrap items-center justify-center gap-4 mt-8" style={{ animationDelay: '0.6s' }}>
            <Link to="/register" className="btn-primary hover:scale-105">
              Get Started <ArrowRight size={16}/>
            </Link>
            <Link to="/browse" className="btn-secondary">Browse Shops</Link>
          </div>
        </div>
      </section>

      <MarqueeStrip />

      {/* TRUST */}
      <section id="about" className="py-24 sm:py-36 px-4 max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="text-4xl font-bold mb-3">Built on trust.</h2>
          <p className="text-white/55 mb-12 max-w-lg">Every shop is reviewed. Every seller is accountable.</p>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6">
          {TRUST.map((c, i) => (
            <FadeIn key={c.title} delay={i * 100}>
              <GlassCard
                className={`p-6 hover:-translate-y-2 transition-all duration-350 ease-smooth border-2 ${c.glow}`}
                style={{ transform: `translateY(${i * 8}px)` }}
              >
                <span className="text-3xl">{c.icon}</span>
                <h3 className="font-bold text-lg mt-3">{c.title}</h3>
                <p className="text-sm text-white/55 mt-1">{c.desc}</p>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 sm:py-36 px-4 max-w-3xl mx-auto">
        <FadeIn>
          <h2 className="text-4xl font-bold mb-2">All-in-one platform</h2>
          <p className="text-white/55 mb-10">Everything a CvSU student seller and buyer needs.</p>
        </FadeIn>
        <div className="divide-y divide-white/10">
          {FEATURES.map((f, i) => (
            <FadeIn key={f.title} delay={i * 50}>
              <div
                className={`flex items-center gap-4 py-5 px-4 -mx-4 rounded-xl transition-all duration-350 ease-smooth border-l-4
                  ${hoverFeature === i ? 'border-l-cav-accent bg-cav-accent/10' : 'border-l-transparent'}`}
                onMouseEnter={() => setHoverFeature(i)}
                onMouseLeave={() => setHoverFeature(null)}
              >
                <span
                  className={`w-3 h-3 bg-cav-accent flex-shrink-0 transition-transform duration-350
                    ${hoverFeature === i ? 'scale-125 rotate-45' : 'rotate-45 opacity-60'}`}
                />
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <div className={`font-semibold ${hoverFeature === i ? 'text-white' : 'text-white/90'}`}>{f.title}</div>
                  <div className="text-sm text-white/55">{f.desc}</div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 sm:py-36 px-4 text-center">
        <FadeIn>
          <h2 className="text-4xl font-bold mb-12">OUR SERVICES</h2>
        </FadeIn>
        <FadeIn delay={100}>
          <ServicesWheel />
        </FadeIn>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 sm:py-36 px-4 overflow-hidden">
        <FadeIn className="max-w-6xl mx-auto text-right mb-10">
          <h2 className="text-4xl font-bold">HOW IT WORKS</h2>
        </FadeIn>
        <div className="flex gap-4 overflow-x-auto pb-4 px-4 max-w-6xl mx-auto snap-x snap-mandatory">
          {STEPS.map((s, i) => (
            <FadeIn key={s.n} delay={i * 80} className="flex-shrink-0 w-64 snap-start">
              <GlassCard className="p-6 h-full hover:-translate-y-1.5 hover:border-cav-accent/40 transition-all duration-350">
                <span className="text-4xl font-bold text-white/20">{s.n}</span>
                <h3 className="font-bold text-lg mt-2">{s.title}</h3>
                <p className="text-sm text-white/55 mt-2">{s.desc}</p>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section className="py-24 sm:py-36 px-4 max-w-6xl mx-auto">
        <FadeIn className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold">Trending on campus</h2>
            <p className="text-white/55 mt-2">Real shops from real CvSU students.</p>
          </div>
          <Link to="/browse?sort=popular" className="text-cav-accent text-sm font-semibold hover:underline hidden sm:inline">
            Browse all shops →
          </Link>
        </FadeIn>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-52 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trending.map((s) => (
              <ShopCard key={s.id} shop={s} saved={saved.has(s.id)} onSaveToggle={handleSaveToggle} />
            ))}
          </div>
        )}
        <Link to="/browse" className="btn-secondary mt-8 inline-flex sm:hidden">Browse all shops</Link>
      </section>

      {/* FAQ */}
      <section className="py-24 sm:py-36 px-4 max-w-2xl mx-auto">
        <FadeIn>
          <h2 className="text-4xl font-bold mb-10">GOT QUESTIONS?</h2>
        </FadeIn>
        <div className="border-l-2 border-cav-accent pl-6 space-y-2">
          {FAQ.map((item, i) => (
            <FadeIn key={i} delay={i * 40}>
              <div className="relative">
                <span className="absolute -left-[1.65rem] top-3 w-3 h-3 rounded-full bg-cav-accent" />
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full text-left py-3 font-semibold text-white/90 hover:text-white"
                >
                  — {item.q}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-350 ease-smooth text-sm text-white/55
                    ${openFaq === i ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  {item.a}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* MOTTO + EYE */}
      <section className="py-24 sm:py-36 px-4 text-center">
        <FadeIn>
          <p className="text-3xl sm:text-4xl italic font-medium max-w-2xl mx-auto mb-12">
            &ldquo;Empowering campus entrepreneurs.&rdquo;
          </p>
          <EyeFollow />
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer className="relative py-24 px-4 overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[6rem] sm:text-[8rem] font-extrabold text-white/[0.07] whitespace-nowrap">CAVSULIT</span>
        </div>
        <div className="relative max-w-6xl mx-auto text-center z-10">
          <nav className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-white/70">
            <Link to="/browse" className="hover:text-white">Browse</Link>
            <a href="#about" className="hover:text-white">About</a>
            <Link to="/messages" className="hover:text-white">Contact</Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
          </nav>
          <Link to="/register" className="btn-primary inline-flex mb-10">Get Started →</Link>
          <p className="text-xs text-white/40">© 2025 CavSulit. Built for CvSU students.</p>
        </div>
      </footer>
    </div>
  );
}
