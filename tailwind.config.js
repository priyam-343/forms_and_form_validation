/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Tells Tailwind to scan your React files
    "./public/index.html",      // Also your main HTML file
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}