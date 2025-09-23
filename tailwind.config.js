export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      screens: {
        'max-1030': { 'max': '1030px' }, // abaixo de 1030px
        'min-1031': { 'min': '1031px' }, // de 1031px pra cima
      },
    },
  },
  plugins: [],
}
