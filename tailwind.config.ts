// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // enables dark mode via class (you toggle with `document.documentElement.classList.add/remove('dark')`)
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'slide-in-fade': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'toast-progress': {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
      },
      animation: {
        'slide-in-fade': 'slide-in-fade 0.3s ease-out',
        'fade-out': 'fade-out 0.4s ease-in forwards',
        'toast-progress': 'toast-progress linear forwards',
      },
    },
  },
  plugins: [],
}

export default config
