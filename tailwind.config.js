/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")
module.exports = {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "header": ["\'Montserrat\'", ...defaultTheme.fontFamily.sans],
        "body": ["\'Work Sans\'", ...defaultTheme.fontFamily.sans],
      },

    },
  },
  plugins: [require('daisyui')],
};
