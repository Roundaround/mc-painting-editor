import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Blocks } from 'react-loader-spinner';
import { metadataSlice, paintingsSlice } from '../common/store';
import { Button, ButtonStyle } from './components/Button';
import { PaintingList } from './components/PaintingList';
import { TextInput } from './components/TextInput';
import { TooltipDirection } from './components/Tooltip';
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

  const dispatch = useDispatch();

  return (
    <>
      {!loading ? null : (
        <div className="loading-overlay">
          <Blocks height={200} width={200} />
        </div>
      )}

      <div className="page-wrapper">
        <div className="side-bar">
          <div className="side-bar__content">
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

          <div className="side-bar__footer">Made with ❤️ by Roundaround</div>
        </div>
        <div className="main-panel">
          <div className="main-panel__header">
            <div style={{ fontSize: 'var(--font-size-5)' }}>
              Paintings ({paintingCount})
            </div>
            <Button
              onClick={() => {
                dispatch(paintingsSlice.actions.createPainting());
              }}
              style={ButtonStyle.ICON}
              tooltip={{
                content: 'Add a painting',
                noWrap: true,
                direction: TooltipDirection.BOTTOM,
              }}
            >
              <FontAwesomeIcon icon={'plus'} />
            </Button>
          </div>
          <PaintingList />
        </div>
      </div>
    </>
  );
}
