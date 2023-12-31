import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC, HTMLProps } from 'react';
import { useMemo } from 'react';

import { paintingsSelectors } from '$common/store/paintings';
import { InlineButton } from '$renderer/components/InlineButton';
import { clsxm } from '$renderer/utils/clsxm';
import { useDispatch, useSelector } from '$renderer/utils/store';
import {
  filtersActions,
  filtersSelectors,
} from '$renderer/utils/store/filters';

import styles from './Footer.module.scss';

const { selectMatchingPaintings } = filtersSelectors;
const { showMissingId, showMissingImage } = filtersActions;

interface FooterProps extends HTMLProps<HTMLDivElement> {}

export const Footer: FC<FooterProps> = (props) => {
  const { className: passedClassName, ...htmlProps } = props;

  const paintingCount = useSelector(paintingsSelectors.selectTotal);
  const paintings = useSelector(paintingsSelectors.selectAll);
  const filteredPaintings = useSelector(selectMatchingPaintings);
  const paintingsWithWarnings = useSelector(
    paintingsSelectors.selectWithWarnings,
  );

  const paintingsWithoutImage = useMemo(() => {
    return paintings.filter((painting) => !painting.path).length;
  }, [paintings]);
  const paintingsWithoutId = useMemo(() => {
    return paintings.filter((painting) => !painting.id).length;
  }, [paintings]);

  const dispatch = useDispatch();

  const classNames = ['wrapper']
    .map((name) => styles[name as keyof typeof styles])
    .concat(passedClassName || '')
    .join(' ')
    .trim();

  return (
    <div className={clsxm(classNames, 'text-sm')} {...htmlProps}>
      <span>Made with ❤️ by Roundaround</span>
      <span className={styles['spacer']}></span>
      {!paintingsWithoutId ? null : (
        <InlineButton
          className={styles['stat'] + ' ' + styles['error']}
          onClick={() => {
            dispatch(showMissingId());
          }}
        >
          <FontAwesomeIcon icon={'triangle-exclamation'} />
          <span>Needs ID:</span>
          <span className={styles['number']}>{paintingsWithoutId}</span>
        </InlineButton>
      )}
      {!paintingsWithoutImage ? null : (
        <InlineButton
          className={styles['stat'] + ' ' + styles['error']}
          onClick={() => {
            dispatch(showMissingImage());
          }}
        >
          <FontAwesomeIcon icon={'triangle-exclamation'} />
          <span>Needs image:</span>
          <span className={styles['number']}>{paintingsWithoutImage}</span>
        </InlineButton>
      )}
      {paintingsWithWarnings.length === 0 ? null : (
        <span className={styles['stat']}>
          <FontAwesomeIcon icon={'triangle-exclamation'} />
          <span>With warnings:</span>
          <span className={styles['number']}>
            {paintingsWithWarnings.length}
          </span>
        </span>
      )}
      {filteredPaintings.length === paintingCount ? null : (
        <span className={styles['stat']}>
          <span>Matching filters:</span>
          <span className={styles['number']}>{filteredPaintings.length}</span>
        </span>
      )}
      <span className={styles['stat']}>
        <span>Total paintings:</span>
        <span className={styles['number']}>{paintingCount}</span>
      </span>
    </div>
  );
};
