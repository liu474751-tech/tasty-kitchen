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
      },
      // 自定义发光阴影效果
      boxShadow: {
        'neon-green': '0 0 20px rgba(34, 197, 94, 0.4)',
        'neon-orange': '0 0 20px rgba(249, 115, 22, 0.4)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.4)',
        'neon-red': '0 0 20px rgba(239, 68, 68, 0.4)',
        'neon-amber': '0 0 20px rgba(245, 158, 11, 0.4)',
      },
      // 自定义动画
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(245, 158, 11, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(245, 158, 11, 0.6)' },
        },
      },
    }
  },
  plugins: []
}
