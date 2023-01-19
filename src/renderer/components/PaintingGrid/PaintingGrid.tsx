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
      style={
        {
          '--painting-grid-height': `${maxHeight * 2.4}rem`,
          '--painting-grid-width': `${maxWidth * 2.4}rem`,
          '--painting-height': `${height * 2.4}rem`,
          '--painting-width': `${width * 2.4}rem`,
        } as CSSProperties
      }
      onClick={onClick}
    >
      <div className={styles['background']}></div>
      <img src={image} className={styles['painting']} />
      <div className={styles['edit-overlay']}></div>
      {hasImage ? null : (
        <div className={styles['upload-instructions']}>
          <span style={{ whiteSpace: 'nowrap' }}>Click here to</span>
          <br />
          <span style={{ whiteSpace: 'nowrap' }}>upload an image</span>
        </div>
      )}
    </div>
  );
};
