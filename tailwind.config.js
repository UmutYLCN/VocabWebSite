/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#ef233c',
          dark: '#0a0a0a'
        }
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0,0,0,0.37)'
      },
      backdropBlur: {
        xxl: '24px'
      }
    }
  },
  plugins: []
}
