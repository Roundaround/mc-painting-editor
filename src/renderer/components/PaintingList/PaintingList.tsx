import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, Fragment, HTMLProps } from 'react';
import { paintingsAdapter, paintingsSlice } from '../../../common/store';
import { RootState, useDispatch, useSelector } from '../../utils/store';
import { Button, ButtonStyle } from '../Button';
import { PaintingListItem } from '../PaintingListItem';
import { TooltipDirection } from '../Tooltip';
import styles from './PaintingList.module.scss';

export const PaintingList: FC<HTMLProps<HTMLDivElement>> = (props) => {
  const { className: passedClassName, ...htmlProps } = props;

  const dispatch = useDispatch();

  const paintingIds = useSelector(
    paintingsAdapter.getSelectors((state: RootState) => state.paintings)
      .selectIds
  ) as string[];
  const paintingCount = useSelector(
    paintingsAdapter.getSelectors((state: RootState) => state.paintings)
      .selectTotal
  );

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
        <span>Paintings</span>
        <div style={{ flex: '1 1 100%' }} />
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
