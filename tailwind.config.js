/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0F172A',
          card: '#1E293B',
          border: '#334155',
          hover: '#243351',
          input: '#1E293B',
          accent: {
            primary: '#60A5FA',
            hover: '#3B82F6',
            muted: '#2563EB'
          },
          text: {
            primary: '#F8FAFC',
            secondary: '#CBD5E1',
            muted: '#94A3B8'
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
