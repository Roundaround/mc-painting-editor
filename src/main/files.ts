import { nanoid } from '@reduxjs/toolkit';
import AdmZip, { IZipEntry } from 'adm-zip';
import { app, BrowserWindow, dialog } from 'electron';
import path from 'path';
import url from 'url';
import {
  editorSlice,
  getDefaultPainting,
  metadataSlice,
  paintingsSlice,
} from '../common/store';
import { mcmetaSchema, packSchema } from './schemas';
import { store } from './store';

const { setLoading, setFilename } = editorSlice.actions;
const { setIcon, setPackFormat, setDescription, setId, setName } =
  metadataSlice.actions;
const { updatePainting, upsertPainting, setPaintings } = paintingsSlice.actions;

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

  store.dispatch(setLoading(true));

  try {
    const filename = files.filePaths[0];
    let packName = filename.substring(
      filename.lastIndexOf('/') + 1,
      filename.lastIndexOf('.')
    );

    const zip = new AdmZip(filename);
    const entries = zip.getEntries();

    const paintingUuids: { [key: string]: string } = {};
    const paintingImages: IZipEntry[] = [];

    for (const entry of entries) {
      if (entry.isDirectory) {
        continue;
      }

      if (entry.entryName === 'pack.mcmeta') {
        const text = entry.getData().toString('utf8');
        const mcmeta = mcmetaSchema.parse(JSON.parse(text));

        store.dispatch(setPackFormat(mcmeta.pack.packFormat));
        if (mcmeta.pack.description) {
          store.dispatch(setDescription(mcmeta.pack.description));
        }

        continue;
      }

      if (entry.entryName === 'custompaintings.json') {
        const text = entry.getData().toString('utf8');
        const pack = packSchema.parse(JSON.parse(text));

        store.dispatch(setId(pack.id));
        if (pack.name) {
          packName = pack.name;
        }

        store.dispatch(
          setPaintings(
            pack.paintings.map((painting) => {
              paintingUuids[painting.id] = nanoid();
              return {
                ...painting,
                uuid: paintingUuids[painting.id],
              };
            })
          )
        );

        continue;
      }

      if (entry.entryName === 'pack.png') {
        zip.extractEntryTo(entry, appTempDir, false, true);
        const filename = entry.entryName.substring(
          entry.entryName.lastIndexOf('/') + 1
        );
        const filePath = path.join(appTempDir, filename);
        store.dispatch(setIcon(fileUrl(filePath)));

        continue;
      } else if (entry.entryName.endsWith('.png')) {
        paintingImages.push(entry);
        continue;
      }
    }

    store.dispatch(setName(packName));

    for (const entry of paintingImages) {
      const filename = entry.entryName.substring(
        entry.entryName.lastIndexOf('/') + 1
      );
      const key = filename.substring(0, filename.lastIndexOf('.'));

      const dir = path.join(appTempDir, 'paintings');
      zip.extractEntryTo(entry, dir, false, true);
      const filePath = path.join(appTempDir, 'paintings', filename);
      if (!paintingUuids[key]) {
        const defaultPainting = getDefaultPainting();
        store.dispatch(
          upsertPainting({
            ...defaultPainting,
            id: key,
            uuid: paintingUuids[key],
          })
        );
      }
      store.dispatch(
        updatePainting({
          id: key,
          changes: {
            path: fileUrl(filePath),
          },
        })
      );
    }

    store.dispatch(setFilename(filename));
    return filename;
  } finally {
    store.dispatch(setFilename(''));
    store.dispatch(setLoading(false));
    return '';
  }
}
