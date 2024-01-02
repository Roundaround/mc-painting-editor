import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, HTMLAttributes } from 'react';

import { clsxm } from '$renderer/utils/clsxm';
import { useSelector } from '$renderer/utils/store/root';

type IconInputProps = HTMLAttributes<HTMLDivElement>;

export const IconInput: FC<IconInputProps> = ({ className, ...props }) => {
  const icon = useSelector((state) => state.metadata.icon);

  return (
    <div
      {...props}
      className={clsxm('flex flex-col items-start gap-1', className)}
    >
      <div className="select-none text-xs">Icon</div>
      <div
        className="image-pixelated group relative h-32 w-32 cursor-pointer overflow-hidden rounded-md bg-neutral-700"
        onClick={() => {
          window.electron.openIconFile();
        }}
      >
        <div className="pointer-events-none absolute left-0 top-0 flex h-full w-full select-none items-center justify-center transition-colors duration-75 group-hover:bg-gray-100/15 group-active:bg-transparent">
          <div
            className={clsxm(
              'flex aspect-square w-12 flex-fixed items-center justify-center rounded-full bg-blue-600 p-0 text-gray-100 opacity-0 transition-opacity duration-200 group-hover:opacity-100',
              {
                'opacity-100': !icon,
              },
            )}
          >
            <FontAwesomeIcon icon="edit" className="h-6 w-6" />
          </div>
        </div>
        {!icon ? null : (
          <img
            src={icon}
            className="image-pixelated h-32 w-auto object-contain"
          />
        )}
      </div>
    </div>
  );
};

export default IconInput;
