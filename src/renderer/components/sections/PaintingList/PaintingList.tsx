import { Button, ButtonVariant } from '@/components/input/Button';
import { TooltipDirection } from '@/components/Tooltip';
import { useDispatch, useSelector } from '@/utils/store';
import { filtersActions, filtersSelectors } from '@/utils/store/filters';
import {
  getDefaultPainting,
  paintingsActions,
  paintingsSelectors,
} from '@common/store/paintings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, Fragment, HTMLProps, useState } from 'react';
import { Filters } from './Filters';
import { ListItem } from './ListItem';
import styles from './PaintingList.module.scss';

const { resetAll } = filtersActions;
const { selectHasFilters, selectMatchingPaintings } = filtersSelectors;

export const PaintingList: FC<HTMLProps<HTMLDivElement>> = (props) => {
  const { className: passedClassName, ...htmlProps } = props;

  const [showFilters, setShowFilters] = useState(false);

  const paintingCount = useSelector(paintingsSelectors.selectTotal);
  const paintings = useSelector(paintingsSelectors.selectAll);
  const filteredPaintings = useSelector((state) =>
    selectMatchingPaintings(state, paintings)
  );
  const hasFilters = useSelector(selectHasFilters);

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
      {!showFilters ? null : <Filters className={styles['filters']} />}
      <div className={listClassNames}>
        {paintingCount > 0 ? null : <div>No paintings...yet!</div>}
        {paintingCount === 0 || filteredPaintings.length > 0 ? null : (
          <div>No paintings found</div>
        )}
        {filteredPaintings.map((id, index) => (
          <Fragment key={id}>
            <ListItem id={id} />
            {index === filteredPaintings.length - 1 ? null : (
              <hr className={styles['divider']} />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
