import { atom } from 'jotai';
import { z } from 'zod';

export const paintingSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  artist: z.string().optional(),
  height: z.number().min(1).max(8).default(1),
  width: z.number().min(1).max(8).default(1),
});

export const getDefaultPainting = (id: string): Painting =>
  paintingSchema.parse({
    id,
  });

export const packSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  paintings: z.array(paintingSchema).default([]),
});

export const mcmetaSchema = z.object({
  pack: z
    .object({
      pack_format: z.number().min(1).default(9),
      description: z.string().optional(),
    })
    .transform(({ pack_format, ...props }) => ({
      packFormat: pack_format,
      ...props,
    })),
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

export const iconAtom = atom('');
export const packFormatAtom = atom(9);
export const descriptionAtom = atom('');
export const idAtom = atom('');
export const nameAtom = atom('');
export const paintingsAtom = atom(new Map<string, Painting>());
