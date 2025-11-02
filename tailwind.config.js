import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'bg-dark-900', 'bg-dark-800', 'bg-dark-700', 'bg-dark-600',
    'text-light-50', 'text-light-100', 'text-light-200', 'text-light-300', 'text-light-400', 'text-light-500', 'text-light-600', 'text-light-700', 'text-light-800', 'text-light-900',
    'bg-accent-blue', 'bg-accent-purple', 'bg-accent-green', 'bg-accent-orange', 'bg-accent-red',
    'text-accent-blue', 'text-accent-purple', 'text-accent-green', 'text-accent-orange', 'text-accent-red',
    'border-accent-blue', 'border-accent-purple', 'border-accent-green', 'border-accent-orange', 'border-accent-red'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0D0D0D',
          800: '#111111',
          700: '#1a1a1a',
          600: '#2a2a2a',
        },
        light: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        accent: {
          blue: '#3B82F6',
          purple: '#8B5CF6',
          green: '#10B981',
          orange: '#F59E0B',
          red: '#EF4444',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',
          black: 'rgba(0, 0, 0, 0.2)',
          light: 'rgba(255, 255, 255, 0.8)',
          dark: 'rgba(0, 0, 0, 0.1)',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      }
    },
  },
  plugins: [typography],
};