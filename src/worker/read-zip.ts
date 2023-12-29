import type { EntityId } from '@reduxjs/toolkit';
import { nanoid } from '@reduxjs/toolkit';
import type { IZipEntry } from 'adm-zip';
import AdmZip from 'adm-zip';
import sizeOf from 'image-size';
import path from 'path';
import url from 'url';

import { mcmetaSchema, packSchema } from '$common/schemas';
import { metadataActions } from '$common/store/metadata';
import {
  getDefaultMigration,
  migrationsActions,
} from '$common/store/migrations';
import { getDefaultPainting, paintingsActions } from '$common/store/paintings';
import type { BasePayloadAction } from '$common/worker/common';
import type { C2PMessage } from '$common/worker/read-zip';

const {
  setIcon,
  setPackFormat,
  setDescription,
  setId,
  setName,
  setTargetScale,
} = metadataActions;
const { updatePainting, upsertPainting, setPaintings } = paintingsActions;
const { setMigrations } = migrationsActions;

function main() {
  const filename = process.argv[2];
  const appTempDir = process.argv[3];

  if (!filename) {
    postMessage({
      type: 'error',
      content: 'Missing filename argument!',
    });
    return;
  }

  if (!appTempDir) {
    postMessage({
      type: 'error',
      content: 'Missing app temp dir argument!',
    });
    return;
  }

  let packName = filename.substring(
    filename.lastIndexOf('/') + 1,
    filename.lastIndexOf('.')
  );

  const zip = new AdmZip(filename);
  const entries = zip.getEntries();

  const paintingUuids: { [key: EntityId]: EntityId } = {};
  const paintingImages: IZipEntry[] = [];

  for (const entry of entries) {
    if (entry.isDirectory) {
      continue;
    }

    if (entry.entryName === 'pack.mcmeta') {
      const text = entry.getData().toString('utf8');
      const mcmeta = mcmetaSchema.parse(JSON.parse(text));

      postActionMessage(setPackFormat(mcmeta.pack.packFormat));
      if (mcmeta.pack.description) {
        postActionMessage(setDescription(mcmeta.pack.description));
      }

      continue;
    }

    if (entry.entryName === 'custompaintings.json') {
      const text = entry.getData().toString('utf8');
      const pack = packSchema.parse(JSON.parse(text));

      postActionMessage(setId(pack.id));
      if (pack.name) {
        packName = pack.name;
      }

      postActionMessage(setTargetScale(pack.targetScale));

      postActionMessage(
        setPaintings(
          pack.paintings.map((painting) => {
            paintingUuids[painting.id] = nanoid();
            return {
              ...getDefaultPainting(),
              ...painting,
              uuid: paintingUuids[painting.id],
              originalId: painting.id,
            };
          })
        )
      );

      postActionMessage(
        setMigrations(
          pack.migrations.map((migration) =>
            getDefaultMigration(
              migration.id,
              migration.description,
              migration.pairs
            )
          )
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
      postActionMessage(setIcon(fileUrl(filePath)));

      continue;
    } else if (entry.entryName.endsWith('.png')) {
      paintingImages.push(entry);
      continue;
    }
  }

  postActionMessage(setName(packName));

  for (const entry of paintingImages) {
    const filename = entry.entryName.substring(
      entry.entryName.lastIndexOf('/') + 1
    );
    const key = filename.substring(0, filename.lastIndexOf('.'));

    const dir = path.join(appTempDir, 'paintings');

    if (!paintingUuids[key]) {
      const defaultPainting = getDefaultPainting();
      paintingUuids[key] = defaultPainting.uuid;
      postActionMessage(
        upsertPainting({
          ...defaultPainting,
          id: key,
          originalId: key,
        })
      );
    }

    const uuid = paintingUuids[key];
    const newFilename = `${uuid}.png`;

    zip.extractEntryTo(entry, dir, false, true, false, newFilename);

    const filePath = path.join(appTempDir, 'paintings', newFilename);
    const { width, height } = sizeOf(filePath);

    postActionMessage(
      updatePainting({
        id: uuid,
        changes: {
          path: fileUrl(filePath),
          pixelWidth: width || 0,
          pixelHeight: height || 0,
        },
      })
    );
  }

  postMessage({
    type: 'done',
    filename,
  });
}

function postMessage(message: C2PMessage) {
  process.parentPort.postMessage(message);
}

function postActionMessage(action: BasePayloadAction) {
  postMessage({
    type: 'action',
    action,
  });
}

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

try {
  main();
} catch (e) {
  // TODO: Show error to user.
  console.error(e);

  const error = e instanceof Error ? e : new Error('An unknown error occurred');

  postMessage({
    type: 'error',
    content: error,
  });
}
