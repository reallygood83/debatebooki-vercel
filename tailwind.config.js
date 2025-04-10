/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#ffb7c5',
          DEFAULT: '#ff8fa3',
          dark: '#ff6b8b',
        },
        secondary: {
          light: '#ffd1dc',
          DEFAULT: '#ffb7c5',
          dark: '#ff8fa3',
        },
      },
      fontFamily: {
        jua: ['Jua', 'sans-serif'],
        gaegu: ['Gaegu', 'cursive'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
} 