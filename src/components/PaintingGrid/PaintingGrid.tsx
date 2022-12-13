export interface PaintingGridProps {
  maxHeight: number;
  maxWidth: number;
  imageData: string;
  height: number;
  width: number;
}

export const PaintingGrid = (props: PaintingGridProps) => {
  const { maxHeight, maxWidth, imageData, height, width } = props;

  return (
    <div
      style={{
        position: 'relative',
        height: `${maxHeight * 2}rem`,
        width: `${maxWidth * 2}rem`,
        backgroundImage: 'url("/grid-square.png")',
        backgroundSize: '2rem 2rem',
        backgroundRepeat: 'repeat',
      }}
    >
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
    </div>
  );
};
