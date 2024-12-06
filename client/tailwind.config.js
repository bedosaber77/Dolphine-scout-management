/**@type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // Update paths as per your folder structure
  theme: {
    extend: {
      colors: {
        primary: '#fff', // Adjust primary color
        secondary: '#fff',
        background: '#fff',
        textPrimary: '#fff',
        textSecondary: '#fff',
      },
    },
  },
  plugins: [],
};
