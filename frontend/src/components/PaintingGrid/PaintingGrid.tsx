import { CSSProperties } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './PaintingGrid.module.scss';

export interface PaintingGridProps {
  maxHeight: number;
  maxWidth: number;
  hasImage: boolean;
  imageData: string;
  height: number;
  width: number;
  onUpload: (acceptedFiles: File[]) => void;
}

export const PaintingGrid = (props: PaintingGridProps) => {
  const { maxHeight, maxWidth, hasImage, imageData, height, width, onUpload } =
    props;
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted: onUpload,
    accept: {
      'image/png': [],
    },
    maxFiles: 1,
  });

  return (
    <div
      className={styles['wrapper']}
      style={
        {
          '--painting-grid-height': `${maxHeight * 2}rem`,
          '--painting-grid-width': `${maxWidth * 2}rem`,
        } as CSSProperties
      }
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <img
        src={imageData}
        className={styles['painting']}
        style={
          {
            '--painting-height': `${height * 2}rem`,
            '--painting-width': `${width * 2}rem`,
          } as CSSProperties
        }
      />
      {isDragActive ? null : <div className={styles['edit-overlay']}></div>}
      {hasImage || isDragActive ? null : (
        <div className={styles['drag-instructions']}>
          <span style={{ whiteSpace: 'nowrap' }}>Drag or click</span>
          <br />
          <span style={{ whiteSpace: 'nowrap' }}>to upload an image</span>
        </div>
      )}
    </div>
  );
};
