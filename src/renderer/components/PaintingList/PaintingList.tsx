import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment } from 'react';
import { paintingsAdapter, paintingsSlice } from '../../../common/store';
import { RootState, useDispatch, useSelector } from '../../utils/store';
import { Button, ButtonStyle } from '../Button';
import { PaintingListItem } from '../PaintingListItem';
import { TooltipDirection } from '../Tooltip';
import styles from './PaintingList.module.scss';

export function PaintingList() {
  const paintingIds = useSelector(
    paintingsAdapter.getSelectors((state: RootState) => state.paintings)
      .selectIds
  ) as string[];
  const dispatch = useDispatch();

  // TODO: Indicate how many paintings have no image

  return (
    <>
      <div
        style={{
          width: '100%',
          paddingInline: 'var(--size-2)',
          display: 'flex',
          flexDirection: 'row',
          gap: 'var(--size-4)',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: 'var(--font-size-5)' }}>
          Paintings ({paintingIds.length})
        </div>
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
      <div
        className={['list', paintingIds.length === 0 ? 'list--empty' : '']
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
    </>
  );
}
