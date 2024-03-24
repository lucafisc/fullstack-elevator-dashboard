/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#E0491F",
        primary: "#13191d",
        outline: "#1b232a",
        primaryHover: "#2A2F33",
      },
    },
  },
  plugins: [],
};
