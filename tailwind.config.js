/**
 * Tailwind configuration — add project theme colors
 */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // 你的主题色思路
        primary: '#F97316', // orange-500
        secondary: '#F59E0B', // amber-500
        bg: '#FFF7ED', // orange-50
      }
    }
  },
  plugins: []
}
