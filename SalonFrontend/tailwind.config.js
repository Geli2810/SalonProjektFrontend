/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vi definerer professionelle salon-farver her
        salon: {
          beige: '#FAF9F6', // Baggrundsfarve (off-white/cream)
          gold: '#B45309',  // Accent farve til knapper/ikoner (amber-800)
          dark: '#1A1A1A',  // Tekst og overskrifter (næsten sort)
          gray: '#6B7280',  // Sekundær tekst
        }
      },
      fontFamily: {
        // Playfair Display giver det "dyre" mode-magasin look
        serif: ['Playfair Display', 'serif'],
        // Inter er ren og letlæselig til selve bookingen
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}