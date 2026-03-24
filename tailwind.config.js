/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'brutal': '6px 6px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '10px 10px 0px 0px rgba(0,0,0,1)',
      },
      colors: {
        neo: {
          yellow: '#FFD919',
          pink: '#FF6B6B',
          cyan: '#4ECDC4',
          bg: '#F4F4F0'
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
