/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "Brown":"#1E140F",
        "Black":"#010001"
      }
    },
  },
  plugins: [],
}