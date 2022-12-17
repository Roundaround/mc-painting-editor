import { CSSProperties, useEffect } from 'react';
import styles from './PaintingGrid.module.scss';

export interface PaintingGridProps {
  maxHeight: number;
  maxWidth: number;
  hasImage: boolean;
  image: string;
  height: number;
  width: number;
}

export const PaintingGrid = (props: PaintingGridProps) => {
  const { maxHeight, maxWidth, hasImage, image, height, width } = props;

  return (
    <div
      className={styles['wrapper']}
      style={
        {
          '--painting-grid-height': `${maxHeight * 2}rem`,
          '--painting-grid-width': `${maxWidth * 2}rem`,
        } as CSSProperties
      }
    >
      <img
        src={image}
        className={styles['painting']}
        style={
          {
            '--painting-height': `${height * 2}rem`,
            '--painting-width': `${width * 2}rem`,
          } as CSSProperties
        }
      />
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
