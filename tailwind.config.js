/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Указываем путь к файлам проекта
  ],
  theme: {
    screens: {
      lg: {max: '1999.99px'},
      md: {max: '991.99px'},
      sm: {max: '767.99px'},
      xs: {max: '479.99px'},
    },
    extend: {},
  },
  plugins: [],
}


