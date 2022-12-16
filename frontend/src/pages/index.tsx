import { Button, ButtonStyle } from 'components/Button';
import { PaintingList } from 'components/PaintingList';
import { TextInput } from 'components/TextInput';
import { saveAs } from 'file-saver';
import { useAtom } from 'jotai';
import JSZip from 'jszip';
import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Blocks } from 'react-loader-spinner';
import { readFile } from 'utils/files';
import { getPaintingImage, Painting } from 'utils/painting';
import {
  descriptionAtom,
  iconAtom,
  idAtom,
  nameAtom,
  packFormatAtom,
  paintingsAtom,
} from 'utils/store';
import { SelectZipFile } from 'wailsjs/wailsjs/go/main/App';
import { EventsOff, EventsOnce } from 'wailsjs/wailsjs/runtime/runtime';
import styles from './index.module.scss';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [icon, setIcon] = useAtom(iconAtom);
  const [packFormat, setPackFormat] = useAtom(packFormatAtom);
  const [description, setDescription] = useAtom(descriptionAtom);
  const [id, setId] = useAtom(idAtom);
  const [name, setName] = useAtom(nameAtom);
  const [paintings, setPaintings] = useAtom(paintingsAtom);

  const onSelectZipFile = useCallback(() => {
    EventsOnce('setIcon', (icon: string) => {
      console.log(icon);
      setIcon(icon);
    });
    EventsOnce('setPackFormat', (packFormat: number) => {
      setPackFormat(packFormat);
    });
    EventsOnce('setDescription', (description: string) => {
      setDescription(description);
    });
    EventsOnce('setId', (id: string) => {
      setId(id);
    });
    EventsOnce('setName', (name: string) => {
      setName(name);
    });
    EventsOnce('setPaintings', (paintings: Painting[]) => {
      setPaintings(
        new Map(paintings.map((painting) => [painting.id, painting]))
      );
    });

    SelectZipFile().then(() => {
      EventsOff(
        'setIcon',
        'setPackFormat',
        'setDescription',
        'setId',
        'setName',
        'setPaintings'
      );
    });
  }, [setIcon, setPackFormat, setDescription, setId, setName, setPaintings]);

  const onZipFileDrop = useCallback(
    (acceptedFiles: File[]) => {
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

      setLoading(true);

      readFile(acceptedFiles[0], {
        setPackFormat,
        setDescription,
        setId,
        setName,
        setPaintings,
        setIcon,
      }).finally(() => {
        setLoading(false);
      });
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

  const {
    getRootProps: getRootPropsForZip,
    getInputProps: getInputPropsForZip,
  } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDropAccepted: onZipFileDrop,
    accept: {
      'application/zip': ['.zip'],
    },
    maxFiles: 1,
  });

  const {
    getRootProps: getRootPropsForIcon,
    getInputProps: getInputPropsForIcon,
  } = useDropzone({
    onDropAccepted: onIconFileDrop,
    accept: {
      'image/png': [],
    },
    maxFiles: 1,
  });

  const download = useCallback(() => {
    setLoading(true);

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
      setLoading(false);
    });
  }, [packFormat, description, id, name, paintings, icon]);

  return (
    <>
      <Head>
        <title>Custom Paintings pack editor</title>
        <meta name="description" content="Web app editor for painting packs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!loading ? null : (
        <div className={styles['loading-overlay']}>
          <Blocks height={200} width={200} />
        </div>
      )}

      <main className={styles['page-wrapper']}>
        <div className={styles['page-column']}>
          <div
            className={styles['zip-input']}
            {...getRootPropsForZip()}
            onClick={onSelectZipFile}
          >
            <input {...getInputPropsForZip()} />
            <p>
              Edit an existing pack by dragging it here or clicking to select
              one for upload!
            </p>
          </div>
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
            style={ButtonStyle.LARGE}
            tooltip={
              <span style={{ whiteSpace: 'nowrap' }}>
                Download the currently configured resource pack
              </span>
            }
          >
            Download
          </Button>
        </div>
        <div className={styles['page-column']}>
          <PaintingList />
        </div>
      </main>
      <footer className={styles['page-footer']}>
        Made with ❤️ by Roundaround for use with the
        <Link href="https://modrinth.com/mod/roundaround-custom-paintings">
          Custom Paintings
        </Link>
        Minecraft mod
      </footer>
    </>
  );
}