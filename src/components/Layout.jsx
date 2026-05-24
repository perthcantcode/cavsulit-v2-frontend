import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Heart, Menu, X, Store, LogOut, ChevronDown, User, Sun, Moon } from 'lucide-react';

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('cav-theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('cav-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return [dark, () => setDark(d => !d)];
}

export function Layout() {
  const { user, logout } = useAuth();
  const location         = useLocation();
  const navigate         = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, toggleDark]      = useDarkMode();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropOpen) return;
    const fn = () => setDropOpen(false);
    setTimeout(() => document.addEventListener('click', fn), 0);
    return () => document.removeEventListener('click', fn);
  }, [dropOpen]);

  const isActive = (p) => location.pathname === p || location.pathname.startsWith(p + '/');

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setDropOpen(false);
  };

  const scrollToAbout = (e) => {
    if (isHome) {
      e.preventDefault();
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { to: '/browse',    label: 'Browse' },
    { to: '/post-shop', label: 'Post Shop', auth: true },
    { to: '/my-shop',   label: 'My Shop',   auth: true },
    { to: '/messages',  label: 'Messages',  auth: true },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* NAV */}
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled || !isHome ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled || !isHome ? 'blur(14px)' : 'none',
          WebkitBackdropFilter: scrolled || !isHome ? 'blur(14px)' : 'none',
          borderBottom: scrolled || !isHome ? '1px solid var(--border)' : '1px solid transparent',
          boxShadow: scrolled ? '0 2px 16px var(--green-glow)' : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ background: 'var(--primary)' }}
            >
              <ShoppingBag size={15} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-base" style={{ color: 'var(--text)' }}>CavSulit</span>
              <span className="hidden sm:block text-[10px] font-medium" style={{ color: 'var(--text-muted)', lineHeight: 1, marginTop: -2 }}>CVSU Marketplace</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks
              .filter(n => !n.auth || user)
              .map(n => (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(n.to)
                      ? 'font-semibold'
                      : ''
                  }`}
                  style={{
                    background: isActive(n.to) ? 'var(--primary)' : 'transparent',
                    color: isActive(n.to) ? '#fff' : 'var(--text-muted)',
                  }}
                  onMouseEnter={e => { if (!isActive(n.to)) e.target.style.color = 'var(--text)'; }}
                  onMouseLeave={e => { if (!isActive(n.to)) e.target.style.color = 'var(--text-muted)'; }}
                >
                  {n.label}
                </Link>
              ))
            }
            {!user && (
              <a
                href="/#about"
                onClick={scrollToAbout}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{ color: 'var(--text-muted)' }}
              >
                About
              </a>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={toggleDark}
              className="btn-ghost p-2 rounded-full"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {user ? (
              <>
                <Link
                  to="/wishlist"
                  className="btn-ghost hidden sm:flex p-2 rounded-full"
                  aria-label="Wishlist"
                >
                  <Heart size={16} />
                </Link>
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setDropOpen(d => !d); }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200"
                    style={{
                      border: '1px solid var(--border)',
                      background: dropOpen ? 'var(--bg-alt)' : 'transparent',
                    }}
                  >
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} alt={user.fullName} className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: 'var(--primary)' }}
                      >
                        {user.fullName?.[0] || 'U'}
                      </div>
                    )}
                    <span className="text-sm font-semibold hidden sm:block" style={{ color: 'var(--text)' }}>
                      {user.fullName?.split(' ')[0]}
                    </span>
                    <ChevronDown
                      size={13}
                      className="hidden sm:block transition-transform duration-200"
                      style={{
                        color: 'var(--text-muted)',
                        transform: dropOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  </button>
                  {dropOpen && (
                    <div
                      className="glass absolute right-0 top-12 w-52 py-2 z-50"
                      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="px-4 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
                        <div className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{user.fullName}</div>
                        <div className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{user.email}</div>
                      </div>
                      {[
                        { to: '/profile',  icon: <User size={13}/>,    label: 'My Profile' },
                        { to: '/my-shop',  icon: <Store size={13}/>,   label: 'My Shop' },
                        { to: '/wishlist', icon: <Heart size={13}/>,   label: 'Wishlist' },
                        { to: '/verified', icon: <span className="text-[11px]">⭐</span>, label: 'My Badge' },
                      ].map(item => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setDropOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                          style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-alt)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          {item.icon} {item.label}
                        </Link>
                      ))}
                      <div style={{ borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 4 }}>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm w-full transition-colors text-red-500"
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <LogOut size={13} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden btn-ghost p-2 rounded-lg"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <>
            <div
              className="md:hidden fixed inset-y-0 right-0 w-72 max-w-[85vw] z-50 p-6 pt-20 flex flex-col gap-1"
              style={{
                background: 'var(--bg)',
                borderLeft: '1px solid var(--border)',
                boxShadow: '-8px 0 32px rgba(0,0,0,0.08)',
              }}
            >
              {navLinks.filter(n => !n.auth || user).map(n => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    background: isActive(n.to) ? 'var(--primary)' : 'transparent',
                    color: isActive(n.to) ? '#fff' : 'var(--text)',
                  }}
                >
                  {n.label}
                </Link>
              ))}
              {!user && (
                <div className="mt-4 flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary justify-center">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary justify-center">Sign Up</Link>
                </div>
              )}
            </div>
            <button
              type="button"
              className="md:hidden fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.25)' }}
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            />
          </>
        )}
      </nav>

      <main className="flex-1 min-h-0">
        <Outlet />
      </main>

      {!isHome && (
        <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-alt)' }} className="py-8 mt-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                <ShoppingBag size={13} className="text-white" />
              </div>
              <span className="font-bold" style={{ color: 'var(--text)' }}>CavSulit</span>
            </div>
            <div style={{ color: 'var(--text-muted)' }}>© 2026 CavSulit · ITEC Group 3 · Cavite State University</div>
            <a href="https://cavsulit.com" style={{ color: 'var(--text-muted)' }} className="hover:underline">cavsulit.com</a>
          </div>
        </footer>
      )}
    </div>
  );
}
