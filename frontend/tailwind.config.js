/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Communa brand palette, consolidated from the legacy landing/login/
        // register pages (legacy/src/app/**/page.tsx) into real theme tokens.
        primary: {
          DEFAULT: '#0F6E56',
          dark: '#085041',
          darker: '#0D1F1A',
          light: '#E1F5EE',
        },
        accent: '#1D9E75',
        mint: {
          DEFAULT: '#9FE1CB',
          soft: '#5DCAA5',
        },
        ink: '#111827',
        surface: '#F9FAFB',
        category: {
          purple: { DEFAULT: '#534AB7', dark: '#26215C', light: '#EEEDFE' },
          amber: { DEFAULT: '#854F0B', dark: '#412402', light: '#FAEEDA' },
        },
        danger: '#E24B4A',
      },
    },
  },
  plugins: [],
};
