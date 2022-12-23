import { FC, Fragment, HTMLProps } from 'react';
import { paintingsAdapter } from '../../../common/store';
import { RootState, useSelector } from '../../utils/store';
import { PaintingListItem } from '../PaintingListItem';
import styles from './PaintingList.module.scss';

export const PaintingList: FC<HTMLProps<HTMLDivElement>> = (props) => {
  const { className: passedClassName, ...htmlProps } = props;

  const paintingIds = useSelector(
    paintingsAdapter.getSelectors((state: RootState) => state.paintings)
      .selectIds
  ) as string[];

  // TODO: Indicate how many paintings have no image

  return (
    <div
      {...htmlProps}
      className={[
        passedClassName || '',
        styles['list'],
        paintingIds.length === 0 ? styles['list--empty'] : '',
      ]
        .filter((name): name is keyof typeof styles => !!name)
        .map((name) => styles[name])
        .join(' ')}
    >
      {paintingIds.length > 0 ? null : <div>No paintings...yet!</div>}
      {paintingIds.map((id, index) => (
        <Fragment key={id}>
          <PaintingListItem
            id={id}
            isFirst={index === 0}
            isLast={index === paintingIds.length - 1}
          />
          {index === paintingIds.length - 1 ? null : (
            <hr style={{ height: 'var(--border-size-1)', margin: '0' }} />
          )}
        </Fragment>
      ))}
    </div>
  );
};
