import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4AF37', // Church gold
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#000000', // Black
          foreground: '#FFFFFF',
        },
        background: '#FFFFFF', // White
        foreground: '#000000', // Black
        // Church-appropriate accent colors
        'church-gold': '#D4AF37',
        'church-dark': '#2C3E50',
        'church-light': '#ECF0F1',
        'church-accent': '#3498DB',
      },
      // Add accessible contrast ratios
      contrast: {
        high: '1.5', // Higher contrast for accessibility
      },
    },
  },
  plugins: [],
}
export default config
