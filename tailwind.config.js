/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'hover:text-ava-red',
    'hover:text-ava-green',
    'hover:text-ava-blue',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'ava-bg': '#FEFEFE',
        'ava-green': '#00BA9F',
        'ava-grey': '#969696',
        'ava-blue': '#118AD3',
        'ava-red': '#FF1654',
        'ava-gradient-1': '#00B5A0',
        'ava-gradient-2': '#00C69B',
        'ava-item-active': '#02816E',
        'ava-item-hover': '#00907C',
      }
    },

  },
  plugins: [],
}
