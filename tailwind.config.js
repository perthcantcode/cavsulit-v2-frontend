/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'green-neon': '#3fff00',
        'green-forest': '#3ca305',
        'yellow-brand': '#ffe600',
        ivory: '#fbfff2',
        'ivory-alt': '#f3f5ec',
        'near-black': '#1a1a1a',
      },
      fontFamily: {
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        pixel: ['"Press Start 2P"', 'monospace'],
        syne: ['Syne', 'sans-serif'],
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'marquee-ltr':  'marquee-ltr 30s linear infinite',
        'marquee-rtl':  'marquee-rtl 24s linear infinite',
        float:          'float 6s ease-in-out infinite',
        'fade-up':      'fadeUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'letter-rise':  'letterRise 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'loader-pulse': 'loaderPulse 1.4s ease-in-out infinite',
      },
      keyframes: {
        'marquee-ltr': {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'marquee-rtl': {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-16px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        letterRise: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        loaderPulse: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%':      { transform: 'translateX(220%)' },
        },
      },
    },
  },
  plugins: [],
};
