import { NumberInput } from 'components/NumberInput';
import { TextInput } from 'components/TextInput';
import { saveAs } from 'file-saver';
import { useAtom } from 'jotai';
import JSZip from 'jszip';
import Head from 'next/head';
import { Fragment, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  descriptionAtom,
  fileNameAtom,
  getDefaultPainting,
  iconAtom,
  idAtom,
  mcmetaSchema,
  nameAtom,
  packFormatAtom,
  packSchema,
  Painting,
  Paintings,
  paintingsAtom,
} from 'utils/store';
import styles from './index.module.scss';

const blobToBase64 = (blob: Blob): Promise<string | undefined> => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve((reader.result as string | null) || undefined);
    };
  });
};

const generateBlankImage = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, width, height);
  return canvas.toDataURL();
};

export default function Home() {
  const [fileName, setFileName] = useAtom(fileNameAtom);
  const [icon, setIcon] = useAtom(iconAtom);
  const [packFormat, setPackFormat] = useAtom(packFormatAtom);
  const [description, setDescription] = useAtom(descriptionAtom);
  const [id, setId] = useAtom(idAtom);
  const [name, setName] = useAtom(nameAtom);
  const [paintings, setPaintings] = useAtom(paintingsAtom);

  const onZipFileDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        return;
      }

      if (
        fileName !== '' ||
        icon !== '' ||
        description !== '' ||
        id !== '' ||
        name !== '' ||
        Object.keys(paintings).length > 0
      ) {
        if (
          !confirm(
            'You have unsaved work. ' +
              'Are you sure you want to overwrite the current pack?'
          )
        ) {
          return;
        }
      }

      const file = acceptedFiles[0];
      const zip = await JSZip.loadAsync(file);

      setFileName(file.name.replace(/\.zip$/i, ''));

      const loadedPaintings: Paintings = {};

      for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
        if (zipEntry.dir) {
          return;
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
          setName(pack.name || '');

          for (const painting of pack.paintings) {
            loadedPaintings[painting.id] = {
              ...loadedPaintings[painting.id],
              ...painting,
            };
          }
        }

        if (zipEntry.name === 'pack.png') {
          const blob = await zipEntry.async('blob');
          const data = await blobToBase64(
            new Blob([blob], { type: 'image/png' })
          );
          setIcon(data || '');
        } else if (zipEntry.name.endsWith('.png')) {
          const blob = await zipEntry.async('blob');
          const data = await blobToBase64(
            new Blob([blob], { type: 'image/png' })
          );

          const key = zipEntry.name.substring(
            zipEntry.name.lastIndexOf('/') + 1,
            zipEntry.name.lastIndexOf('.')
          );
          loadedPaintings[key] = {
            ...(loadedPaintings[key] || getDefaultPainting(key)),
            data,
          };
        }
      }

      setPaintings(loadedPaintings);
    },
    [
      setFileName,
      setPackFormat,
      setDescription,
      setId,
      setName,
      setIcon,
      setPaintings,
      packFormat,
      description,
      id,
      name,
      paintings,
      icon,
      fileName,
    ]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onZipFileDrop,
    accept: {
      'application/zip': ['.zip'],
    },
    maxFiles: 1,
  });

  const updatePainting = useCallback(
    (id: string, painting: Partial<Painting>) => {
      setPaintings((paintings) => ({
        ...paintings,
        [id]: {
          ...paintings[id],
          ...painting,
        },
      }));
    },
    [paintings]
  );

  const paintingImages = useMemo(() => {
    const images: Record<string, string> = {};
    for (const [key, painting] of Object.entries(paintings)) {
      images[key] =
        painting.data ||
        generateBlankImage(16 * painting.width, 16 * painting.height);
    }
    return images;
  }, [paintings]);

  const download = useCallback(() => {
    const zip = new JSZip();

    zip.file(
      'pack.mcmeta',
      JSON.stringify({
        pack: {
          pack_format: packFormat,
          description,
        },
      })
    );

    zip.file(
      'custompaintings.json',
      JSON.stringify({
        id,
        name,
        paintings: Object.values(paintings).map(
          ({ data, ...painting }) => painting
        ),
      })
    );

    zip.file('pack.png', icon.replace('data:image/png;base64,', ''), {
      base64: true,
    });

    for (const painting of Object.values(paintings)) {
      const data = paintingImages[painting.id];
      zip.file(
        `assets/${id}/textures/painting/${painting.id}.png`,
        data.replace('data:image/png;base64,', ''),
        { base64: true }
      );
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, `${fileName}.zip`);
    });
  }, [
    packFormat,
    description,
    id,
    name,
    paintings,
    icon,
    fileName,
    paintingImages,
  ]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles['page-wrapper']}>
        <div className={styles['page-column']}>
          <div {...getRootProps()} className={styles['drop-target']}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>

          <button
            type="button"
            onClick={download}
            className={styles['download-button']}
          >
            Download
          </button>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            <TextInput
              id="id"
              label="ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <TextInput
              id="name"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextInput
              id="description"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextInput
              id="file-name"
              label="File name"
              suffix=".zip"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '0.25rem',
              }}
            >
              <span>Icon:</span>
              <img
                src={icon}
                style={{
                  imageRendering: 'pixelated',
                  height: '1.5rem',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>
        </div>

        <div className={styles['page-column']}>
          <div style={{ fontSize: 'var(--font-size-5)' }}>
            Paintings ({Object.keys(paintings).length})
          </div>

          <div className={styles['painting-list']}>
            {Object.keys(paintings).length === 0 ? (
              <div>No paintings</div>
            ) : null}
            {Object.entries(paintings).map(([id, painting], index) => (
              <Fragment key={id}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1.5rem',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <div>
                      ID: <pre style={{ display: 'inline' }}>{id}</pre>
                    </div>
                    <TextInput
                      id={`painting-name-${id}`}
                      label="Name"
                      value={painting.name || ''}
                      onChange={(e) => {
                        updatePainting(id, { name: e.target.value });
                      }}
                    />
                    <TextInput
                      id={`painting-artist-${id}`}
                      label="Artist"
                      value={painting.artist || ''}
                      onChange={(e) => {
                        updatePainting(id, { artist: e.target.value });
                      }}
                    />
                    <NumberInput
                      id={`painting-width-${id}`}
                      label="Width"
                      min={1}
                      max={8}
                      value={painting.width}
                      onChange={(e) => {
                        updatePainting(id, {
                          width: parseInt(e.target.value, 10),
                        });
                      }}
                    />
                    <NumberInput
                      id={`painting-height-${id}`}
                      label="Height"
                      min={1}
                      max={8}
                      value={painting.height}
                      onChange={(e) => {
                        updatePainting(id, {
                          height: parseInt(e.target.value, 10),
                        });
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: '16rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={paintingImages[id]}
                      style={{
                        imageRendering: 'pixelated',
                        width: `calc(16rem * ${painting.width / 8})`,
                        maxWidth: '100%',
                        height: `calc(16rem * ${painting.height / 8})`,
                        maxHeight: '100%',
                      }}
                    />
                  </div>
                </div>
                {index === Object.entries(paintings).length - 1 ? null : (
                  <hr style={{ height: 'var(--border-size-1)', margin: '0' }} />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
