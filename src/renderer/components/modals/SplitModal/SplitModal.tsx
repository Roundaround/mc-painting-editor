import { Button } from '@/components/input/Button';
import { TextInput } from '@/components/input/TextInput';
import { useDispatch, useSelector } from '@/utils/store';
import { editorActions } from '@common/store/editor';
import { FC, HTMLProps, useEffect } from 'react';

import styles from './SplitModal.module.scss';

const { setSplitId, setSplitName, clearOverlay } = editorActions;

interface SplitModalProps extends HTMLProps<HTMLDivElement> {}

export const SplitModal: FC<SplitModalProps> = (props) => {
  const splitId = useSelector((state) => state.editor.split.id);
  const splitName = useSelector((state) => state.editor.split.name);

  const dispatch = useDispatch();

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
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
  }, [dispatch]);

  return (
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
  );
};
