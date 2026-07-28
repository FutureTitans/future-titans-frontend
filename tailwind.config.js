/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF8F3',
          dark: '#F0E8D4',
          light: '#FDFCF9',
        },
        gold: {
          DEFAULT: '#D4AF37',
          dark: '#B8952E',
          light: '#F5D76E',
          muted: 'rgba(212, 175, 55, 0.15)',
        },
        primary: {
          red: '#DC2626',
          'dark-red': '#991B1B',
          'light-red': '#FEE2E2',
        },
        accent: {
          gold: '#D97706',
          'light-gold': '#FCD34D',
          amber: '#F59E0B',
        },
        neutral: {
          dark: '#1A1A1A',
          medium: '#6B6B6B',
          light: '#F3F4F6',
          border: '#E5E7EB',
        },
        semantic: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        edo: ['Edo', 'sans-serif'],
        roca: ['roca-two', 'Georgia', 'Times New Roman', 'serif'],
        'heading-now': ['"Heading Now"', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display': ['2.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
        'heading': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '400' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
        'glass-lg': '0 16px 48px 0 rgba(31, 38, 135, 0.18)',
        'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.08)',
        'gold': '0 8px 24px rgba(212, 175, 55, 0.30)',
        'gold-lg': '0 12px 32px rgba(212, 175, 55, 0.40)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F5D76E 100%)',
        'gold-gradient-dark': 'linear-gradient(135deg, #C5A028 0%, #D4AF37 100%)',
        'cream-gradient': 'radial-gradient(at 0% 0%, rgba(212, 175, 55, 0.12) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(245, 215, 110, 0.10) 0px, transparent 50%), #FAF8F3',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.30)' },
          '50%': { boxShadow: '0 0 30px rgba(212, 175, 55, 0.50)' },
        },
      },
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [],
};
