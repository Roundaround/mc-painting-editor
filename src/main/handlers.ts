import AdmZip, { IZipEntry } from 'adm-zip';
import { dialog, IpcMainInvokeEvent } from 'electron';
import path from 'path';
import url from 'url';
import { AppContext } from './common';
import { mcmetaSchema, packSchema, Painting } from './schemas';

type IpcEventHandler = (
  event: IpcMainInvokeEvent,
  ...args: any[]
) => Promise<void> | any;
type IcpEventHandlerProducer = (appContext: AppContext) => IpcEventHandler;

function fileUrl(filePath: string): string {
  return (
    url
      .pathToFileURL(filePath)
      .toString()
      .replace(/^file:\/\//, 'mc-painting-editor://') +
    '?v=' +
    Date.now()
  );
}

export const handleOpenZipFile: IcpEventHandlerProducer =
  (appContext) => async (event, arg) => {
    const files = await dialog.showOpenDialog(appContext.mainWindow, {
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

        event.sender.send('setPackFormat', mcmeta.pack.packFormat);
        if (mcmeta.pack.description) {
          event.sender.send('setDescription', mcmeta.pack.description);
        }

        continue;
      }

      if (entry.entryName === 'custompaintings.json') {
        const text = entry.getData().toString('utf8');
        const pack = packSchema.parse(JSON.parse(text));

        event.sender.send('setId', pack.id);
        if (pack.name) {
          packName = pack.name;
        }

        const paintings = new Map<string, Painting>();
        for (const painting of pack.paintings) {
          paintings.set(painting.id, painting);
        }
        event.sender.send('setPaintings', paintings);

        continue;
      }

      if (entry.entryName === 'pack.png') {
        zip.extractEntryTo(entry, appContext.tempDir, false, true);
        const filename = entry.entryName.substring(
          entry.entryName.lastIndexOf('/') + 1
        );
        const filePath = path.join(appContext.tempDir, filename);
        event.sender.send('setIcon', fileUrl(filePath));

        continue;
      } else if (entry.entryName.endsWith('.png')) {
        paintingImages.push(entry);
        continue;
      }
    }

    event.sender.send('setName', packName);

    for (const entry of paintingImages) {
      const filename = entry.entryName.substring(
        entry.entryName.lastIndexOf('/') + 1
      );
      const key = filename.substring(0, filename.lastIndexOf('.'));

      const dir = path.join(appContext.tempDir, 'paintings');
      zip.extractEntryTo(entry, dir, false, true);
      const filePath = path.join(appContext.tempDir, 'paintings', filename);
      event.sender.send('setPaintingPath', key, fileUrl(filePath));
    }

    event.sender.send('setExtraPaintingImages', extraPaintingImages);

    return filename;
  };
