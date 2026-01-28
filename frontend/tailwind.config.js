const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        base: {
          900: '#0b0b0f',
          800: '#111118',
          700: '#1a1a24',
          600: '#262634',
          200: '#c9c9d6',
          100: '#f5f5fa'
        },
        accent: {
          500: '#7c5cff',
          400: '#9b7dff',
          300: '#b8a2ff'
        }
      }
    }
  },
  plugins: []
}
