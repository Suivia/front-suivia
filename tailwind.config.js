/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        s_green:  '#48BB78',
        s_yellow: '#ECC94B',
        s_red:    '#F56565',
        s_dark:   '#2D3748',
        s_darker: '#1A202C',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
