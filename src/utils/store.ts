import { atom } from 'jotai';
import { z } from 'zod';

export const paintingSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  artist: z.string().optional(),
  height: z.number().min(1).max(8).default(1),
  width: z.number().min(1).max(8).default(1),
});

export const getDefaultPainting = (id: string) =>
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

export interface Paintings {
  [key: string]: z.output<typeof paintingSchema> & { data?: string };
}

export const fileNameAtom = atom('');
export const iconAtom = atom('');
export const packFormatAtom = atom(9);
export const descriptionAtom = atom('');
export const idAtom = atom('');
export const nameAtom = atom('');
export const paintingsAtom = atom<Paintings>({});
