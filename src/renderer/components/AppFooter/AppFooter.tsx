import { FC, HTMLProps, useMemo } from 'react';
import { paintingsSelectors, useSelector } from '../../utils/store';
import styles from './AppFooter.module.scss';

interface AppFooterProps extends HTMLProps<HTMLDivElement> {}

export const AppFooter: FC<AppFooterProps> = (props) => {
  const { className: passedClassName, ...htmlProps } = props;

  const paintingCount = useSelector((state) =>
    paintingsSelectors.selectTotal(state)
  );
  const paintings = useSelector(paintingsSelectors.selectAll);
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
    <div className={classNames}>
      <div>Made with ❤️ by Roundaround</div>
      <div>
        {!paintingsWithoutId ? null : (
          <span>Needs ID: {paintingsWithoutId}</span>
        )}
        {!paintingsWithoutImage ? null : (
          <span>Needs image: {paintingsWithoutImage}</span>
        )}
        <span>Total paintings: {paintingCount}</span>
      </div>
    </div>
  );
};
