import { Button } from 'components/Button';
import { PaintingList } from 'components/PaintingList';
import { TextInput } from 'components/TextInput';
import { TooltipDirection } from 'components/Tooltip';
import { saveAs } from 'file-saver';
import { useAtom } from 'jotai';
import JSZip from 'jszip';
import Head from 'next/head';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  descriptionAtom,
  getDefaultPainting,
  getPaintingImage,
  iconAtom,
  idAtom,
  mcmetaSchema,
  nameAtom,
  packFormatAtom,
  packSchema,
  Painting,
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

export default function Home() {
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
        icon !== '' ||
        description !== '' ||
        id !== '' ||
        name !== '' ||
        paintings.size > 0
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

      let packName = file.name.replace(/\.zip$/i, '');

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
          loadedPaintings.set(key, {
            ...(loadedPaintings.get(key) || getDefaultPainting(key)),
            data,
          });
        }
      }

      setName(packName);
      setPaintings(loadedPaintings);
    },
    [
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
    ]
  );

  const onIconFileDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        return;
      }

      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setIcon(reader.result as string);
      };
    },
    [setIcon]
  );

  const { getRootProps: getRootPropsForZip } = useDropzone({
    onDrop: onZipFileDrop,
    noClick: true,
    noKeyboard: true,
    accept: {
      'application/zip': ['.zip'],
    },
    maxFiles: 1,
  });

  const {
    getRootProps: getRootPropsForIcon,
    getInputProps: getInputPropsForIcon,
  } = useDropzone({
    onDrop: onIconFileDrop,
    noDragEventsBubbling: true,
    accept: {
      'image/png': [],
    },
    maxFiles: 1,
  });

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
        paintings: Array.from(paintings.values()).map(
          ({ data, name, artist, ...painting }) => {
            const result: Painting = painting;
            if (name) {
              result.name = name;
            }
            if (artist) {
              result.artist = artist;
            }
            return result;
          }
        ),
      })
    );

    zip.file('pack.png', icon.replace('data:image/png;base64,', ''), {
      base64: true,
    });

    for (const painting of paintings.values()) {
      const data = getPaintingImage(painting);
      zip.file(
        `assets/${id}/textures/painting/${painting.id}.png`,
        data.replace('data:image/png;base64,', ''),
        { base64: true }
      );
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, `${name}.zip`);
    });
  }, [packFormat, description, id, name, paintings, icon]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles['page-wrapper']} {...getRootPropsForZip()}>
        <div className={styles['page-column']}>
          <PaintingList />
        </div>

        <div className={styles['page-column']}>
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
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.25rem',
              }}
            >
              <div style={{ fontSize: 'var(--font-size-0)' }}>Icon</div>
              <div
                className={[
                  styles['icon-input'],
                  !icon ? styles['icon-input--empty'] : '',
                ].join(' ')}
                {...getRootPropsForIcon()}
              >
                <input {...getInputPropsForIcon()} />
                {!icon ? null : (
                  <img
                    src={icon}
                    style={{
                      imageRendering: 'pixelated',
                      height: '8rem',
                      width: 'auto',
                      objectFit: 'contain',
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={download}
            tooltip={{
              content: (
                <span style={{ whiteSpace: 'nowrap' }}>
                  Download the currently configured resource pack
                </span>
              ),
              direction: TooltipDirection.TOP,
            }}
          >
            Download
          </Button>
        </div>
      </main>
    </>
  );
}
