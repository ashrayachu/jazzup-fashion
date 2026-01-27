/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        "brand-black": "#010001",
        "brand-gold": "#FFD700",
        "brand-brown": "#1E140F",

        // Keep legacy names for backward compatibility
        "Brown": "#1E140F",
        "Black": "#010001"
      }
    },
  },
  plugins: [],
}