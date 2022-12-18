import AdmZip, { IZipEntry } from 'adm-zip';
import { app, BrowserWindow, dialog } from 'electron';
import path from 'path';
import url from 'url';
import { mcmetaSchema, packSchema, Painting } from './schemas';

export const appTempDir = path.join(app.getPath('temp'), 'mc-painting-editor');

export function fileUrl(filePath: string): string {
  return (
    url
      .pathToFileURL(filePath)
      .toString()
      .replace(/^file:\/\//, 'mc-painting-editor://') +
    '?v=' +
    Date.now()
  );
}

export async function openZipFile(parentWindow: BrowserWindow) {
  const client = parentWindow.webContents;

  const files = await dialog.showOpenDialog(parentWindow, {
    properties: ['openFile'],
    filters: [
      {
        name: 'Zip Files',
        extensions: ['zip'],
      },
    ],
  });

  if (files.canceled) {
    return '';
  }

  const filename = files.filePaths[0];
  let packName = filename.substring(
    filename.lastIndexOf('/') + 1,
    filename.lastIndexOf('.')
  );

  const zip = new AdmZip(filename);
  const entries = zip.getEntries();

  const paintingImages: IZipEntry[] = [];
  const extraPaintingImages: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory) {
      continue;
    }

    if (entry.entryName === 'pack.mcmeta') {
      const text = entry.getData().toString('utf8');
      const mcmeta = mcmetaSchema.parse(JSON.parse(text));

      client.send('setPackFormat', mcmeta.pack.packFormat);
      if (mcmeta.pack.description) {
        client.send('setDescription', mcmeta.pack.description);
      }

      continue;
    }

    if (entry.entryName === 'custompaintings.json') {
      const text = entry.getData().toString('utf8');
      const pack = packSchema.parse(JSON.parse(text));

      client.send('setId', pack.id);
      if (pack.name) {
        packName = pack.name;
      }

      const paintings = new Map<string, Painting>();
      for (const painting of pack.paintings) {
        paintings.set(painting.id, painting);
      }
      client.send('setPaintings', paintings);

      continue;
    }

    if (entry.entryName === 'pack.png') {
      zip.extractEntryTo(entry, appTempDir, false, true);
      const filename = entry.entryName.substring(
        entry.entryName.lastIndexOf('/') + 1
      );
      const filePath = path.join(appTempDir, filename);
      client.send('setIcon', fileUrl(filePath));

      continue;
    } else if (entry.entryName.endsWith('.png')) {
      paintingImages.push(entry);
      continue;
    }
  }

  client.send('setName', packName);

  for (const entry of paintingImages) {
    const filename = entry.entryName.substring(
      entry.entryName.lastIndexOf('/') + 1
    );
    const key = filename.substring(0, filename.lastIndexOf('.'));

    const dir = path.join(appTempDir, 'paintings');
    zip.extractEntryTo(entry, dir, false, true);
    const filePath = path.join(appTempDir, 'paintings', filename);
    client.send('setPaintingPath', key, fileUrl(filePath));
  }

  client.send('setExtraPaintingImages', extraPaintingImages);

  return filename;
}
