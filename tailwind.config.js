/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Potato colors (husband)
        potato: {
          50: '#FFFDF8',
          100: '#FFF8E6',
          200: '#FFF0CC',
          300: '#FFE8B3',
          400: '#FFE59D',
          500: '#FFD966', // base
          600: '#E6C14D',
          700: '#CCAA33',
          800: '#B3941A',
          900: '#997D00',
          primary: '#FFE59D'
        },
        // Rabbit colors (wife)
        rabbit: {
          50: '#FFFAFC',
          100: '#FFF0F5',
          200: '#FFE6EE',
          300: '#FFDCE6',
          400: '#FFC1D6',
          500: '#FFB3CC', // base
          600: '#E699B3',
          700: '#CC8099',
          800: '#B36680',
          900: '#994D66',
          primary: '#FFC1D6'
        },
        // Semantic colors
        couple: {
          accent: '#FFD4E5'
        },
        income: {
          DEFAULT: '#A8E6A3'
        },
        expense: {
          DEFAULT: '#FFB3B3'
        },
        warning: {
          DEFAULT: '#FFF3A0'
        },
        // Background colors
        background: {
          cream: '#FFFBF5'
        },
        surface: {
          white: '#FFFFFF'
        },
        border: {
          light: '#F0E6D6'
        },
        text: {
          dark: '#5A4A3A',
          medium: '#8A7A6A',
          light: '#BAA090'
        }
      },
      fontFamily: {
        'pretendard': ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        'gmarket': ['Gmarket Sans', 'Pretendard', 'sans-serif']
      },
      fontSize: {
        'display-1': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-1': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-2': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-base': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.875rem', { lineHeight: '1.4', fontWeight: '400' }]
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem'
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem'
      },
      boxShadow: {
        'card': '0 2px 8px rgba(90, 74, 58, 0.06)',
        'floating': '0 4px 16px rgba(90, 74, 58, 0.1)'
      },
      animation: {
        'potato-bounce': 'potato-bounce 2s ease-in-out infinite',
        'rabbit-hop': 'rabbit-hop 1.8s ease-in-out infinite',
        'pulse-heart': 'pulse 2s infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        'potato-bounce': {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' }
        },
        'rabbit-hop': {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '40%': { transform: 'translateY(-8px) rotate(-2deg)' },
          '60%': { transform: 'translateY(-4px) rotate(1deg)' }
        },
        'fadeIn': {
          'from': { opacity: '0' },
          'to': { opacity: '1' }
        },
        'slideUp': {
          'from': { transform: 'translateY(20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}