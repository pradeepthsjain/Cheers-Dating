/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#b30000",
        primaryLight: "#b30000",
      },
      fontFamily: {
        concertOne: ["Concert One", "sans-serif"],
        ropaSans: ["Ropa Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
