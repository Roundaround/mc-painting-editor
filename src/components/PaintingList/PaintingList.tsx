import { PaintingListItem } from 'components/PaintingListItem';
import { useAtomValue } from 'jotai';
import { Fragment, useMemo } from 'react';
import { paintingsAtom } from 'utils/store';
import styles from './PaintingList.module.scss';

export function PaintingList() {
  const paintings = useAtomValue(paintingsAtom);
  const paintingIds = useMemo(() => Object.keys(paintings), [paintings]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 'var(--size-2)',
        }}
      >
        <div style={{ fontSize: 'var(--font-size-5)' }}>
          Paintings ({paintingIds.length})
        </div>
      </div>
      <div
        className={[
          styles['list'],
          paintingIds.length === 0 ? styles['list--empty'] : '',
        ].join(' ')}
      >
        {paintingIds.length > 0 ? null : <div>No paintings...yet!</div>}
        {paintingIds.map((id, index) => (
          <Fragment key={id}>
            <PaintingListItem id={id} />
            {index === paintingIds.length - 1 ? null : (
              <hr style={{ height: 'var(--border-size-1)', margin: '0' }} />
            )}
          </Fragment>
        ))}
      </div>
    </>
  );
}
