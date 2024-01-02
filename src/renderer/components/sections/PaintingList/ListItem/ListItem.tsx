import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EntityId } from '@reduxjs/toolkit';
import type { FC, HTMLAttributes } from 'react';
import { useMemo } from 'react';

import {
  arePaintingsEqual,
  getDefaultPainting,
  getIssuesForPainting,
  paintingsActions,
  paintingsSelectors,
} from '$common/store/paintings';
import { Button, ButtonVariant } from '$renderer/components/Button';
import { Tooltip, TooltipDirection } from '$renderer/components/Tooltip';
import { Checkbox } from '$renderer/components/input/Checkbox';
import { NumberInput } from '$renderer/components/input/NumberInput';
import { TextInput } from '$renderer/components/input/TextInput';
import { ImageInput } from '$renderer/components/sections/PaintingList/ListItem/ImageInput';
import { clsxm } from '$renderer/utils/clsxm';
import { getPaintingImage } from '$renderer/utils/painting';
import { useDispatch, useSelector } from '$renderer/utils/store/root';

const {
  updatePainting,
  movePaintingUp,
  movePaintingDown,
  removePainting,
  setPaintingMarked,
} = paintingsActions;

type ListItemProps = HTMLAttributes<HTMLDivElement> & {
  entityId: EntityId;
};

export const ListItem: FC<ListItemProps> = ({
  entityId,
  className,
  ...props
}) => {
  const painting = useSelector(
    (state) => paintingsSelectors.selectById(state, entityId)!,
  );
  const targetScale = useSelector((state) => state.metadata.targetScale);
  const totalPaintings = useSelector(paintingsSelectors.selectTotal);
  const paintingIds = useSelector(paintingsSelectors.selectIds);

  const currentIndex = useMemo(() => {
    return paintingIds.indexOf(entityId);
  }, [paintingIds, entityId]);

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

  if (!painting) {
    return null;
  }

  const iconColumnClasses =
    'gap-2 flex flex-col justify-start items-center h-full flex-fixed';

  return (
    <div
      className={clsxm(
        'flex flex-row items-center justify-start gap-5 p-4',
        {
          'bg-blue-600/20': painting.marked,
        },
        className,
      )}
      {...props}
    >
      {!issues.length ? null : (
        <div className={iconColumnClasses}>
          {issues.map((issue) => {
            return (
              <Tooltip
                content={issue.message}
                direction={TooltipDirection.RIGHT}
                noWrap={issue.message.length < 20}
                key={issue.message}
              >
                <div
                  className={clsxm(
                    'flex aspect-square w-8 flex-fixed items-center justify-center rounded-full bg-blue-600 p-0 text-gray-100 [&>svg]:w-full',
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
      <div className="flex flex-full flex-col items-stretch justify-start gap-4">
        <TextInput
          id={`painting-id-${entityId}`}
          label="ID"
          maxLength={32}
          value={painting.id}
          onChange={(e) => {
            dispatch(
              updatePainting({ id: entityId, changes: { id: e.target.value } }),
            );
          }}
        />
        <TextInput
          id={`painting-name-${entityId}`}
          label="Name"
          maxLength={32}
          value={painting.name}
          onChange={(e) => {
            dispatch(
              updatePainting({
                id: entityId,
                changes: { name: e.target.value },
              }),
            );
          }}
        />
        <TextInput
          id={`painting-artist-${entityId}`}
          label="Artist"
          maxLength={32}
          value={painting.artist}
          onChange={(e) => {
            dispatch(
              updatePainting({
                id: entityId,
                changes: { artist: e.target.value },
              }),
            );
          }}
        />
        <NumberInput
          id={`painting-width-${entityId}`}
          label="Width"
          min={1}
          max={8}
          value={painting.width}
          onChange={(e) => {
            dispatch(
              updatePainting({
                id: entityId,
                changes: { width: parseInt(e.target.value, 10) },
              }),
            );
          }}
        />
        <NumberInput
          id={`painting-height-${entityId}`}
          label="Height"
          min={1}
          max={8}
          value={painting.height}
          onChange={(e) => {
            dispatch(
              updatePainting({
                id: entityId,
                changes: { height: parseInt(e.target.value, 10) },
              }),
            );
          }}
        />
      </div>
      <ImageInput
        className="flex-fixed"
        onClick={() => window.electron.openPaintingFile(entityId)}
        maxHeight={8}
        maxWidth={8}
        hasImage={painting.path !== undefined && painting.path !== ''}
        image={paintingImage}
        height={painting.height}
        width={painting.width}
      />
      <div className={iconColumnClasses}>
        <Checkbox
          id={`marked-${entityId}`}
          className="flex h-8 w-8 flex-fixed items-center justify-center"
          onChange={(e) => {
            dispatch(
              setPaintingMarked({
                id: entityId,
                marked: e.currentTarget.checked,
              }),
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
              dispatch(removePainting(entityId));
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

        <div className="flex-full"></div>

        {!canMoveUp ? null : (
          <Button
            onClick={() => {
              dispatch(movePaintingUp(entityId));
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
              dispatch(movePaintingDown(entityId));
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
};

export default ListItem;
