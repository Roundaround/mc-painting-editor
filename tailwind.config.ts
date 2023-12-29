import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
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
