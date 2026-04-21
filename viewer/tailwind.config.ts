/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lumelle: '#FBC7B2',
        'restaurant-app': '#55362A',
        '21st-dev': '#64748B',
      },
    },
  },
  plugins: [],
}
