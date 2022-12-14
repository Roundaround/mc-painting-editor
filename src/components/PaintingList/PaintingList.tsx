import { Button, ButtonStyle } from 'components/Button';
import { PaintingListItem } from 'components/PaintingListItem';
import { TooltipDirection } from 'components/Tooltip';
import { useAtom } from 'jotai';
import { Fragment, useCallback, useMemo } from 'react';
import { getDefaultPainting, paintingsAtom } from 'utils/store';
import styles from './PaintingList.module.scss';

export function PaintingList() {
  const [paintings, setPaintings] = useAtom(paintingsAtom);
  const paintingIds = useMemo(() => Array.from(paintings.keys()), [paintings]);

  const addPainting = useCallback(() => {
    setPaintings((paintings) => {
      let nextNum = paintings.size + 1;
      while (paintings.has(`painting-${nextNum}`)) {
        nextNum++;
      }

      const id = `painting-${nextNum}`;
      return new Map(paintings).set(id, getDefaultPainting(id));
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
          gap: 'var(--size-4)',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: 'var(--font-size-5)' }}>
          Paintings ({paintingIds.length})
        </div>
        <Button
          onClick={addPainting}
          style={ButtonStyle.ICON}
          tooltip={{
            content: 'Add a painting',
            noWrap: true,
            direction: TooltipDirection.BOTTOM,
          }}
        >
          <i className="fas fa-plus" />
        </Button>
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
