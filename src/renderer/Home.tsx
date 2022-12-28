import { useMemo } from 'react';
import { Blocks } from 'react-loader-spinner';
import { metadataSlice } from '../common/store';
import { PaintingList } from './components/PaintingList';
import { SplitPane } from './components/SplitPane';
import { TextInput } from './components/TextInput';
import './Home.scss';
import { paintingsSelectors, useDispatch, useSelector } from './utils/store';

const { setId, setName, setDescription } = metadataSlice.actions;

export default function Home() {
  const loading = useSelector((state) => state.editor.loading);
  const icon = useSelector((state) => state.metadata.icon);
  const id = useSelector((state) => state.metadata.id);
  const name = useSelector((state) => state.metadata.name);
  const description = useSelector((state) => state.metadata.description);
  const paintingCount = useSelector((state) =>
    paintingsSelectors.selectTotal(state)
  );
  const paintings = useSelector(paintingsSelectors.selectAll);
  const paintingsWithoutImage = useMemo(() => {
    return paintings.filter((painting) => !painting.path).length;
  }, [paintings]);
  const paintingsWithoutId = useMemo(() => {
    return paintings.filter((painting) => !painting.id).length;
  }, [paintings]);

  const dispatch = useDispatch();

  return (
    <>
      {!loading ? null : (
        <div className="loading-overlay">
          <Blocks height={200} width={200} />
        </div>
      )}

      <div className="page-wrapper">
        <SplitPane>
          <div className="side-bar">
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
                className={[
                  'icon-input',
                  !icon ? 'icon-input--empty' : '',
                ].join(' ')}
                onClick={() => {
                  window.electron.openIconFile();
                }}
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
          <PaintingList />
        </SplitPane>
        <div className="footer">
          <div>Made with ❤️ by Roundaround</div>
          <div>
            {!paintingsWithoutId ? null : (
              <span>Needs ID: {paintingsWithoutId}</span>
            )}
            {!paintingsWithoutImage ? null : (
              <span>Needs image: {paintingsWithoutImage}</span>
            )}
            <span>Total paintings: {paintingCount}</span>
          </div>
        </div>
      </div>
    </>
  );
}
