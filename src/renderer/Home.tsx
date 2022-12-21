import { Blocks } from 'react-loader-spinner';
import { metadataSlice } from '../common/store';
import { PaintingList } from './components/PaintingList';
import { TextInput } from './components/TextInput';
import './Home.scss';
import { useDispatch, useSelector } from './utils/store';

const { setId, setName, setDescription } = metadataSlice.actions;

export default function Home() {
  const loading = useSelector((state) => state.editor.loading);
  const icon = useSelector((state) => state.metadata.icon);
  const id = useSelector((state) => state.metadata.id);
  const name = useSelector((state) => state.metadata.name);
  const description = useSelector((state) => state.metadata.description);

  const dispatch = useDispatch();

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
            onChange={(e) => dispatch(setId(e.target.value))}
          />
          <TextInput
            id="name"
            label="Name"
            value={name}
            onChange={(e) => dispatch(setName(e.target.value))}
          />
          <TextInput
            id="description"
            label="Description"
            value={description}
            onChange={(e) => dispatch(setDescription(e.target.value))}
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
