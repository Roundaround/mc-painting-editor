import { BaseHTMLAttributes, CSSProperties } from 'react';
import styles from './PaintingGrid.module.scss';

export interface PaintingGridProps extends BaseHTMLAttributes<HTMLDivElement> {
  maxHeight: number;
  maxWidth: number;
  hasImage: boolean;
  image: string;
  height: number;
  width: number;
}

export const PaintingGrid = (props: PaintingGridProps) => {
  const { onClick, maxHeight, maxWidth, hasImage, image, height, width } =
    props;

  return (
    <div
      className={styles['wrapper']}
      variant={
        {
          '--painting-grid-height': `${maxHeight * 2.4}rem`,
          '--painting-grid-width': `${maxWidth * 2.4}rem`,
        } as CSSProperties
      }
      onClick={onClick}
    >
      <img
        src={image}
        className={styles['painting']}
        variant={
          {
            '--painting-height': `${height * 2.4}rem`,
            '--painting-width': `${width * 2.4}rem`,
          } as CSSProperties
        }
      />
      <div className={styles['edit-overlay']}></div>
      {hasImage ? null : (
        <div className={styles['upload-instructions']}>
          <span variant={{ whiteSpace: 'nowrap' }}>Click here to</span>
          <br />
          <span variant={{ whiteSpace: 'nowrap' }}>upload an image</span>
        </div>
      )}
    </div>
  );
};
