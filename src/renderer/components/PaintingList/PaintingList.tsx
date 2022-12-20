import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment, useCallback, useMemo } from 'react';
import { getDefaultPainting } from '../../utils/painting';
import { paintingsAtom, usePaintingsState } from '../../utils/store';
import { Button, ButtonStyle } from '../Button';
import { PaintingListItem } from '../PaintingListItem';
import { TooltipDirection } from '../Tooltip';
import styles from './PaintingList.module.scss';

export function PaintingList() {
  const { getAllIds, getAll, add } = usePaintingsState();
  const paintingIds = useMemo(() => getAllIds(), [getAllIds]);

  // TODO: Indicate how many paintings have no image
  const paintingsWithoutImages = useMemo(() => {
    return getAll().filter((painting) => !painting.path).length;
  }, [getAll]);

  const addPainting = useCallback(() => {
    let nextNum = paintingIds.length + 1;
    while (paintingIds.indexOf(`painting-${nextNum}`) > -1) {
      nextNum++;
    }

    paintingsAtom.update((paintings) =>
      add(paintings, getDefaultPainting(`painting-${nextNum}`))
    );
  }, [paintingIds, add]);

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
