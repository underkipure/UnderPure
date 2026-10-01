import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'lg': '900px',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        serif: ['"Dala Floda"', 'serif'],
        serifItalic: ['"Dala Floda Italic"', '"Dala Floda"', 'serif'],
        serifBold: ['"Dala Floda Bold"', '"Dala Floda"', 'serif'],
        'dala-roman': ['"Dala Floda Roman"', '"Dala Floda"', 'serif'],
        'dala-italic': ['"Dala Floda Italic"', '"Dala Floda"', 'serif'],
      },
      letterSpacing: {
        'subtle': '0.01em',
        'tight-nav': '0.02em',
      },
      colors: {
        brand: {
          light: '#f9f9f9',
          dark: '#111111',
          accent: '#e6dcd3'
        }
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
      }
    },
  },
  plugins: [
    typography,
  ],
}

