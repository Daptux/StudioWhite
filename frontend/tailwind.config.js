/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ---- Paleta de marca Studio White (brand book) ----
        linen: '#F6F4EF', // White Linen — fondo principal
        sand: '#D9D1C5', // Warm Sand — superficies / bordes cálidos
        stonegrey: '#C9C3B8', // Stone Grey — neutro cálido suave
        charcoal: '#121212', // Charcoal Black — texto / fondos oscuros
        ink: {
          950: '#0a0a0a',
          900: '#121212',
          800: '#1c1c1c',
          700: '#262626',
          600: '#333333',
        },
        // Acento de marca: Forest Sage (#8A927D)
        accent: {
          DEFAULT: '#8A927D',
          light: '#A7AE9B',
          dark: '#6E7561',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#1ebe5d',
        },
      },
      fontFamily: {
        // Cuerpo de texto
        sans: ['"Exo 2"', 'system-ui', 'sans-serif'],
        // Logotipo y títulos principales
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        // Títulos secundarios
        title: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        tightish: '-0.01em',
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(ellipse at top, rgba(138,146,125,0.12), transparent 60%)',
      },
      boxShadow: {
        glow: '0 12px 30px -12px rgba(138,146,125,0.45)',
        card: '0 18px 50px -24px rgba(18,18,18,0.18)',
        soft: '0 1px 2px rgba(18,18,18,0.04), 0 8px 24px -12px rgba(18,18,18,0.10)',
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
