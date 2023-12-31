import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSProperties, HTMLProps } from 'react';

import { clsxm } from '$renderer/utils/clsxm';

import styles from './ImageInput.module.scss';

export interface ImageInputProps extends HTMLProps<HTMLDivElement> {
  maxHeight: number;
  maxWidth: number;
  hasImage: boolean;
  image: string;
  height: number;
  width: number;
}

export const ImageInput = (props: ImageInputProps) => {
  const {
    maxHeight,
    maxWidth,
    hasImage,
    image,
    height,
    width,
    className: passedClassName,
    ...htmlProps
  } = props;

  const classNames = [
    styles['wrapper'],
    hasImage ? '' : styles['wrapper--empty'],
    passedClassName || '',
  ]
    .join(' ')
    .trim();

  return (
    <div
      className={clsxm(classNames, 'group border-[0.15rem] border-white')}
      style={
        {
          '--painting-grid-height': `${maxHeight * 2.4}rem`,
          '--painting-grid-width': `${maxWidth * 2.4}rem`,
          '--painting-height': `${height * 2.4}rem`,
          '--painting-width': `${width * 2.4}rem`,
        } as CSSProperties
      }
      {...htmlProps}
    >
      <div className={styles['background']}></div>
      <img src={image} className={styles['painting']} />
      <div
        className={clsxm(
          styles['overlay'],
          'transition-colors duration-75 group-hover:bg-neutral-100/15 group-active:bg-transparent',
        )}
      >
        <div
          className={clsxm(
            styles['overlay-icon'],
            'rounded-full bg-blue-600 text-gray-100 opacity-0 transition-opacity duration-200 group-hover:opacity-100',
            {
              'opacity-100': !hasImage,
            },
          )}
        >
          <FontAwesomeIcon icon="edit" />
        </div>
      </div>
    </div>
  );
};
