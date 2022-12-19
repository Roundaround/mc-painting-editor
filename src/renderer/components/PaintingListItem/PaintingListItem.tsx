import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAtom, useSetup } from '@xoid/react';
import { useCallback, useMemo } from 'react';
import {
  getDefaultPainting,
  getPaintingImage,
  Painting,
} from '../../utils/painting';
import { paintingsAtom } from '../../utils/store';
import { Button, ButtonStyle } from '../Button';
import { NumberInput } from '../NumberInput';
import { PaintingGrid } from '../PaintingGrid';
import { TextInput } from '../TextInput';

export interface PaintingListItemProps {
  id: string;
  isFirst: boolean;
  isLast: boolean;
}

export function PaintingListItem(props: PaintingListItemProps) {
  const { id, isFirst, isLast } = props;

  const paintingAtom = paintingsAtom.focus((paintings) => {
    console.log(paintings);
    return paintings.get(id);
  });
  const painting = useAtom(paintingAtom) || getDefaultPainting(id);
  const paintingImage = useMemo(() => getPaintingImage(painting), [painting]);

  useSetup((paintingAtomAtom, { effect }) => {
    effect(() => {
      const cancel = window.electron.onSet.paintingPath((id, path) => {
        if (id !== paintingAtomAtom.value.value.id) {
          return;
        }
        paintingAtomAtom.value.update((painting) => ({
          ...painting,
          path,
        }));
      });

      return cancel;
    });
  }, paintingAtom);

  const update = (partialPainting: Partial<Painting>) => {
    paintingAtom.update((painting) => ({
      ...painting,
      ...partialPainting,
    }));
  };

  const remove = useCallback(() => {
    paintingsAtom.update((paintings) => {
      const newPaintings = new Map(paintings);
      newPaintings.delete(id);
      return newPaintings;
    });
  }, [id]);

  const moveUp = useCallback(() => {
    paintingsAtom.update((paintings) => {
      const newPaintings = new Map(paintings);
      const painting = newPaintings.get(id);
      if (!painting) {
        return newPaintings;
      }

      const paintingIds = Array.from(newPaintings.keys());
      const index = paintingIds.indexOf(id);
      if (index === 0) {
        return newPaintings;
      }

      const prevId = paintingIds[index - 1];
      const prevPainting = newPaintings.get(prevId);
      if (!prevPainting) {
        return newPaintings;
      }

      newPaintings.set(id, prevPainting);
      newPaintings.set(prevId, painting);
      return newPaintings;
    });
  }, [id]);

  const moveDown = useCallback(() => {
    paintingsAtom.update((paintings) => {
      const newPaintings = new Map(paintings);
      const painting = newPaintings.get(id);
      if (!painting) {
        return newPaintings;
      }

      const paintingIds = Array.from(newPaintings.keys());
      const index = paintingIds.indexOf(id);
      if (index === paintingIds.length - 1) {
        return newPaintings;
      }

      const nextId = paintingIds[index + 1];
      const nextPainting = newPaintings.get(nextId);
      if (!nextPainting) {
        return newPaintings;
      }

      newPaintings.set(id, nextPainting);
      newPaintings.set(nextId, painting);
      return newPaintings;
    });
  }, [id]);

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
          }}
        >
          <TextInput
            id={`painting-id-${painting.id}`}
            label="ID"
            value={painting.id}
            onChange={(e) => {
              update({ id: e.target.value });
            }}
          />
          <TextInput
            id={`painting-name-${painting.id}`}
            label="Name"
            value={painting.name || ''}
            onChange={(e) => {
              update({ name: e.target.value });
            }}
          />
          <TextInput
            id={`painting-artist-${painting.id}`}
            label="Artist"
            value={painting.artist || ''}
            onChange={(e) => {
              update({ artist: e.target.value });
            }}
          />
          <NumberInput
            id={`painting-width-${painting.id}`}
            label="Width"
            min={1}
            max={8}
            value={painting.width}
            onChange={(e) => {
              update({
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
              update({
                height: parseInt(e.target.value, 10),
              });
            }}
          />
        </div>
        <PaintingGrid
          maxHeight={8}
          maxWidth={8}
          hasImage={painting.path !== undefined}
          image={paintingImage}
          height={painting.height}
          width={painting.width}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--size-2)',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            height: '100%',
          }}
        >
          <Button
            onClick={remove}
            style={ButtonStyle.ICON}
            tooltip={{
              content: 'Remove',
            }}
          >
            <FontAwesomeIcon icon={'trash'} />
          </Button>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--size-2)',
              alignItems: 'stretch',
              flex: '0 0 auto',
            }}
          >
            {isFirst ? null : (
              <Button
                onClick={moveUp}
                style={ButtonStyle.ICON}
                tooltip={{
                  content: 'Move Up',
                  noWrap: true,
                }}
              >
                <FontAwesomeIcon icon={'arrow-up'} />
              </Button>
            )}
            {isLast ? null : (
              <Button
                onClick={moveDown}
                style={ButtonStyle.ICON}
                tooltip={{
                  content: 'Move Down',
                  noWrap: true,
                }}
              >
                <FontAwesomeIcon icon={'arrow-down'} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
