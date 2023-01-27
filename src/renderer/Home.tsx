import { AppFooter } from '@/components/AppFooter';
import { MetadataEditor } from '@/components/MetadataEditor';
import { PaintingList } from '@/components/PaintingList';
import { SplitPane } from '@/components/SplitPane';
import { useDispatch, useSelector } from '@/utils/store';
import { editorActions } from '@common/store/editor';
import { useEffect, useRef } from 'react';
import { Blocks } from 'react-loader-spinner';
import { Button } from './components/Button';
import { TextInput } from './components/TextInput';
import styles from './Home.module.scss';

const { setSplitId, setSplitName, clearOverlay } = editorActions;

export default function Home() {
  const hasOverlay = useSelector((state) => !!state.editor.overlay);
  const loading = useSelector((state) => state.editor.overlay === 'loading');
  const splitting = useSelector(
    (state) => state.editor.overlay === 'splitting'
  );

  const splitId = useSelector((state) => state.editor.split.id);
  const splitName = useSelector((state) => state.editor.split.name);

  const dispatch = useDispatch();

  const isSplittingRef = useRef<boolean>();

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (!isSplittingRef.current) {
        return;
      }

      if (event.key === 'Escape') {
        dispatch(clearOverlay());
      } else if (event.key === 'Enter') {
        window.electron.splitSelected();
      }
    };

    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [isSplittingRef, dispatch]);

  useEffect(() => {
    isSplittingRef.current = splitting;
  }, [splitting]);

  return (
    <>
      {!loading ? null : (
        <div className={styles['overlay']}>
          <Blocks height={200} width={200} />
        </div>
      )}

      {!splitting ? null : (
        <div className={styles['overlay']}>
          <div className={styles['modal']}>
            <TextInput
              id="splitting-id"
              label="ID"
              required
              maxLength={32}
              value={splitId}
              onChange={(e) => {
                dispatch(setSplitId(e.target.value));
              }}
            />
            <TextInput
              id="splitting-name"
              label="Name"
              maxLength={32}
              value={splitName}
              onChange={(e) => {
                dispatch(setSplitName(e.target.value));
              }}
            />
            <div className={styles['modal-buttons']}>
              <Button
                onClick={() => {
                  dispatch(clearOverlay());
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  window.electron.splitSelected();
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      <fieldset disabled={hasOverlay} className={styles['page-wrapper']}>
        <SplitPane>
          <MetadataEditor />
          <PaintingList />
        </SplitPane>
        <AppFooter className={styles['footer']} />
      </fieldset>
    </>
  );
}
