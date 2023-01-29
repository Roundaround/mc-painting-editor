import { Button } from '@/components/input/Button';
import { Tooltip, TooltipDirection } from '@/components/Tooltip';
import Github from '@/img/github.svg';
import Kofi from '@/img/kofi.svg';
import Modrinth from '@/img/modrinth.svg';
import { useDispatch, useSelector } from '@/utils/store';
import { editorActions } from '@common/store/editor';
import { FC, HTMLProps, useEffect } from 'react';

import styles from './AboutModal.module.scss';

const { clearOverlay } = editorActions;

interface AboutModalProps extends HTMLProps<HTMLDivElement> {}

export const AboutModal: FC<AboutModalProps> = (props) => {
  const appInfo = useSelector((state) => state.editor.appInfo);

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
        <div className={styles['name']}>{appInfo.name}</div>
        <div>Version {appInfo.version}</div>
        <div>Made with ❤️ by Roundaround</div>
      </div>
      <div className={styles['row']}>
        <Tooltip
          content="Check out the source code on GitHub"
          direction={TooltipDirection.TOP}
          directTabbable={false}
        >
          <a
            className={styles['link']}
            target="_blank"
            href="https://github.com/Roundaround/mc-painting-editor"
          >
            <Github />
          </a>
        </Tooltip>
        <Tooltip
          content="View all my Minecraft mods on Modrinth"
          direction={TooltipDirection.TOP}
          directTabbable={false}
        >
          <a
            className={styles['link']}
            target="_blank"
            href="https://modrinth.com/user/Roundaround"
          >
            <Modrinth />
          </a>
        </Tooltip>
        <Tooltip
          content="Support me by buying me a coffee!"
          direction={TooltipDirection.TOP}
          directTabbable={false}
        >
          <a
            className={styles['link']}
            target="_blank"
            href="https://ko-fi.com/roundaround"
          >
            <Kofi />
          </a>
        </Tooltip>
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
