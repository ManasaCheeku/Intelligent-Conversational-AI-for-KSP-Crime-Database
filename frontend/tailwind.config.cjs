/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        background: {
          dark: '#020617',
          medium: '#081120',
          light: '#0F172A',
        },
        accent: {
          cyan: '#00FFFF',
          'neon-blue': '#4D4DFF',
          'police-blue': '#0055A4',
          'purple-glow': '#BF40BF',
          emerald: '#50C878',
          'red-alert': '#FF0000',
          'golden-highlight': '#FFD700',
        }
      },
    },
  },
  plugins: [],
}
