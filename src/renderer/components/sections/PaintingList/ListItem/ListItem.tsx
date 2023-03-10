import { Button, ButtonVariant } from '@/components/input/Button';
import { Checkbox } from '@/components/input/Checkbox';
import { NumberInput } from '@/components/input/NumberInput';
import { TextInput } from '@/components/input/TextInput';
import { Tooltip, TooltipDirection } from '@/components/Tooltip';
import { getPaintingImage } from '@/utils/painting';
import { useDispatch, useSelector } from '@/utils/store';
import {
  arePaintingsEqual,
  getDefaultPainting,
  getIssuesForPainting,
  paintingsActions,
  paintingsSelectors,
} from '@common/store/paintings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EntityId } from '@reduxjs/toolkit';
import { HTMLProps, useMemo } from 'react';
import { ImageInput } from './ImageInput';
import styles from './ListItem.module.scss';

const {
  updatePainting,
  movePaintingUp,
  movePaintingDown,
  removePainting,
  setPaintingMarked,
} = paintingsActions;

export interface ListItemProps extends Omit<HTMLProps<HTMLDivElement>, 'id'> {
  id: EntityId;
}

export function ListItem(props: ListItemProps) {
  const { id, className: passedClassName, ...htmlProps } = props;

  const painting = useSelector(
    (state) => paintingsSelectors.selectById(state, id)!
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
  }, [painting.width, painting.height, painting.path]);

  const issues = useMemo(() => {
    return getIssuesForPainting(painting);
  }, [
    painting.id,
    painting.path,
    painting.width,
    painting.height,
    painting.pixelWidth,
    painting.pixelHeight,
  ]);

  const dispatch = useDispatch();

  const classNames = ['wrapper', painting.marked ? 'marked' : '']
    .map((name) => styles[name as keyof typeof styles])
    .concat(passedClassName || '')
    .join(' ')
    .trim();

  if (!painting) {
    return null;
  }

  return (
    <div className={classNames} {...htmlProps}>
      {!issues.length ? null : (
        <div className={styles['icon-column']}>
          {issues.map((issue) => {
            const classes = ['issue-icon', issue.severity]
              .map((name) => styles[name as keyof typeof styles])
              .join(' ');

            return (
              <Tooltip
                content={issue.message}
                direction={TooltipDirection.RIGHT}
                noWrap={issue.message.length < 20}
                key={issue.message}
              >
                <div className={classes}>
                  <FontAwesomeIcon icon={'triangle-exclamation'} />
                </div>
              </Tooltip>
            );
          })}
        </div>
      )}
      <div className={styles['inputs']}>
        <TextInput
          id={`painting-id-${id}`}
          label="ID"
          maxLength={32}
          value={painting.id}
          onChange={(e) => {
            dispatch(updatePainting({ id, changes: { id: e.target.value } }));
          }}
        />
        <TextInput
          id={`painting-name-${id}`}
          label="Name"
          maxLength={32}
          value={painting.name}
          onChange={(e) => {
            dispatch(updatePainting({ id, changes: { name: e.target.value } }));
          }}
        />
        <TextInput
          id={`painting-artist-${id}`}
          label="Artist"
          maxLength={32}
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
      <ImageInput
        onClick={() => window.electron.openPaintingFile(id)}
        maxHeight={8}
        maxWidth={8}
        hasImage={painting.path !== undefined && painting.path !== ''}
        image={paintingImage}
        height={painting.height}
        width={painting.width}
      />
      <div className={styles['icon-column']}>
        <Checkbox
          id={`marked-${id}`}
          className={styles['mark-checkbox']}
          onChange={(e) => {
            dispatch(
              setPaintingMarked({ id, marked: e.currentTarget.checked })
            );
          }}
          checked={painting.marked}
          tooltip={{
            content: 'Select for batch operations',
            direction: TooltipDirection.LEFT,
            noWrap: true,
          }}
        />

        <Button
          className={styles['delete-button']}
          onClick={() => {
            const isDefault = arePaintingsEqual(painting, getDefaultPainting());
            if (isDefault || confirm('Remove painting?')) {
              dispatch(removePainting(id));
            }
          }}
          variant={ButtonVariant.ICON}
          tooltip={{
            content: 'Remove',
            direction: TooltipDirection.LEFT,
          }}
        >
          <FontAwesomeIcon icon="trash" />
        </Button>

        <div className={styles['icon-column-gap']}></div>

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
  );
}
