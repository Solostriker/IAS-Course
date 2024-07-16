/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'around-xs': '0 0px 10px 0px rgba(0, 0, 0, 0.1)',
        'around-s': '0 0px 10px 0px rgba(0, 0, 0, 0.15)',
        'around': '0 0px 20px 0px rgba(0, 0, 0, 0.18)',
        'around-l': '0 0px 20px 0px rgba(0, 0, 0, 0.20)',
        'around-xl': '0 0px 20px 0px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
}

