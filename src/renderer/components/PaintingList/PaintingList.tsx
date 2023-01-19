import { Button, ButtonVariant } from '@/components/Button';
import { Filters } from '@/components/Filters';
import { PaintingListItem } from '@/components/PaintingListItem';
import { TooltipDirection } from '@/components/Tooltip';
import { SizeFilter } from '@/utils/filtersSlice';
import { paintingsSelectors, useDispatch, useSelector } from '@/utils/store';
import { Painting, paintingsSlice } from '@common/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fuzzysort from 'fuzzysort';
import { FC, Fragment, HTMLProps, useMemo, useState } from 'react';
import styles from './PaintingList.module.scss';

function matchesSizeFilter<T extends 'width' | 'height'>(
  painting: Painting,
  filter: SizeFilter<T>
): boolean {
  const { operator, value } = filter;

  if (operator === 'eq' && painting[filter.dimension] !== value) {
    return false;
  }
  if (operator === 'ne' && painting[filter.dimension] === value) {
    return false;
  }
  if (operator === 'gt' && painting[filter.dimension] <= value) {
    return false;
  }
  if (operator === 'lt' && painting[filter.dimension] >= value) {
    return false;
  }

  return true;
}

export const PaintingList: FC<HTMLProps<HTMLDivElement>> = (props) => {
  const { className: passedClassName, ...htmlProps } = props;

  const paintingCount = useSelector(paintingsSelectors.selectTotal);
  const paintings = useSelector(paintingsSelectors.selectAll);
  const [showFilters, setShowFilters] = useState(false);
  const search = useSelector((state) => state.filters.search);
  const missingImage = useSelector((state) => state.filters.missingImage);
  const missingId = useSelector((state) => state.filters.missingId);
  const widthFilter = useSelector((state) => state.filters.width);
  const heightFilter = useSelector((state) => state.filters.height);

  const filteredPaintings = useMemo(() => {
    return paintings
      .filter((painting) => {
        if (missingImage && painting.path) {
          return false;
        }
        if (missingId && painting.id) {
          return false;
        }
        if (!matchesSizeFilter(painting, widthFilter)) {
          return false;
        }
        if (!matchesSizeFilter(painting, heightFilter)) {
          return false;
        }
        if (
          search &&
          fuzzysort.go(search, [painting.id, painting.name, painting.artist], {
            threshold: -10000,
          }).length === 0
        ) {
          return false;
        }
        return true;
      })
      .map((painting) => painting.uuid);
  }, [paintings, search, missingImage, missingId, widthFilter, heightFilter]);

  const dispatch = useDispatch();

  const classNames = ['wrapper']
    .map((name) => styles[name as keyof typeof styles])
    .concat(passedClassName || '')
    .join(' ')
    .trim();

  const listClassNames = [
    'list',
    filteredPaintings.length === 0 ? 'list--empty' : '',
  ]
    .map((name) => styles[name as keyof typeof styles])
    .join(' ')
    .trim();

  return (
    <div {...htmlProps} className={classNames}>
      <div className={styles['header']}>
        <span className={styles['title']}>Paintings</span>
        <div className={styles['actions']}>
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
              dispatch(paintingsSlice.actions.createPainting());
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
      {!showFilters ? null : <Filters className={styles['filters']} />}
      <div className={listClassNames}>
        {paintingCount > 0 ? null : <div>No paintings...yet!</div>}
        {paintingCount === 0 || filteredPaintings.length > 0 ? null : (
          <div>No paintings found</div>
        )}
        {filteredPaintings.map((id, index) => (
          <Fragment key={id}>
            <PaintingListItem id={id} />
            {index === filteredPaintings.length - 1 ? null : (
              <hr className={styles['divider']} />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
