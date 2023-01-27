import { editorActions } from '@common/store/editor';
import { metadataActions, MetadataState } from '@common/store/metadata';
import {
  getDefaultPainting,
  Painting,
  paintingsActions,
  paintingsSelectors,
} from '@common/store/paintings';
import { savedSnapshotActions } from '@common/store/savedSnapshot';
import { nanoid } from '@reduxjs/toolkit';
import AdmZip, { IZipEntry } from 'adm-zip';
import { app, BrowserWindow, dialog } from 'electron';
import fs from 'fs/promises';
import sizeOf from 'image-size';
import path from 'path';
import url from 'url';
import { mcmetaSchema, packSchema } from './schemas';
import { store } from './store';

const { setLoading, setFilename, clearOverlay } = editorActions;
const { setIcon, setPackFormat, setDescription, setId, setName } =
  metadataActions;
const { updatePainting, upsertPainting, setPaintings, removeManyPaintings } =
  paintingsActions;
const { captureSnapshot } = savedSnapshotActions;

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

export function filePath(fileUrl: string): string {
  return url.fileURLToPath(
    fileUrl.replace(/^mc-painting-editor:\/\//, 'file://').split('?')[0]
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

  store.dispatch(setLoading());

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
                ...getDefaultPainting(),
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

      if (!paintingUuids[key]) {
        const defaultPainting = getDefaultPainting();
        paintingUuids[key] = defaultPainting.uuid;
        store.dispatch(
          upsertPainting({
            ...defaultPainting,
            id: key,
          })
        );
      }

      const uuid = paintingUuids[key];
      const newFilename = `${uuid}.png`;

      zip.extractEntryTo(entry, dir, false, true, false, newFilename);

      const filePath = path.join(appTempDir, 'paintings', newFilename);
      const { width, height } = sizeOf(filePath);

      store.dispatch(
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

    store.dispatch(clearOverlay());
    store.dispatch(setFilename(filename));
    store.dispatch(captureSnapshot(store.getState()));
    return filename;
  } catch (err) {
    store.dispatch(clearOverlay());
    store.dispatch(setFilename(''));
    return '';
  }
}

export async function openIconFile(parentWindow: BrowserWindow) {
  const files = await dialog.showOpenDialog(parentWindow, {
    properties: ['openFile'],
    filters: [
      {
        name: 'PNG Image Files',
        extensions: ['png'],
      },
    ],
  });

  if (files.canceled) {
    return;
  }

  const filename = files.filePaths[0];
  const newPath = path.join(appTempDir, 'pack.png');

  await fs.mkdir(appTempDir, { recursive: true }).catch((err) => {
    if (err?.code !== 'EEXIST') {
      throw err;
    }
  });
  await fs.copyFile(filename, newPath);

  store.dispatch(setIcon(fileUrl(newPath)));
}

export async function openPaintingFile(
  parentWindow: BrowserWindow,
  paintingId: string
) {
  const files = await dialog.showOpenDialog(parentWindow, {
    properties: ['openFile'],
    filters: [
      {
        name: 'PNG Image Files',
        extensions: ['png'],
      },
    ],
  });

  if (files.canceled) {
    return;
  }

  const filename = files.filePaths[0];
  const newPath = path.join(appTempDir, 'paintings', `${paintingId}.png`);

  await fs
    .mkdir(path.join(appTempDir, 'paintings'), { recursive: true })
    .catch((err) => {
      if (err?.code !== 'EEXIST') {
        throw err;
      }
    });
  await fs.copyFile(filename, newPath);

  const { width, height } = sizeOf(newPath);

  store.dispatch(
    updatePainting({
      id: paintingId,
      changes: {
        path: fileUrl(newPath),
        pixelWidth: width || 0,
        pixelHeight: height || 0,
      },
    })
  );
}

async function getSaveFilename(
  parentWindow: BrowserWindow,
  metadata: MetadataState
) {
  let name = metadata.name;
  if (!name) {
    name = 'Custom Paintings';
  }

  // Sanitize name so it can be used as a filename on any OS
  name = name.replace(/[/\\?%*:|"<>]/g, '-');

  const result = await dialog.showSaveDialog(parentWindow, {
    defaultPath: `${name}.zip`,
    filters: [
      {
        name: 'Zip Files',
        extensions: ['zip'],
      },
    ],
  });

  return result.filePath || '';
}

async function getCurrentSaveFilename(parentWindow: BrowserWindow) {
  return getSaveFilename(parentWindow, store.getState().metadata);
}

export async function saveSplitZipFile(parentWindow: BrowserWindow) {
  const editorState = store.getState().editor;
  const baseMetadata = store.getState().metadata;
  const metadata: MetadataState = {
    icon: baseMetadata.icon,
    packFormat: baseMetadata.packFormat,
    description: `Split from "${baseMetadata.name}"`,
    id: editorState.split.id,
    name: editorState.split.name,
  };

  const paintings = paintingsSelectors
    .selectAll(store.getState())
    .filter((painting) => painting.marked);

  const error = validate(metadata, paintings);
  if (!!error) {
    dialog.showErrorBox('Validation error', error);
    return;
  }

  let filename = await getSaveFilename(parentWindow, metadata);

  if (!filename) {
    return;
  }

  try {
    store.dispatch(setLoading());

    const zip = new AdmZip();

    const mcmeta = {
      pack: {
        pack_format: metadata.packFormat,
        description: metadata.description,
      },
    };
    zip.addFile('pack.mcmeta', Buffer.from(JSON.stringify(mcmeta, null, 2)));

    const pack = {
      id: metadata.id,
      name: metadata.name,
      paintings: paintings.map(({ uuid, path, ...painting }) => painting),
      migrations: [
        {
          id: new Date().toISOString(),
          pairs: paintings.map((painting) => [
            painting.id.replace(
              new RegExp(`^${store.getState().metadata.id}`),
              metadata.id
            ),
          ]),
        },
      ],
    };
    zip.addFile(
      'custompaintings.json',
      Buffer.from(JSON.stringify(pack, null, 2))
    );

    const iconPath = metadata.icon;
    if (iconPath) {
      zip.addLocalFile(filePath(iconPath), '', 'pack.png');
    }

    for (const painting of paintings) {
      if (!painting.path || !painting.id) {
        continue;
      }
      zip.addLocalFile(
        filePath(painting.path),
        `assets/${metadata.id}/textures/painting/`,
        `${painting.id}.png`
      );
    }

    zip.writeZip(filename);
  } finally {
    store.dispatch(clearOverlay());
    store.dispatch(removeManyPaintings(paintings.map((p) => p.uuid)));
  }
}

export async function saveZipFile(
  parentWindow: BrowserWindow,
  requestNewFilename = false
) {
  const error = validateCurrentState();
  if (!!error) {
    dialog.showErrorBox('Validation error', error);
    return;
  }

  let filename = store.getState().editor.filename;
  if (!filename || requestNewFilename) {
    filename = await getCurrentSaveFilename(parentWindow);
  }

  if (!filename) {
    return;
  }

  try {
    store.dispatch(setLoading());

    const zip = new AdmZip();
    const state = store.getState();

    const mcmeta = {
      pack: {
        pack_format: state.metadata.packFormat,
        description: state.metadata.description,
      },
    };
    zip.addFile('pack.mcmeta', Buffer.from(JSON.stringify(mcmeta, null, 2)));

    const paintings = paintingsSelectors.selectAll(state);
    const pack = {
      id: state.metadata.id,
      name: state.metadata.name,
      paintings: paintings.map(({ uuid, path, ...painting }) => painting),
    };
    zip.addFile(
      'custompaintings.json',
      Buffer.from(JSON.stringify(pack, null, 2))
    );

    const iconPath = state.metadata.icon;
    if (iconPath) {
      zip.addLocalFile(filePath(iconPath), '', 'pack.png');
    }

    for (const painting of paintings) {
      if (!painting.path || !painting.id) {
        continue;
      }
      zip.addLocalFile(
        filePath(painting.path),
        `assets/${state.metadata.id}/textures/painting/`,
        `${painting.id}.png`
      );
    }

    zip.writeZip(filename);
    store.dispatch(setFilename(filename));
    store.dispatch(captureSnapshot(store.getState()));
  } finally {
    store.dispatch(clearOverlay());
  }
}

function validateCurrentState() {
  const state = store.getState();
  return validate(state.metadata, paintingsSelectors.selectAll(state));
}

function validate(metadata: MetadataState, paintings: Painting[]) {
  if (!metadata.id) {
    return 'Pack ID is required';
  }
  if (metadata.id.length < 3 || metadata.id.length > 32) {
    return 'Pack ID must be between 3 and 32 characters';
  }
  if (!/^[a-z0-9._-]+$/.test(metadata.id)) {
    return 'Pack ID can only contain lowercase letters, numbers, periods, underscores, and dashes';
  }

  if (
    !!metadata.name &&
    (metadata.name.length < 3 || metadata.name.length > 32)
  ) {
    return 'Pack name must be between 3 and 32 characters';
  }

  if (!!metadata.description && metadata.description.length > 128) {
    return 'Pack description must be 128 characters or less';
  }

  if (paintings.length === 0) {
    return 'At least one painting is required';
  }

  for (let i = 0; i < paintings.length; i++) {
    const painting = paintings[i];
    const num = i + 1;

    if (!painting.id) {
      return `Painting ${num} invalid: ID is required`;
    }
    if (painting.id.length < 3 || painting.id.length > 32) {
      return `Painting ${num} invalid: ID must be between 3 and 32 characters`;
    }
    if (!/^[a-z0-9._-]+$/.test(painting.id)) {
      return `Painting ${num} invalid: ID can only contain lowercase letters, numbers, periods, underscores, and dashes`;
    }

    if (
      !!painting.name &&
      (painting.name.length < 3 || painting.name.length > 32)
    ) {
      return `Painting ${num} invalid: name must be between 3 and 32 characters`;
    }
    if (
      !!painting.artist &&
      (painting.artist.length < 3 || painting.artist.length > 32)
    ) {
      return `Painting ${num} invalid: artist must be between 3 and 32 characters`;
    }

    if (!painting.path) {
      return `Painting ${num} invalid: image is required`;
    }
  }
}
