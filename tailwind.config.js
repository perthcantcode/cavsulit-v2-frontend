/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cav: {
          bg:          '#FAFAF7',
          'bg-alt':    '#F3F2EE',
          surface:     '#FFFFFF',
          border:      '#E5E3DC',
          primary:     '#1B4332',
          'primary-mid':'#2D6A4F',
          accent:      '#40916C',
          text:        '#1A1A1A',
          muted:       '#6B6B6B',
          light:       '#9A9A9A',
          glow:        'rgba(27,67,50,0.12)',
          // Dark mode tokens
          'dark-bg':      '#0D1F18',
          'dark-bg-alt':  '#111D17',
          'dark-surface': '#162920',
          'dark-border':  '#1E3A2E',
          'dark-text':    '#F0EFE9',
          'dark-muted':   'rgba(240,239,233,0.55)',
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
        'green-sm':  '0 2px 12px rgba(27,67,50,0.10)',
        'green-md':  '0 4px 24px rgba(27,67,50,0.15)',
        'green-glow':'0 0 20px rgba(64,145,108,0.25)',
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
