/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // This line is crucial for the toggle switch!
  theme: {
    extend: {
      colors: {
        // We are using modern, Aave-like slate and indigo tones
        slate: {
          850: '#151e2e',
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        // Switching to a clean, modern sans-serif for the DeFi look
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}