import { useSelector } from '@/utils/store';
import { filtersSelectors } from '@/utils/store/filters';
import { paintingsSelectors } from '@common/store/paintings';
import { FC, HTMLProps, useMemo } from 'react';
import styles from './AppFooter.module.scss';

const { selectMatchingPaintings } = filtersSelectors;

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

  const classNames = ['wrapper']
    .map((name) => styles[name as keyof typeof styles])
    .concat(passedClassName || '')
    .join(' ')
    .trim();

  return (
    <div className={classNames} {...htmlProps}>
      <div>Made with ❤️ by Roundaround</div>
      <div>
        {!paintingsWithoutId ? null : (
          <span>Needs ID: {paintingsWithoutId}</span>
        )}
        {!paintingsWithoutImage ? null : (
          <span>Needs image: {paintingsWithoutImage}</span>
        )}
        {filteredPaintings.length === paintingCount ? null : (
          <span>Matching filters: {filteredPaintings.length}</span>
        )}
        <span>Total paintings: {paintingCount}</span>
      </div>
    </div>
  );
};
