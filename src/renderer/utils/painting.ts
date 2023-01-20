import { Painting } from '@common/store/paintings';

const generateBlankImage = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  ctx.fillStyle = 'rgb(42, 93, 183)';
  ctx.fillRect(0, 0, width, height);
  return canvas.toDataURL();
};

export function getPaintingImage(painting?: Painting) {
  return (
    painting?.path ||
    generateBlankImage(
      (painting?.width || 1) * 16,
      (painting?.height || 1) * 16
    )
  );
}
