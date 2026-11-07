
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        emerald: {
          primary: "#176B52",
          light: "#E8F3ED",
        },
        cream: "#F7F8F2",
      },
    },
  },
  plugins: [],
};
