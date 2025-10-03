/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'love-pink': '#ec4899',
        'love-purple': '#a855f7',
      },
    },
  },
  plugins: [],
}