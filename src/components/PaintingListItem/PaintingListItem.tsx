import { Button } from 'components/Button';
import { NumberInput } from 'components/NumberInput';
import { PaintingGrid } from 'components/PaintingGrid';
import { TextInput } from 'components/TextInput';
import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import {
  getPaintingImage,
  Painting,
  Paintings,
  paintingsAtom,
} from 'utils/store';

export interface PaintingListItemProps {
  id: string;
  isFirst: boolean;
  isLast: boolean;
}

export function PaintingListItem(props: PaintingListItemProps) {
  const { id, isFirst, isLast } = props;

  const [paintings, setPaintings] = useAtom(paintingsAtom);
  const painting = useMemo(() => paintings[id], [id, paintings]);
  const paintingImage = useMemo(() => getPaintingImage(painting), [painting]);

  const updatePainting = useCallback(
    (painting: Partial<Painting>) => {
      setPaintings((paintings) => ({
        ...paintings,
        [id]: {
          ...paintings[id],
          ...painting,
        },
      }));
    },
    [id, setPaintings]
  );

  const removePainting = useCallback(() => {
    setPaintings((paintings) => {
      const result: Paintings = {};
      for (const [key, painting] of Object.entries(paintings)) {
        if (key !== id) {
          result[key] = painting;
        }
      }
      return result;
    });
  }, [id, setPaintings]);

  const moveUp = useCallback(() => {
    setPaintings((paintings) => {
      const result: Paintings = {};
      const keys = Object.keys(paintings);
      const index = keys.indexOf(id);
      if (index > 0) {
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (i === index - 1) {
            result[key] = paintings[keys[i + 1]];
          } else if (i === index) {
            result[key] = paintings[keys[i - 1]];
          } else {
            result[key] = paintings[key];
          }
        }
      }
      return result;
    });
  }, [id, setPaintings]);

  const moveDown = useCallback(() => {
    setPaintings((paintings) => {
      const result: Paintings = {};
      const keys = Object.keys(paintings);
      const index = keys.indexOf(id);
      if (index < keys.length - 1) {
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (i === index) {
            result[key] = paintings[keys[i + 1]];
          } else if (i === index + 1) {
            result[key] = paintings[keys[i - 1]];
          } else {
            result[key] = paintings[key];
          }
        }
      }
      return result;
    });
  }, [id, setPaintings]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1.5rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--size-1)',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            height: '100%',
          }}
        >
          <Button onClick={removePainting}>Remove</Button>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--size-1)',
              alignItems: 'stretch',
              flex: '0 0 auto',
            }}
          >
            {isFirst ? null : <Button onClick={moveUp}>Up</Button>}
            {isLast ? null : <Button onClick={moveDown}>Down</Button>}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--size-1)',
          }}
        >
          <TextInput
            id={`painting-id-${painting.id}`}
            label="ID"
            value={painting.id}
            onChange={(e) => {
              updatePainting({ id: e.target.value });
            }}
          />
          <TextInput
            id={`painting-name-${painting.id}`}
            label="Name"
            value={painting.name || ''}
            onChange={(e) => {
              updatePainting({ name: e.target.value });
            }}
          />
          <TextInput
            id={`painting-artist-${painting.id}`}
            label="Artist"
            value={painting.artist || ''}
            onChange={(e) => {
              updatePainting({ artist: e.target.value });
            }}
          />
          <NumberInput
            id={`painting-width-${painting.id}`}
            label="Width"
            min={1}
            max={8}
            value={painting.width}
            onChange={(e) => {
              updatePainting({
                width: parseInt(e.target.value, 10),
              });
            }}
          />
          <NumberInput
            id={`painting-height-${painting.id}`}
            label="Height"
            min={1}
            max={8}
            value={painting.height}
            onChange={(e) => {
              updatePainting({
                height: parseInt(e.target.value, 10),
              });
            }}
          />
        </div>
        <PaintingGrid
          maxHeight={8}
          maxWidth={8}
          hasImage={painting.data !== undefined}
          imageData={paintingImage}
          height={painting.height}
          width={painting.width}
          onUpload={(acceptedFiles) => {
            const reader = new FileReader();
            reader.onload = () => {
              const data = reader.result;
              if (typeof data === 'string') {
                updatePainting({ data });
              }
            };
            reader.readAsDataURL(acceptedFiles[0]);
          }}
        />
      </div>
    </>
  );
}
