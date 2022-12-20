import { useAtom, useSetup } from '@xoid/react';
import { Blocks } from 'react-loader-spinner';
import { use } from 'xoid';
import { PaintingList } from './components/PaintingList';
import { TextInput } from './components/TextInput';
import './Home.scss';
import {
  descriptionAtom,
  filenameAtom,
  iconAtom,
  idAtom,
  loadingAtom,
  nameAtom,
  packFormatAtom,
  paintingsAtom,
} from './utils/store';

export default function Home() {
  const loading = useAtom(loadingAtom);
  const icon = useAtom(iconAtom);
  const description = useAtom(descriptionAtom);
  const id = useAtom(idAtom);
  const name = useAtom(nameAtom);

  useSetup(() => {
    const listenerCancellers = [
      use(loadingAtom).registerListener(),
      use(iconAtom).registerListener(),
      use(packFormatAtom).registerListener(),
      use(descriptionAtom).registerListener(),
      use(idAtom).registerListener(),
      use(nameAtom).registerListener(),
      use(paintingsAtom).registerListener(),
      use(filenameAtom).registerListener(),
    ];

    return () => {
      listenerCancellers.forEach((cancel) => cancel());
    };
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
          <TextInput
            id="id"
            label="ID"
            value={id}
            onChange={(e) => idAtom.set(e.target.value)}
          />
          <TextInput
            id="name"
            label="Name"
            value={name}
            onChange={(e) => nameAtom.set(e.target.value)}
          />
          <TextInput
            id="description"
            label="Description"
            value={description}
            onChange={(e) => descriptionAtom.set(e.target.value)}
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
              className={['icon-input', !icon ? 'icon-input--empty' : ''].join(
                ' '
              )}
            >
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
