/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#437066',
        'primary-light': '#5a8a7c',
        'primary-dark': '#2d4a42',
      },
      fontFamily: {
        arabic: ['Noto Sans Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
