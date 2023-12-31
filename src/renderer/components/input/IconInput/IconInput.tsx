import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, HTMLProps } from 'react';

import { clsxm } from '$renderer/utils/clsxm';
import { useSelector } from '$renderer/utils/store';

import styles from './IconInput.module.scss';

interface IconInputProps extends HTMLProps<HTMLDivElement> {}

export const IconInput: FC<IconInputProps> = (props) => {
  const { className: passedClassName, ...htmlProps } = props;

  const icon = useSelector((state) => state.metadata.icon);

  const wrapperClassNames = ['wrapper']
    .map((name) => styles[name as keyof typeof styles])
    .concat(passedClassName || '')
    .join(' ')
    .trim();

  const inputClassNames = ['input', !icon ? 'input--empty' : '']
    .map((name) => styles[name as keyof typeof styles])
    .join(' ')
    .trim();

  return (
    <div {...htmlProps} className={wrapperClassNames}>
      <div className="select-none text-xs">Icon</div>
      <div
        className={clsxm(inputClassNames, 'group rounded-md bg-neutral-700')}
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
