import {
  arePaintingsEqual,
  getDefaultPainting,
  getIssuesForPainting,
  paintingsActions,
  paintingsSelectors,
} from '$common/store/paintings';
import { Tooltip, TooltipDirection } from '$renderer/components/Tooltip';
import { Button, ButtonVariant } from '$renderer/components/Button';
import { Checkbox } from '$renderer/components/input/Checkbox';
import { NumberInput } from '$renderer/components/input/NumberInput';
import { TextInput } from '$renderer/components/input/TextInput';
import { clsxm } from '$renderer/utils/clsxm';
import { getPaintingImage } from '$renderer/utils/painting';
import { useDispatch, useSelector } from '$renderer/utils/store/root';
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
    (state) => paintingsSelectors.selectById(state, id)!,
  );
  const targetScale = useSelector((state) => state.metadata.targetScale);
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
    return getIssuesForPainting(painting, targetScale);
  }, [
    painting.id,
    painting.path,
    painting.width,
    painting.height,
    painting.pixelWidth,
    painting.pixelHeight,
    targetScale,
  ]);

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
    <div
      className={clsxm(classNames, {
        'bg-blue-600/20': painting.marked,
      })}
      {...htmlProps}
    >
      {!issues.length ? null : (
        <div className={styles['icon-column']}>
          {issues.map((issue) => {
            const classes = [, issue.severity]
              .map((name) => styles[name as keyof typeof styles])
              .join(' ');

            return (
              <Tooltip
                content={issue.message}
                direction={TooltipDirection.RIGHT}
                noWrap={issue.message.length < 20}
                key={issue.message}
              >
                <div
                  className={clsxm(
                    'flex-fixed flex aspect-square w-8 items-center justify-center rounded-full bg-blue-600 p-0 text-gray-100 [&>svg]:w-full',
                    {
                      'bg-red-900': issue.severity === 'error',
                    },
                  )}
                >
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
              updatePainting({ id, changes: { artist: e.target.value } }),
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
              }),
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
              }),
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
              setPaintingMarked({ id, marked: e.currentTarget.checked }),
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
          className="bg-red-900"
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
