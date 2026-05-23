import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Heart, Menu, X, Store, LogOut, ChevronDown, User } from 'lucide-react';

export function Layout() {
  const { user, logout } = useAuth();
  const location         = useLocation();
  const navigate         = useNavigate();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [dropOpen, setDropOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nav = [
    { to: '/browse',    label: 'Browse' },
    { to: '/post-shop', label: 'Post Shop' },
    { to: '/my-shop',   label: 'My Shop' },
    { to: '/messages',  label: 'Messages' },
  ];

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

  return (
    <div className="min-h-screen flex flex-col bg-cav-bg">
      <nav
        className={`sticky top-0 z-50 transition-all duration-[400ms] ease-smooth
          ${scrolled || !isHome
            ? 'backdrop-blur-md bg-white/[0.08] border-b border-white/10 shadow-lg'
            : 'bg-transparent border-b border-transparent'}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="font-bold text-lg text-white flex-shrink-0">
            CavSulit
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/browse" className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive('/browse') ? 'text-cav-accent' : 'text-white/70 hover:text-white'}`}>
              Browse
            </Link>
            <a href="/#about" onClick={scrollToAbout} className="px-4 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white transition-all">
              About
            </a>
            {user && nav.filter(n => n.to !== '/browse').map(n => (
              <Link key={n.to} to={n.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${isActive(n.to) ? 'text-cav-accent' : 'text-white/70 hover:text-white'}`}>
                {n.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/wishlist" className="btn-ghost hidden sm:flex relative" aria-label="Wishlist">
                  <Heart size={16}/>
                </Link>
                <div className="relative">
                  <button type="button" onClick={() => setDropOpen(!dropOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/10 transition-all">
                    <div className="w-7 h-7 rounded-full bg-cav-primary flex items-center justify-center text-white text-xs font-bold">
                      {user.fullName?.[0] || 'U'}
                    </div>
                    <span className="text-sm font-semibold text-white hidden sm:block">
                      {user.fullName?.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} className="text-white/50 hidden sm:block"/>
                  </button>
                  {dropOpen && (
                    <div className="absolute right-0 top-12 w-52 glass py-2 z-50">
                      <div className="px-4 py-2 border-b border-white/10">
                        <div className="font-bold text-sm text-white truncate">{user.fullName}</div>
                        <div className="text-xs text-white/50 truncate">{user.email}</div>
                      </div>
                      <Link to="/profile"  onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/10"><User size={14}/> My Profile</Link>
                      <Link to="/my-shop"  onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/10"><Store size={14}/> My Shop</Link>
                      <Link to="/wishlist" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/10"><Heart size={14}/> Wishlist</Link>
                      <Link to="/verified" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/10">⭐ My Badge</Link>
                      <div className="border-t border-white/10 mt-1 pt-1">
                        <button type="button" onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 w-full">
                          <LogOut size={14}/> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"    className="btn-ghost text-sm hidden sm:flex">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
              </div>
            )}
            <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="md:hidden btn-ghost p-2 text-white">
              {menuOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden fixed inset-y-0 right-0 w-72 max-w-[85vw] z-50 backdrop-blur-xl bg-[#052e16]/95 border-l border-white/15 p-6 pt-20 flex flex-col gap-2">
            <Link to="/browse" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-xl text-white font-medium">Browse</Link>
            <a href="/#about" onClick={() => { setMenuOpen(false); scrollToAbout({ preventDefault: () => {} }); }} className="px-4 py-3 rounded-xl text-white/80">About</a>
            {nav.slice(1).map(n => (
              <Link key={n.to} to={n.to} onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-white/80 font-medium">
                {n.label}
              </Link>
            ))}
            {!user && (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="px-4 py-3 text-white/70">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary justify-center mt-2">Sign Up</Link>
              </>
            )}
          </div>
        )}
        {menuOpen && (
          <button type="button" className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMenuOpen(false)} aria-label="Close menu" />
        )}
      </nav>

      <main className="flex-1 min-h-0"><Outlet /></main>

      {!isHome && (
        <footer className="border-t border-white/10 py-8 mt-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-cav-accent"/>
              <span className="font-bold text-white">CavSulit</span>
            </div>
            <div>© 2025 CavSulit. Built for CvSU students.</div>
          </div>
        </footer>
      )}
    </div>
  );
}
