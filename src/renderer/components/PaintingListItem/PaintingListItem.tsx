import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HTMLProps, useMemo } from 'react';
import { paintingsSlice } from '../../../common/store';
import { getPaintingImage } from '../../utils/painting';
import {
  paintingsSelectors,
  useDispatch,
  useSelector,
} from '../../utils/store';
import { Button, ButtonVariant } from '../Button';
import { NumberInput } from '../NumberInput';
import { PaintingGrid } from '../PaintingGrid';
import { TextInput } from '../TextInput';
import { Tooltip, TooltipDirection } from '../Tooltip';
import styles from './PaintingListItem.module.scss';

const { updatePainting, movePaintingUp, movePaintingDown, removePainting } =
  paintingsSlice.actions;

export interface PaintingListItemProps extends HTMLProps<HTMLDivElement> {
  id: string;
}

export function PaintingListItem(props: PaintingListItemProps) {
  const { id, className: passedClassName, ...htmlProps } = props;

  const painting = useSelector((state) =>
    paintingsSelectors.selectById(state, id)
  );
  const totalPaintings = useSelector(paintingsSelectors.selectTotal);
  const paintingIds = useSelector(paintingsSelectors.selectIds);

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
        hasImage={painting.path !== undefined}
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
            content={`Currently at position ${currentIndex + 1} of ${totalPaintings}`}
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
