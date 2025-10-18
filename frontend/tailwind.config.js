/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0D0D0D',
        'dark-card': '#1A1A1A',
        'dark-border': '#2A2A2A',
        'brand-green': '#00F0A0',
        'brand-green-dark': '#00B377',
        'light-text': '#E0E0E0',
        'medium-text': '#A0A0A0',
        'dark-text': '#505050',
      },
      fontFamily: {
        'mono': ['"Fira Code"', 'monospace'],
      },
      boxShadow: {
        'green-glow': '0 0 15px rgba(0, 240, 160, 0.5)',
      }
    },
  },
  plugins: [],
}