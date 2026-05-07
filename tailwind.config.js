/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{vue,js}"],
  theme: {
    extend: {
      // Warna kustom
      colors: {
        sage: {
          50: "#f4f7f4",
          100: "#e6ede6",
          200: "#cdd9cd",
          400: "#87a487",
          600: "#557155",
        },
        cream: {
          100: "#faf7ef",
        },
        charcoal: {
          DEFAULT: "#2d3436",
          muted: "#7a8585",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
