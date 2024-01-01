import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, HTMLAttributes } from 'react';

import { clsxm } from '$renderer/utils/clsxm';
import { useSelector } from '$renderer/utils/store/root';

import styles from './IconInput.module.scss';

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
        className={clsxm(styles['input'], 'group rounded-md bg-neutral-700')}
        onClick={() => {
          window.electron.openIconFile();
        }}
      >
        <div
          className={clsxm(
            styles['overlay'],
            'transition-colors duration-75 group-hover:bg-gray-100/15 group-active:bg-transparent',
          )}
        >
          <div
            className={clsxm(
              styles['overlay-icon'],
              'rounded-full bg-blue-600 text-gray-100 opacity-0 transition-opacity duration-200 group-hover:opacity-100',
              {
                'opacity-100': !icon,
              },
            )}
          >
            <FontAwesomeIcon icon="edit" />
          </div>
        </div>
        {!icon ? null : <img src={icon} className={styles['image']} />}
      </div>
    </div>
  );
};

export default IconInput;
