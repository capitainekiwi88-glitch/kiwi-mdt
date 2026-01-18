/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ajout des couleurs spécifiques MDT ici
        gold: {
          400: '#fbbf24',
          // Tu peux ajouter les autres nuances si besoin
        },
        neutral: {
          900: '#0d0d0d', // Ton background personnalisé
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}