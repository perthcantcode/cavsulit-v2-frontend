import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#052e16] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[12rem] sm:text-[16rem] font-extrabold text-[#16a34a]/20 leading-none">404</span>
      </div>
      <div className="absolute inset-0 pointer-events-none text-4xl opacity-30">
        <span className="absolute top-[15%] left-[10%] animate-float">🎓</span>
        <span className="absolute top-[20%] right-[12%] animate-float delay-2">🏫</span>
        <span className="absolute bottom-[25%] left-[15%] animate-float delay-3">🛍️</span>
      </div>
      <div className="relative z-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Lost in the campus?</h1>
        <p className="text-white/55 mb-8 max-w-md mx-auto">
          This page doesn&apos;t exist or was moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#16a34a] text-white font-semibold hover:shadow-glow-green transition-all duration-350"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
