import { paintingSchema } from 'utils/files';
import { z } from 'zod';

export const getDefaultPainting = (id: string): Painting =>
  paintingSchema.parse({
    id,
  });

export type Painting = z.output<typeof paintingSchema> & { data?: string };

const generateBlankImage = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  ctx.fillStyle = 'rgb(42, 93, 183)';
  ctx.fillRect(0, 0, width, height);
  return canvas.toDataURL();
};

export function getPaintingImage(painting?: Painting) {
  return (
    painting?.data ||
    generateBlankImage(
      (painting?.width || 1) * 16,
      (painting?.height || 1) * 16
    )
  );
}
