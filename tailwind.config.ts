import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-contrast dark theme
        bg: {
          dark: '#0b1120',
          surface: '#162032',
          'surface-hover': '#1e2a42',
        },
        primary: {
          DEFAULT: '#22d3ee',
          hover: '#06b6d4',
        },
        text: {
          main: '#ffffff',
          muted: '#cbd5e1',
        },
        border: '#2d3f5f',
        success: '#22c55e',
        error: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
