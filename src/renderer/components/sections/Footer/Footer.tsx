import { useDispatch, useSelector } from '@/utils/store';
import { filtersActions, filtersSelectors } from '@/utils/store/filters';
import { paintingsSelectors } from '@common/store/paintings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, HTMLProps, useMemo } from 'react';
import { InlineButton } from '../../InlineButton';
import styles from './Footer.module.scss';

const { selectMatchingPaintings } = filtersSelectors;
const { showMissingId, showMissingImage } = filtersActions;

interface FooterProps extends HTMLProps<HTMLDivElement> {}

export const Footer: FC<FooterProps> = (props) => {
  const { className: passedClassName, ...htmlProps } = props;

  const paintingCount = useSelector(paintingsSelectors.selectTotal);
  const paintings = useSelector(paintingsSelectors.selectAll);
  const filteredPaintings = useSelector((state) =>
    selectMatchingPaintings(state, paintings)
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
    <div className={classNames} {...htmlProps}>
      <span>Made with ❤️ by Roundaround</span>
      <span className={styles['spacer']}></span>
      {!paintingsWithoutId ? null : (
        <InlineButton
          className={styles['error']}
          onClick={() => {
            dispatch(showMissingId());
          }}
        >
          <FontAwesomeIcon icon={'triangle-exclamation'} />
          <span>Needs ID:</span>
          <span className={styles['stat']}>{paintingsWithoutId}</span>
        </InlineButton>
      )}
      {!paintingsWithoutImage ? null : (
        <InlineButton
          className={styles['error']}
          onClick={() => {
            dispatch(showMissingImage());
          }}
        >
          <FontAwesomeIcon icon={'triangle-exclamation'} />
          <span>Needs image:</span>
          <span className={styles['stat']}>{paintingsWithoutImage}</span>
        </InlineButton>
      )}
      {filteredPaintings.length === paintingCount ? null : (
        <span>
          Matching filters:&nbsp;
          <span className={styles['stat']}>{filteredPaintings.length}</span>
        </span>
      )}
      <span>
        Total paintings:&nbsp;
        <span className={styles['stat']}>{paintingCount}</span>
      </span>
    </div>
  );
};
