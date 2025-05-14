/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        sabYellow: "#ffd400",
        sabPurple: "#6c5ce7",
        sabBlack: "#1a1a1a"
      }
    }
  },
  plugins: []
}
