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
}

export function PaintingListItem(props: PaintingListItemProps) {
  const { id } = props;

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

  const changePaintingId = useCallback(
    (newId: string) => {
      setPaintings((paintings) => {
        const result: Paintings = {};
        for (const [key, painting] of Object.entries(paintings)) {
          if (key === id) {
            result[newId] = painting;
          } else {
            result[key] = painting;
          }
        }
        return result;
      });
    },
    [id, setPaintings]
  );

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
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          <div>
            ID: <pre>{painting.id}</pre>
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
