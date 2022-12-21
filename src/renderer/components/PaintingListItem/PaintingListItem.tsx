import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo } from 'react';
import { paintingsSlice } from '../../../common/store';
import { getPaintingImage } from '../../utils/painting';
import {
  paintingsSelectors,
  useDispatch,
  useSelector,
} from '../../utils/store';
import { Button, ButtonStyle } from '../Button';
import { NumberInput } from '../NumberInput';
import { PaintingGrid } from '../PaintingGrid';
import { TextInput } from '../TextInput';

const { updatePainting, movePaintingUp, movePaintingDown, removePainting } =
  paintingsSlice.actions;

export interface PaintingListItemProps {
  id: string;
  isFirst: boolean;
  isLast: boolean;
}

export function PaintingListItem(props: PaintingListItemProps) {
  const { id, isFirst, isLast } = props;

  const painting = useSelector((state) =>
    paintingsSelectors.selectById(state, id)
  );

  const paintingImage = useMemo(() => {
    return getPaintingImage(painting);
  }, [painting]);

  const dispatch = useDispatch();

  if (!painting) {
    return null;
  }

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
            id={`painting-id-${id}`}
            label="ID"
            value={painting.id}
            onChange={(e) => {
              dispatch(updatePainting({ id, changes: { id: e.target.value } }));
            }}
          />
          <TextInput
            id={`painting-name-${id}`}
            label="Name"
            value={painting.name}
            onChange={(e) => {
              dispatch(
                updatePainting({ id, changes: { name: e.target.value } })
              );
            }}
          />
          <TextInput
            id={`painting-artist-${id}`}
            label="Artist"
            value={painting.artist}
            onChange={(e) => {
              dispatch(
                updatePainting({ id, changes: { artist: e.target.value } })
              );
            }}
          />
          <NumberInput
            id={`painting-width-${id}`}
            label="Width"
            min={1}
            max={8}
            value={painting.width}
            onChange={(e) => {
              dispatch(
                updatePainting({
                  id,
                  changes: { width: parseInt(e.target.value, 10) },
                })
              );
            }}
          />
          <NumberInput
            id={`painting-height-${id}`}
            label="Height"
            min={1}
            max={8}
            value={painting.height}
            onChange={(e) => {
              dispatch(
                updatePainting({
                  id,
                  changes: { height: parseInt(e.target.value, 10) },
                })
              );
            }}
          />
        </div>
        <PaintingGrid
          onClick={() => window.electron.openPaintingFile(id)}
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
            onClick={() => {
              dispatch(removePainting(id));
            }}
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
                onClick={() => {
                  dispatch(movePaintingUp(id));
                }}
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
                onClick={() => {
                  dispatch(movePaintingDown(id));
                }}
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
