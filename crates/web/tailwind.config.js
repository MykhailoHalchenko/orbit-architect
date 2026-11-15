/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        orbit: {
          cyan: "#55d7ff",
          panel: "#071321",
        },
      },
    },
  },
  plugins: [],
};
