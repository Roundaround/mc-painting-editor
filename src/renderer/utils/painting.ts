import { z } from 'zod';

export const paintingSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  artist: z.string().optional(),
  height: z.number().min(1).max(8).default(1),
  width: z.number().min(1).max(8).default(1),
  path: z.string().optional(),
});

export const getDefaultPainting = (id: string): Painting =>
  paintingSchema.parse({
    id,
  });

export type Painting = z.output<typeof paintingSchema>;

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
    painting?.path ||
    generateBlankImage(
      (painting?.width || 1) * 16,
      (painting?.height || 1) * 16
    )
  );
}

function removeCacheBuster(url: string) {
  return url.replace(/\?v=\d+$/, '');
}

export const arePaintingsEqual = (a: Painting, b: Painting): boolean =>
  a.id === b.id &&
  a.name === b.name &&
  a.artist === b.artist &&
  a.height === b.height &&
  a.width === b.width &&
  removeCacheBuster(a.path || '') === removeCacheBuster(b.path || '');
