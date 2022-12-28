import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fuzzysort from 'fuzzysort';
import { FC, HTMLProps, useMemo, useState } from 'react';
import { Painting, paintingsSlice } from '../../../common/store';
import {
  paintingsSelectors,
  useDispatch,
  useSelector,
} from '../../utils/store';
import { Button, ButtonVariant } from '../Button';
import { Chip } from '../Chip';
import { PaintingListItem } from '../PaintingListItem';
import { TextInput } from '../TextInput';
import { TooltipDirection } from '../Tooltip';
import styles from './PaintingList.module.scss';

const searchKeys: (keyof Painting)[] = ['id', 'name', 'artist'];

export const PaintingList: FC<HTMLProps<HTMLDivElement>> = (props) => {
  const { className: passedClassName, ...htmlProps } = props;

  const paintingCount = useSelector(paintingsSelectors.selectTotal);
  const paintings = useSelector(paintingsSelectors.selectAll);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');

  const filteredPaintings = useMemo(() => {
    if (!search) {
      return paintings.map((painting) => painting.uuid);
    }

    return fuzzysort
      .go(search, paintings, {
        keys: searchKeys,
        threshold: -10000,
      })
      .map((result) => result.obj.uuid);
  }, [paintings, search]);

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
      {!showFilters ? null : (
        <div className={styles['filters']}>
          <TextInput
            id="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            onClear={() => {
              setSearch('');
            }}
          />
          <div className={styles['filter-chips']}>
            <Chip label="Filter 1" />
            <Chip label="Filter 2" onDelete={() => {}} />
            <Chip label="Filter 3" outline={true} />
            <Chip label="Filter 4" outline={true} onDelete={() => {}} />
          </div>
        </div>
      )}
      <div className={listClassNames}>
        {paintingCount > 0 ? null : <div>No paintings...yet!</div>}
        {paintingCount === 0 || filteredPaintings.length > 0 ? null : (
          <div>No paintings found</div>
        )}
        {filteredPaintings.map((id) => (
          <PaintingListItem key={id} id={id} />
        ))}
      </div>
    </div>
  );
};
