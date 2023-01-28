import { Button } from '@/components/Button';
import { useDispatch } from '@/utils/store';
import { editorActions } from '@common/store/editor';
import { FC, HTMLProps, useEffect } from 'react';

import styles from './AboutModal.module.scss';

const { clearOverlay } = editorActions;

interface AboutModalProps extends HTMLProps<HTMLDivElement> {}

export const AboutModal: FC<AboutModalProps> = (props) => {
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
      <div className={styles['header']}>
        Custom Paintings Pack Editor v1.0.0
      </div>
      <Button
        onClick={() => {
          dispatch(clearOverlay());
        }}
      >
        Close
      </Button>
    </div>
  );
};
