/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cav: {
          bg:     '#052e16',
          surface:'rgba(255,255,255,0.06)',
          primary:'#16a34a',
          accent: '#22c55e',
          muted:  'rgba(255,255,255,0.55)',
          green: {
            dark:    '#052e16',
            DEFAULT: '#16a34a',
            light:   '#22c55e',
            accent:  '#4ade80',
            vibrant: '#86efac',
          },
          text: { dark: '#ffffff', muted: 'rgba(255,255,255,0.55)' },
        },
      },
      fontFamily: {
        sans:    ['"Space Grotesk"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.3)',
      },
      animation: {
        'marquee-ltr':     'marquee-ltr 25s linear infinite',
        'marquee-rtl':     'marquee-rtl 20s linear infinite',
        float:             'float 6s ease-in-out infinite',
        'fade-up':         'fadeUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'letter-rise':     'letterRise 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'loader-pulse':    'loaderPulse 1.2s ease-in-out infinite',
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
          '50%':      { transform: 'translateY(-18px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        letterRise: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        loaderPulse: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%':      { transform: 'translateX(200%)' },
        },
      },
    },
  },
  plugins: [],
};
