// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        // This is the key you will use in your JSX, e.g., 'font-custom'
        serif: ['"LibertinusSerif"', "serif"],
        sans: ['"LibertinusSerifBlod"', "sans-serif"],
        meaCulpa: ['"MeaCulpa"', "cursive"],
      },
    },
  },
  plugins: [],
};
