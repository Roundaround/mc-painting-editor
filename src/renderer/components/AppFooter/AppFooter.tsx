import { useDispatch, useSelector } from '@/utils/store';
import { filtersActions, filtersSelectors } from '@/utils/store/filters';
import { paintingsSelectors } from '@common/store/paintings';
import { FC, HTMLProps, useMemo } from 'react';
import { InlineButton } from '../InlineButton';
import styles from './AppFooter.module.scss';

const { selectMatchingPaintings } = filtersSelectors;
const { resetAll, setMissingImage, setMissingId } = filtersActions;

interface AppFooterProps extends HTMLProps<HTMLDivElement> {}

export const AppFooter: FC<AppFooterProps> = (props) => {
  const { className: passedClassName, ...htmlProps } = props;

  const paintingCount = useSelector((state) =>
    paintingsSelectors.selectTotal(state.paintings)
  );
  const paintings = useSelector((state) =>
    paintingsSelectors.selectAll(state.paintings)
  );
  const filteredPaintings = useSelector((state) =>
    selectMatchingPaintings(paintings)(state.filters)
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
            dispatch(resetAll());
            dispatch(setMissingId(true));
          }}
        >
          Needs ID:&nbsp;
          <span className={styles['stat']}>{paintingsWithoutId}</span>
        </InlineButton>
      )}
      {!paintingsWithoutImage ? null : (
        <InlineButton
          className={styles['error']}
          onClick={() => {
            dispatch(resetAll());
            dispatch(setMissingImage(true));
          }}
        >
          Needs image:&nbsp;
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
