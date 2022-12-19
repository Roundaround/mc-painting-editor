import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAtom } from '@xoid/react';
import { Fragment, useMemo } from 'react';
import { getDefaultPainting } from '../../utils/painting';
import { paintingsAtom } from '../../utils/store';
import { Button, ButtonStyle } from '../Button';
import { PaintingListItem } from '../PaintingListItem';
import { TooltipDirection } from '../Tooltip';
import styles from './PaintingList.module.scss';

export function PaintingList() {
  const paintings = useAtom(paintingsAtom);

  const paintingIds = useMemo(() => Array.from(paintings.keys()), [paintings]);

  // TODO: Indicate how many paintings have no image
  const paintingsWithoutImages = useMemo(() => {
    return Object.values(paintings).filter((painting) => !painting.data).length;
  }, [paintings]);

  const addPainting = () => {
    paintingsAtom.update((paintings) => {
      let nextNum = paintings.size + 1;
      while (paintings.has(`painting-${nextNum}`)) {
        nextNum++;
      }

      const id = `painting-${nextNum}`;
      return new Map(paintings).set(id, getDefaultPainting(id));
    });
  };

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
          <FontAwesomeIcon icon={'plus'} />
        </Button>
      </div>
      <div
        className={['list', paintingIds.length === 0 ? 'list--empty' : '']
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
