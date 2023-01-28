import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSProperties, HTMLProps } from 'react';
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
      className={classNames}
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
      <div className={styles['overlay']}>
        <div className={styles['overlay-icon']}>
          <FontAwesomeIcon icon="edit" />
        </div>
      </div>
    </div>
  );
};
