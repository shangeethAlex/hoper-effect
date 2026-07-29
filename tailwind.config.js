/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1f394f',
          50:  '#e8ecf0',
          100: '#c5d0da',
          200: '#9eb0bf',
          300: '#7690a4',
          400: '#557690',
          500: '#1f394f',
          600: '#1a3045',
          700: '#14253a',
          800: '#0e1b2c',
          900: '#080f1a',
        },
        orange: {
          DEFAULT: '#f0803c',
          50:  '#fef3ec',
          100: '#fcdec8',
          200: '#f9c09e',
          300: '#f5a174',
          400: '#f2914d',
          500: '#f0803c',
          600: '#d6692a',
          700: '#b5521c',
          800: '#8f3d11',
          900: '#662b08',
        },
        yellow: {
          DEFAULT: '#f9f31c',
          50:  '#fefee8',
          100: '#fdfdc0',
          200: '#fcfc94',
          300: '#fafa66',
          400: '#f9f31c',
          500: '#ddd618',
          600: '#bbb410',
          700: '#928d08',
          800: '#676302',
          900: '#3d3a00',
        },
        ink: '#1f394f',
      },
      fontFamily: {
        serif:   ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Playfair Display"',   'Georgia', 'serif'],
        sans:    ['"Outfit"', 'system-ui', 'sans-serif'],
        // The brand's hand-painted brush lettering (already loaded in
        // index.html and used by the Hero's marker strokes).
        marker:  ['"Permanent Marker"', 'cursive'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        widest2:  '0.35em',
      },
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)   rotate(var(--rot,0deg))' },
          '50%':      { transform: 'translateY(-10px) rotate(var(--rot,0deg))' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%':   { opacity: '0', transform: 'translateX(60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(-60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.88)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        tiltIn: {
          '0%':   { opacity: '0', transform: 'rotate(-5deg) scale(0.92)' },
          '100%': { opacity: '1', transform: 'rotate(0deg)  scale(1)' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        pulse2: {
          '0%,100%': { transform: 'scale(1)' },
          '50%':     { transform: 'scale(1.08)' },
        },
      },
      animation: {
        floatY:     'floatY 6s ease-in-out infinite',
        fadeUp:     'fadeUp 0.8s cubic-bezier(.16,1,.3,1) both',
        slideLeft:  'slideLeft 0.9s cubic-bezier(.16,1,.3,1) both',
        slideRight: 'slideRight 0.9s cubic-bezier(.16,1,.3,1) both',
        scaleIn:    'scaleIn 0.9s cubic-bezier(.16,1,.3,1) both',
        tiltIn:     'tiltIn 0.9s cubic-bezier(.16,1,.3,1) both',
        spinSlow:   'spin 18s linear infinite',
        pulse2:     'pulse2 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
