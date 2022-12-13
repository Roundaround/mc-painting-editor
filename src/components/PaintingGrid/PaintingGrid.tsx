import { useDropzone } from 'react-dropzone';

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
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onUpload,
    accept: {
      'image/png': ['.png'],
    },
    maxFiles: 1,
  });

  return (
    <div
      style={{
        position: 'relative',
        height: `${maxHeight * 2}rem`,
        width: `${maxWidth * 2}rem`,
        backgroundImage: 'url("/grid-square.png")',
        backgroundSize: '2rem 2rem',
        backgroundRepeat: 'repeat',
        border: `${2 / 16}rem solid var(--smoke)`,
        boxSizing: 'content-box',
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <img
        src={imageData}
        style={{
          imageRendering: 'pixelated',
          height: `calc(16rem * ${height / 8})`,
          maxHeight: '100%',
          width: `calc(16rem * ${width / 8})`,
          maxWidth: '100%',
        }}
      />
      {hasImage ? null : (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: 'var(--size-1) var(--size-2)',
            backgroundColor: 'var(--surface-3)',
            borderRadius: 'var(--radius-2)',
            textAlign: 'center',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <span style={{ whiteSpace: 'nowrap' }}>Drag or click</span>
          <br />
          <span style={{ whiteSpace: 'nowrap' }}>to upload an image</span>
        </div>
      )}
    </div>
  );
};