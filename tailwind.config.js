/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // make sure this path matches your file structure
    './public/index.html', // optional, if you have HTML files in public
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
