/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0A1628',
          card: '#1A2942',
          border: '#334155',
          hover: '#243351',
          input: '#1A2942',
          accent: {
            primary: '#3B82F6',
            hover: '#2563EB',
            muted: '#2563EB'
          },
          text: {
            primary: '#F9FAFB',
            secondary: '#D1D5DB',
            muted: '#9CA3AF'
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
