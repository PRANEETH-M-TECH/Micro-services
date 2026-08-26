/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Communa brand green, pulled out of the legacy landing page's
        // inline hex classes (legacy/src/app/page.tsx) into a real theme token.
        primary: {
          DEFAULT: '#0F6E56',
          dark: '#085041',
          light: '#E6F4F0',
        },
      },
    },
  },
  plugins: [],
};
