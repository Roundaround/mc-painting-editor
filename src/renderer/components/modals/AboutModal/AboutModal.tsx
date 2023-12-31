import { FC, HTMLProps, useEffect } from 'react';

import { editorActions } from '$common/store/editor';
import { Tooltip, TooltipDirection } from '$renderer/components/Tooltip';
import { Button } from '$renderer/components/input/Button';
import { Github } from '$renderer/components/svg/Github';
import { Kofi } from '$renderer/components/svg/Kofi';
import { Modrinth } from '$renderer/components/svg/Modrinth';
import { clsxm } from '$renderer/utils/clsxm';
import { useDispatch, useSelector } from '$renderer/utils/store';

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

  const linkClasses =
    'text-3xl text-gray-300 transition-colors duration-150 hover:text-white';

  return (
    <div className={clsxm(styles['modal'], 'rounded-md bg-app')}>
      <div className={styles['section']}>
        <div className="whitespace-nowrap text-2xl font-semibold">
          {appInfo.name}
        </div>
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
            className={linkClasses}
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
            className={linkClasses}
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
            className={linkClasses}
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
