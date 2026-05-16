/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{vue,js}"],
  theme: {
    extend: {
      colors: {
        sage: {
          50:  "#eef6f1",
          100: "#cde8d8",
          200: "#9dcfb4",
          300: "#6db590",
          400: "#4a9e70",
          500: "#3a8260",
          600: "#2b6448",
        },
        cream: {
          50:  "#fffdf7",
          100: "#f0e8d8",
        },
        charcoal: {
          DEFAULT: "#1c2820",
          muted: "#5c7068",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
