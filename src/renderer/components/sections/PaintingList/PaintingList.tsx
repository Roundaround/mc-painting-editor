import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, Fragment, HTMLAttributes, useState } from 'react';

import {
  getDefaultPainting,
  paintingsActions,
  paintingsSelectors,
} from '$common/store/paintings';
import { Button, ButtonVariant } from '$renderer/components/Button';
import { TooltipDirection } from '$renderer/components/Tooltip';
import { Filters } from '$renderer/components/sections/PaintingList/Filters';
import { ListItem } from '$renderer/components/sections/PaintingList/ListItem';
import { clsxm } from '$renderer/utils/clsxm';
import {
  filtersActions,
  filtersSelectors,
} from '$renderer/utils/store/filters';
import { useDispatch, useSelector } from '$renderer/utils/store/root';

import styles from './PaintingList.module.scss';

const { resetAll } = filtersActions;
const { selectHasFilters, selectMatchingPaintings } = filtersSelectors;

export const PaintingList: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const paintingCount = useSelector(paintingsSelectors.selectTotal);
  const filteredPaintings = useSelector(selectMatchingPaintings);
  const hasFilters = useSelector(selectHasFilters);

  const dispatch = useDispatch();

  return (
    <div {...props} className={clsxm(styles['wrapper'], className)}>
      <div
        className={clsxm(
          styles['header'],
          'gap-5 border-b border-b-neutral-600 px-4 py-2',
        )}
      >
        <span className="text-xl">Paintings</span>
        <div className={clsxm(styles['actions'], 'gap-4')}>
          {!hasFilters ? null : (
            <Button
              onClick={() => {
                dispatch(resetAll());
                setShowFilters(false);
              }}
              variant={ButtonVariant.ICON}
              tooltip={{
                content: `Reset filters`,
                noWrap: true,
                direction: TooltipDirection.BOTTOM,
              }}
            >
              <FontAwesomeIcon icon={'rotate-left'} />
            </Button>
          )}
          <Button
            onClick={() => {
              setShowFilters((showFilters) => !showFilters);
            }}
            variant={ButtonVariant.ICON}
            tooltip={{
              content: `${showFilters ? 'Hide' : 'Show'} filters`,
              noWrap: true,
              direction: TooltipDirection.BOTTOM,
            }}
          >
            <FontAwesomeIcon icon={'filter'} />
          </Button>
          <Button
            onClick={() => {
              dispatch(paintingsActions.addPainting(getDefaultPainting()));
            }}
            variant={ButtonVariant.ICON}
            tooltip={{
              content: 'Add a painting',
              noWrap: true,
              direction: TooltipDirection.BOTTOM,
            }}
          >
            <FontAwesomeIcon icon={'plus'} />
          </Button>
        </div>
      </div>
      {!showFilters ? null : <Filters className="flex-fixed" />}
      <div
        className={clsxm(styles['list'], {
          'items-center justify-center text-xl italic text-gray-300':
            filteredPaintings.length === 0,
        })}
      >
        {paintingCount > 0 ? null : <div>No paintings...yet!</div>}
        {paintingCount === 0 || filteredPaintings.length > 0 ? null : (
          <div>No paintings found</div>
        )}
        {filteredPaintings.map((entityId, index) => (
          <Fragment key={entityId}>
            <ListItem entityId={entityId} />
            {index === filteredPaintings.length - 1 ? null : (
              <hr className="border-neutral-600" />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
