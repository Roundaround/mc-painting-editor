import { FC, HTMLAttributes, useEffect } from 'react';

import { editorActions } from '$common/store/editor';
import { Button } from '$renderer/components/Button';
import { Tooltip, TooltipDirection } from '$renderer/components/Tooltip';
import { Github } from '$renderer/components/svg/Github';
import { Kofi } from '$renderer/components/svg/Kofi';
import { Modrinth } from '$renderer/components/svg/Modrinth';
import { clsxm } from '$renderer/utils/clsxm';
import { useDispatch, useSelector } from '$renderer/utils/store/root';

const { clearOverlay } = editorActions;

type AboutModalProps = HTMLAttributes<HTMLDivElement>;

export const AboutModal: FC<AboutModalProps> = ({ className, ...props }) => {
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

  const sectionClasses = 'flex flex-col items-center justify-center';
  const linkClasses =
    'text-3xl text-gray-300 transition-colors duration-150 hover:text-white';

  return (
    <div
      className={clsxm(
        'bg-app relative flex min-w-[30ch] max-w-[80%] flex-col items-center justify-center gap-4 rounded-md p-5 shadow-2xl',
        className,
      )}
      {...props}
    >
      <div className={sectionClasses}>
        <div className="whitespace-nowrap text-2xl font-semibold">
          {appInfo.name}
        </div>
        <div>Version {appInfo.version}</div>
        <div>Made with ❤️ by Roundaround</div>
      </div>
      <div className="flex flex-row items-center justify-center gap-4">
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
      <div className={sectionClasses}>
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

export default AboutModal;
