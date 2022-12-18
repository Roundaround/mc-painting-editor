import { useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Blocks } from 'react-loader-spinner';
import { Button, ButtonStyle } from './components/Button';
import { PaintingList } from './components/PaintingList';
import { TextInput } from './components/TextInput';
import './Home.scss';
import { getDefaultPainting } from './utils/painting';
import {
  descriptionAtom,
  filenameAtom,
  iconAtom,
  idAtom,
  nameAtom,
  packFormatAtom,
  paintingsAtom
} from './utils/store';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [icon, setIcon] = useAtom(iconAtom);
  const [packFormat, setPackFormat] = useAtom(packFormatAtom);
  const [description, setDescription] = useAtom(descriptionAtom);
  const [id, setId] = useAtom(idAtom);
  const [name, setName] = useAtom(nameAtom);
  const [paintings, setPaintings] = useAtom(paintingsAtom);
  const [filename, setFilename] = useAtom(filenameAtom);

  const setPaintingPath = useCallback(
    (id: string, path: string) => {
      setPaintings((paintings) => {
        let painting = paintings.get(id);
        if (!painting) {
          // TODO: Indicate that there was an image but no matching metadata
          painting = getDefaultPainting(id);
        }
        return new Map(paintings).set(id, {
          ...painting,
          path,
        });
      });
    },
    [setPaintings]
  );

  useEffect(() => {
    const cancelIconListener = window.electron.onSet.icon(setIcon);
    const cancelPackFormatListener =
      window.electron.onSet.packFormat(setPackFormat);
    const cancelDescriptionListener =
      window.electron.onSet.description(setDescription);
    const cancelIdListener = window.electron.onSet.id(setId);
    const cancelNameListener = window.electron.onSet.name(setName);
    const cancelPaintingsListener =
      window.electron.onSet.paintings(setPaintings);
    const cancelPaintingPathListener =
      window.electron.onSet.paintingPath(setPaintingPath);
    const cancelLoadingListener = window.electron.onSet.loading(setLoading);
    const cancelFilenameListener = window.electron.onSet.filename(setFilename);

    return () => {
      cancelIconListener();
      cancelPackFormatListener();
      cancelDescriptionListener();
      cancelIdListener();
      cancelNameListener();
      cancelPaintingsListener();
      cancelPaintingPathListener();
      cancelLoadingListener();
      cancelFilenameListener();
    };
  }, [
    setIcon,
    setPackFormat,
    setDescription,
    setId,
    setName,
    setPaintings,
    setPaintingPath,
    setLoading,
    setFilename,
  ]);

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
    getRootProps: getRootPropsForIcon,
    getInputProps: getInputPropsForIcon,
  } = useDropzone({
    onDropAccepted: onIconFileDrop,
    accept: {
      'image/png': [],
    },
    maxFiles: 1,
  });

  return (
    <>
      {!loading ? null : (
        <div className="loading-overlay">
          <Blocks height={200} width={200} />
        </div>
      )}

      <main className="page-wrapper">
        <div className="page-column">
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
                  'icon-input',
                  !icon ? 'icon-input--empty' : '',
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
            onClick={() => {}}
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
        <div className="page-column">
          <PaintingList />
        </div>
      </main>
      <footer className="page-footer">
        Made with ❤️ by Roundaround for use with the Custom Paintings Minecraft
        mod
      </footer>
    </>
  );
}
