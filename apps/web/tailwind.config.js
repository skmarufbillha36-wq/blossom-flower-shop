/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // ─── Container: centered with responsive padding ───────────
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem',
      },
    },
    extend: {
      colors: {
        // Brand palette — warm, premium, floral
        brand: {
          50:  '#fdf4f3',
          100: '#fce8e6',
          200: '#fbd0cc',
          300: '#f8aea9',
          400: '#f37d75',
          500: '#e8534a',   // Primary brand color
          600: '#d43b32',
          700: '#b12e26',
          800: '#932923',
          900: '#7a2723',
        },
        blush: {
          50:  '#fef7f0',
          100: '#fdecd9',
          200: '#fbd5b2',
          300: '#f8b880',
          400: '#f4914d',
          500: '#f17228',
        },
        sage: {
          50:  '#f2f7f4',
          100: '#e0ece4',
          200: '#c2d9cc',
          300: '#96bda7',
          400: '#659b7f',
          500: '#437d60',
        },
      },
      fontFamily: {
        sans:    ['var(--font-inter)',    'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)','Georgia',   'serif'],
      },
      boxShadow: {
        brand: '0 8px 30px rgba(232, 83, 74, 0.25)',
      },
      animation: {
        'fade-in':  'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' },             '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' },      '100%': { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};
