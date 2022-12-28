import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, HTMLProps, useState } from 'react';
import { paintingsAdapter, paintingsSlice } from '../../../common/store';
import { RootState, useDispatch, useSelector } from '../../utils/store';
import { Button, ButtonStyle } from '../Button';
import { PaintingListItem } from '../PaintingListItem';
import { TooltipDirection } from '../Tooltip';
import styles from './PaintingList.module.scss';

export const PaintingList: FC<HTMLProps<HTMLDivElement>> = (props) => {
  const { className: passedClassName, ...htmlProps } = props;

  const paintingIds = useSelector(
    paintingsAdapter.getSelectors((state: RootState) => state.paintings)
      .selectIds
  ) as string[];
  const paintingCount = useSelector(
    paintingsAdapter.getSelectors((state: RootState) => state.paintings)
      .selectTotal
  );
  const [showFilters, setShowFilters] = useState(false);

  const dispatch = useDispatch();

  const classNames = ['wrapper']
    .map((name) => styles[name as keyof typeof styles])
    .concat(passedClassName || '')
    .join(' ')
    .trim();

  const listClassNames = ['list', paintingCount === 0 ? 'list--empty' : '']
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
            style={ButtonStyle.ICON}
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
            style={ButtonStyle.ICON}
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
        <div className={styles['filters']}>Filters placeholder</div>
      )}
      <div className={listClassNames}>
        {paintingIds.length > 0 ? null : <div>No paintings...yet!</div>}
        {paintingIds.map((id, index) => (
          <PaintingListItem
            key={id}
            id={id}
            isFirst={index === 0}
            isLast={index === paintingIds.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
