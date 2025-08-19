/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A", // deep blue
        secondary: "#9333EA", // purple
        accent: "#F59E0B", // amber
      },
    },
  },
  plugins: [],
};
