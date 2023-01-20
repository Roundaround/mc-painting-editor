import { Button, ButtonVariant } from '@/components/Button';
import { NumberInput } from '@/components/NumberInput';
import { PaintingGrid } from '@/components/PaintingGrid';
import { TextInput } from '@/components/TextInput';
import { Tooltip, TooltipDirection } from '@/components/Tooltip';
import { getPaintingImage } from '@/utils/painting';
import { useDispatch, useSelector } from '@/utils/store';
import { paintingsActions, paintingsSelectors } from '@common/store/paintings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HTMLProps, useMemo } from 'react';
import styles from './PaintingListItem.module.scss';

const { updatePainting, movePaintingUp, movePaintingDown, removePainting } =
  paintingsActions;

export interface PaintingListItemProps extends HTMLProps<HTMLDivElement> {
  id: string;
}

export function PaintingListItem(props: PaintingListItemProps) {
  const { id, className: passedClassName, ...htmlProps } = props;

  const painting = useSelector((state) =>
    paintingsSelectors.selectById(state.paintings, id)
  );
  const totalPaintings = useSelector((state) =>
    paintingsSelectors.selectTotal(state.paintings)
  );
  const paintingIds = useSelector((state) =>
    paintingsSelectors.selectIds(state.paintings)
  );

  const currentIndex = useMemo(() => {
    return paintingIds.indexOf(id);
  }, [paintingIds, id]);

  const canMoveUp = useMemo(() => {
    return currentIndex > 0;
  }, [currentIndex]);

  const canMoveDown = useMemo(() => {
    return currentIndex < totalPaintings - 1;
  }, [currentIndex, totalPaintings]);

  const paintingImage = useMemo(() => {
    return getPaintingImage(painting);
  }, [painting]);

  const dispatch = useDispatch();

  const classNames = ['wrapper']
    .map((name) => styles[name as keyof typeof styles])
    .concat(passedClassName || '')
    .join(' ')
    .trim();

  if (!painting) {
    return null;
  }

  return (
    <div className={classNames} {...htmlProps}>
      <div className={styles['inputs']}>
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
            dispatch(updatePainting({ id, changes: { name: e.target.value } }));
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
        hasImage={painting.path !== undefined && painting.path !== ''}
        image={paintingImage}
        height={painting.height}
        width={painting.width}
      />
      <div className={styles['actions']}>
        <Button
          onClick={() => {
            dispatch(removePainting(id));
          }}
          variant={ButtonVariant.ICON}
          tooltip={{
            content: 'Remove',
            direction: TooltipDirection.LEFT,
          }}
        >
          <FontAwesomeIcon icon={'trash'} />
        </Button>
        <div className={styles['actions-group']}>
          {!canMoveUp ? null : (
            <Button
              onClick={() => {
                dispatch(movePaintingUp(id));
              }}
              variant={ButtonVariant.ICON}
              tooltip={{
                content: 'Move Up',
                noWrap: true,
                direction: TooltipDirection.LEFT,
              }}
            >
              <FontAwesomeIcon icon={'arrow-up'} />
            </Button>
          )}
          <Tooltip
            content={`Currently at position ${
              currentIndex + 1
            } of ${totalPaintings}`}
            direction={TooltipDirection.LEFT}
            noWrap={true}
          >
            {currentIndex + 1}/{totalPaintings}
          </Tooltip>
          {!canMoveDown ? null : (
            <Button
              onClick={() => {
                dispatch(movePaintingDown(id));
              }}
              variant={ButtonVariant.ICON}
              tooltip={{
                content: 'Move Down',
                noWrap: true,
                direction: TooltipDirection.LEFT,
              }}
            >
              <FontAwesomeIcon icon={'arrow-down'} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
