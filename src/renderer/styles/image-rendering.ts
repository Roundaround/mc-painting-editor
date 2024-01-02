import plugin from 'tailwindcss/plugin';

const imageRendering = plugin(
  ({ addUtilities, theme, e }) => {
    const values = theme('imageRendering', {}) ?? {};

    const imageRendering: [string, string][] = Object.entries(values);

    const utilities = imageRendering.map(([key, value]) => ({
      [`.${e(`image-${key}`)}`]: {
        imageRendering: value,
      },
    }));

    addUtilities(utilities);
  },
  {
    theme: {
      imageRendering: {
        auto: 'auto',
        pixelated: 'pixelated',
        'crisp-edges': 'crisp-edges',
      },
    },
  },
);

export default imageRendering;
