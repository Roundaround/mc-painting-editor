import JSZip from 'jszip';
import { z } from 'zod';
import { getDefaultPainting, Painting } from './painting';

export const paintingSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  artist: z.string().optional(),
  height: z.number().min(1).max(8).default(1),
  width: z.number().min(1).max(8).default(1),
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

export const blobToBase64 = (blob: Blob): Promise<string | undefined> => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve((reader.result as string | null) || undefined);
    };
  });
};

export async function readFile(
  file: File,
  setters: {
    setPackFormat: (packFormat: number) => void;
    setName: (name: string) => void;
    setDescription: (description: string) => void;
    setIcon: (icon: string) => void;
    setId: (id: string) => void;
    setPaintings: (paintings: Map<string, Painting>) => void;
  }
) {
  const zip = await JSZip.loadAsync(file);

  let packName = file.name.replace(/\.zip$/i, '');

  const {
    setPackFormat,
    setName,
    setDescription,
    setIcon,
    setId,
    setPaintings,
  } = setters;
  const loadedPaintings = new Map<string, Painting>();

  for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
    if (zipEntry.dir) {
      continue;
    }

    if (zipEntry.name === 'pack.mcmeta') {
      const text = await zipEntry.async('text');
      const mcmeta = mcmetaSchema.parse(JSON.parse(text));
      setPackFormat(mcmeta.pack.packFormat);
      setDescription(mcmeta.pack.description || '');
    }

    if (zipEntry.name === 'custompaintings.json') {
      const text = await zipEntry.async('text');
      const pack = packSchema.parse(JSON.parse(text));
      setId(pack.id);
      if (pack.name) {
        packName = pack.name;
      }

      for (const painting of pack.paintings) {
        loadedPaintings.set(painting.id, {
          ...loadedPaintings.get(painting.id),
          ...painting,
        });
      }
    }

    if (zipEntry.name === 'pack.png') {
      const blob = await zipEntry.async('blob');
      const data = await blobToBase64(new Blob([blob], { type: 'image/png' }));
      setIcon(data || '');
    } else if (zipEntry.name.endsWith('.png')) {
      const blob = await zipEntry.async('blob');
      const data = await blobToBase64(new Blob([blob], { type: 'image/png' }));

      const key = zipEntry.name.substring(
        zipEntry.name.lastIndexOf('/') + 1,
        zipEntry.name.lastIndexOf('.')
      );
      loadedPaintings.set(key, {
        ...(loadedPaintings.get(key) || getDefaultPainting(key)),
        data,
      });
    }
  }

  setName(packName);
  setPaintings(loadedPaintings);
}
