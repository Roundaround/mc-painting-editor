import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC, HTMLAttributes } from 'react';

import { clsxm } from '$renderer/utils/clsxm';

export interface ImageInputProps extends HTMLAttributes<HTMLDivElement> {
  maxHeight: number;
  maxWidth: number;
  hasImage: boolean;
  image: string;
  height: number;
  width: number;
}

export const ImageInput: FC<ImageInputProps> = ({
  maxHeight,
  maxWidth,
  hasImage,
  image,
  height,
  width,
  className,
  ...props
}) => {
  const paintingGridHeight = maxHeight * 2.4;
  const paintingGridWidth = maxWidth * 2.4;
  const paintingHeight = height * 2.4;
  const paintingWidth = width * 2.4;

  return (
    <div
      className={clsxm(
        'image-pixelated group relative box-content cursor-pointer border-white bg-transparent bg-repeat',
        className,
      )}
      style={{
        height: `${paintingGridHeight}rem`,
        width: `${paintingGridWidth}rem`,
        borderWidth: '0.15rem',
        backgroundImage: `url('src/renderer/img/grid-square.png')`,
        backgroundSize: '2.4rem',
      }}
      {...props}
    >
      <div
        className="absolute left-0 top-0 bg-black"
        style={{
          height: `${paintingHeight}rem`,
          width: `${paintingWidth}rem`,
        }}
      ></div>
      <img
        src={image}
        className="image-pixelated relative max-h-full max-w-full"
        style={{
          height: `${paintingHeight}rem`,
          width: `${paintingWidth}rem`,
        }}
      />
      <div className="pointer-events-none absolute left-0 top-0 flex h-full w-full select-none items-center justify-center transition-colors duration-75 group-hover:bg-neutral-100/15 group-active:bg-transparent">
        <div
          className={clsxm(
            'flex aspect-square w-12 flex-fixed items-center justify-center rounded-full bg-blue-600 p-0 text-gray-100 opacity-0 transition-opacity duration-200 group-hover:opacity-100',
            {
              'opacity-100': !hasImage,
            },
          )}
        >
          <FontAwesomeIcon icon="edit" className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};
