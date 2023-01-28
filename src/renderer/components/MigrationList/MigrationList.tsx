import { useSelector } from '@/utils/store';
import { migrationsSelectors } from '@common/store/migrations';
import { FC, Fragment, HTMLProps } from 'react';
import styles from './MigrationList.module.scss';

interface MigrationListProps extends HTMLProps<HTMLDivElement> {}

export const MigrationList: FC<MigrationListProps> = (props) => {
  const { className: passedClassName, ...htmlProps } = props;

  const migrations = useSelector(migrationsSelectors.selectAll);

  const classNames = ['wrapper']
    .map((name) => styles[name as keyof typeof styles])
    .concat(passedClassName || '')
    .join(' ')
    .trim();

  return (
    <div {...htmlProps} className={classNames}>
      <div className={styles['header']}>Migrations</div>
      <div className={styles['list']}>
        {migrations.map((migration, index) => (
          <Fragment key={migration.id}>
            <div>{migration.id}</div>
            {index === migrations.length - 1 ? null : (
              <hr className={styles['divider']} />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
