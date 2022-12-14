import { Button } from 'components/Button';
import { PaintingListItem } from 'components/PaintingListItem';
import { useAtom, useAtomValue } from 'jotai';
import { Fragment, useCallback, useMemo } from 'react';
import { getDefaultPainting, paintingsAtom } from 'utils/store';
import styles from './PaintingList.module.scss';

export function PaintingList() {
  const [paintings, setPaintings] = useAtom(paintingsAtom);
  const paintingIds = useMemo(() => Object.keys(paintings), [paintings]);

  const addPainting = useCallback(() => {
    setPaintings((paintings) => {
      const id = `painting-${Object.keys(paintings).length + 1}`;
      return {
        ...paintings,
        [id]: getDefaultPainting(id),
      };
    });
  }, [setPaintings]);

  return (
    <>
      <div
        style={{
          width: '100%',
          paddingInline: 'var(--size-2)',
          display: 'flex',
          flexDirection: 'row',
          gap: 'var(--size-2)',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: 'var(--font-size-5)' }}>
          Paintings ({paintingIds.length})
        </div>
        <Button onClick={addPainting}>Add Painting</Button>
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
