import { Button } from '@/components/input/Button';
import { useDispatch, useSelector } from '@/utils/store';
import { editorActions } from '@common/store/editor';
import { FC, HTMLProps, useEffect } from 'react';

import styles from './AboutModal.module.scss';

const { clearOverlay } = editorActions;

interface AboutModalProps extends HTMLProps<HTMLDivElement> {}

export const AboutModal: FC<AboutModalProps> = (props) => {
  const appName = useSelector((state) => state.editor.name);
  const appVersion = useSelector((state) => state.editor.version);

  const dispatch = useDispatch();

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dispatch(clearOverlay());
      }
    };

    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [dispatch]);

  return (
    <div className={styles['modal']}>
      <div className={styles['section']}>
        <div className={styles['name']}>{appName}</div>
        <div className={styles['version']}>v{appVersion}</div>
      </div>
      <div className={styles['section']}>
        <Button
          onClick={() => {
            dispatch(clearOverlay());
          }}
        >
          Close
        </Button>
      </div>
    </div>
  );
};
