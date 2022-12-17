import { z } from 'zod';

export const paintingSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  artist: z.string().optional(),
  height: z.number().min(1).max(8).default(1),
  width: z.number().min(1).max(8).default(1),
  path: z.string().optional(),
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

export type Painting = z.output<typeof paintingSchema>;

export const getDefaultPainting = (id: string): Painting =>
  paintingSchema.parse({
    id,
  });
