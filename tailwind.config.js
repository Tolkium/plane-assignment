/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-smoke': {
          '50': '#f6f7f7',
          '100': '#e1e6e5',
          '200': '#c3ccca',
          '300': '#9daba8',
          '400': '#778885',
          '500': '#5e6e6b',
          '600': '#4a5755',
          '700': '#3d4846',
          '800': '#343b3b',
          '900': '#2e3333',
          '950': '#171c1c',
        },
        'dark-orange': '#805638',
        'dark-orange-hover': '#8b5e3d',



      }
    },
  },
  plugins: [],
}

