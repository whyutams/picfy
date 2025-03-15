/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["public/**/*.{ejs,html,js}", "public/*.{ejs,html,js}"],
  theme: {
    extend: {
      colors: {
        
      },
    },
    plugins: [
      require('tailwind-scrollbar'),
      {
        autoprefixer: {},
      },
    ],
  }
}
