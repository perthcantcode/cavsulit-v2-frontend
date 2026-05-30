import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Menu, X, Store, LogOut, ChevronDown, User, Award } from 'lucide-react';
import { CavSulitMark } from './ui/CavSulitMark';
import { CavSulitWordmark } from './ui/CavSulitWordmark';
import { Avatar } from './Avatar';

export function Layout() {
  const { user, logout } = useAuth();
  const location         = useLocation();
  const navigate         = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    { to: '/browse',    label: 'Browse',    hover: 'neon' },
    { to: '/post-shop', label: 'Post Shop', hover: 'yellow', auth: true },
    { to: '/my-shop',   label: 'My Shop',   hover: 'lime', auth: true },
    { to: '/messages',  label: 'Messages',  hover: 'neon', auth: true },
  ];

  const ICON_PROPS = { size: 16, strokeWidth: 2.25 };

  const userMenuItems = [
    { to: '/profile',  Icon: User,   label: 'My Profile' },
    { to: '/my-shop',  Icon: Store,  label: 'My Shop' },
    { to: '/wishlist', Icon: Heart,  label: 'Wishlist' },
    { to: '/verified', Icon: Award,  label: 'My Badge' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* NAV */}
      <nav
        className={`cav-nav sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'scrolled' : ''}`}
        style={{ borderBottom: !scrolled ? '3px solid #1a1a1a' : undefined }}
      >
        <div className="max-w-6xl mx-auto pl-2 pr-4 sm:pl-3 sm:pr-6 min-h-[4.25rem] h-auto py-2 flex items-center justify-between gap-6">
          {/* Logo — mark (larger) + wordmark */}
          <Link to="/" className="cav-nav-brand group">
            <CavSulitMark className="cav-nav-mark transition-transform group-hover:-translate-y-0.5" />
            <CavSulitWordmark variant="nav" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks
              .filter(n => !n.auth || user)
              .map(n => (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`cav-nav-link${isActive(n.to) ? ' is-active' : ''}`}
                  data-hover={n.hover}
                >
                  {n.label}
                </Link>
              ))
            }
            {!user && (
              <a
                href="/#about"
                onClick={scrollToAbout}
                className="cav-nav-link"
                data-hover="yellow"
              >
                About
              </a>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user && (
              <Link
                to="/wishlist"
                className={`cav-nav-icon-btn hidden sm:inline-flex${isActive('/wishlist') ? ' is-active' : ''}`}
                aria-label="Wishlist"
              >
                <Heart size={16} strokeWidth={2.25} />
              </Link>
            )}

            {user ? (
              <>
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setDropOpen(d => !d); }}
                    className={`cav-nav-profile-btn${dropOpen ? ' is-open' : ''}`}
                  >
                    <Avatar user={user} size={28} />
                    <span className="text-sm font-semibold hidden sm:block cav-nav-profile-name">
                      {user.fullName?.split(' ')[0]}
                    </span>
                    <ChevronDown
                      {...ICON_PROPS}
                      size={14}
                      className={`cav-nav-profile-chevron hidden sm:block${dropOpen ? ' is-open' : ''}`}
                    />
                  </button>
                  {dropOpen && (
                    <div
                      className="nav-dropdown"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="nav-dropdown-header">
                        <div className="font-semibold text-sm truncate">{user.fullName}</div>
                        <div className="nav-dropdown-email truncate">{user.email}</div>
                      </div>
                      {userMenuItems.map(({ to, Icon, label }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setDropOpen(false)}
                          className="nav-dropdown-item"
                        >
                          <span className="nav-dropdown-icon" aria-hidden>
                            <Icon {...ICON_PROPS} />
                          </span>
                          <span>{label}</span>
                        </Link>
                      ))}
                      <div className="nav-dropdown-footer">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="nav-dropdown-item nav-dropdown-item--logout"
                        >
                          <span className="nav-dropdown-icon nav-dropdown-icon--logout" aria-hidden>
                            <LogOut {...ICON_PROPS} />
                          </span>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm">Log In</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden btn-ghost p-2"
            >
              {menuOpen ? <X size={20} strokeWidth={2.25} /> : <Menu size={20} strokeWidth={2.25} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown panel */}
        {menuOpen && (
          <>
            <div
              className="md:hidden border-t-[3px] border-[#1a1a1a]"
              style={{ background: 'var(--bg)' }}
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-2">
                {navLinks.filter(n => !n.auth || user).map(n => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setMenuOpen(false)}
                    className={`cav-nav-link w-full justify-start${isActive(n.to) ? ' is-active' : ''}`}
                    data-hover={n.hover}
                  >
                    {n.label}
                  </Link>
                ))}

                {!user && (
                  <div className="mt-3 flex flex-col gap-2">
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary justify-center">Log In</Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary justify-center">Get Started</Link>
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              className="md:hidden fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.15)' }}
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            />
          </>
        )}
      </nav>

      <main className="flex-1 min-h-0">
        <Outlet />
      </main>

      {!isHome && !location.pathname.startsWith('/messages') && (
        <footer style={{ borderTop: '3px solid #1a1a1a', background: 'var(--bg-alt)' }} className="py-8 mt-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2.5">
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
