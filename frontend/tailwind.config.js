/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0a0a0b',
          900: '#101012',
          800: '#17171a',
          700: '#1f1f23',
          600: '#2a2a30',
        },
        accent: {
          DEFAULT: '#b8894e',
          light: '#cda877',
          dark: '#8f6a39',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#1ebe5d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        tightish: '-0.01em',
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(ellipse at top, rgba(184,137,78,0.10), transparent 60%)',
      },
      boxShadow: {
        glow: '0 12px 30px -12px rgba(184,137,78,0.45)',
        card: '0 18px 50px -24px rgba(40,33,22,0.25)',
        soft: '0 1px 2px rgba(40,33,22,0.04), 0 8px 24px -12px rgba(40,33,22,0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
