import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}', 'index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Urbanist',
          'Catamaran',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Ubuntu',
          'Cantarell',
          'Noto Sans',
          'sans-serif',
        ],
        mono: [
          'Source Code Pro',
          'Dank Mono',
          'Operator Mono',
          'Inconsolata',
          'Fira Mono',
          'ui-monospace',
          'SF Mono',
          'Monaco',
          'Droid Sans Mono',
          'monospace',
        ],
      },
      colors: {
        app: '#1d1f20', // Between gray-900 and gray-800
      },
      flex: {
        fixed: '0 0 auto',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeOut: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        popIn: {
          from: {
            opacity: '0',
            transform: 'translate(-50%, -48%) scale(0.96)',
          },
          to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
        popOut: {
          from: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
          to: {
            opacity: '0',
            transform: 'translate(-50%, -48%) scale(0.96)',
          },
        },
      },
      animation: {
        fadeIn: 'fadeIn 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        fadeOut: 'fadeOut 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        popIn: 'popIn 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        popOut: 'popOut 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
