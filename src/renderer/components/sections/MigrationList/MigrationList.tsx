import { Button, ButtonVariant } from '@/components/input/Button';
import { TooltipDirection } from '@/components/Tooltip';
import { useDispatch, useSelector } from '@/utils/store';
import {
  migrationsActions,
  migrationsSelectors,
} from '@common/store/migrations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, Fragment, HTMLProps } from 'react';
import styles from './MigrationList.module.scss';

const { removeMigration } = migrationsActions;

interface MigrationListProps extends HTMLProps<HTMLDivElement> {}

export const MigrationList: FC<MigrationListProps> = (props) => {
  const { className: passedClassName, ...htmlProps } = props;

  const migrations = useSelector(migrationsSelectors.selectAll);

  const dispatch = useDispatch();

  const classNames = ['wrapper']
    .map((name) => styles[name as keyof typeof styles])
    .concat(passedClassName || '')
    .join(' ')
    .trim();

  return (
    <div {...htmlProps} className={classNames}>
      <div className={styles['title']}>Migrations</div>
      {migrations.map((migration, index) => (
        <Fragment key={migration.id}>
          <div className={styles['migration']}>
            <div className={styles['info']}>
              <div>{migration.id}</div>
              <div>{migration.pairs.length} painting(s)</div>
            </div>
            <Button
              className={styles['delete-button']}
              onClick={() => {
                if (confirm('Are you sure? This cannot be undone.')) {
                  dispatch(removeMigration(migration.uuid));
                }
              }}
              variant={ButtonVariant.ICON}
              tooltip={{
                content: 'Remove',
                direction: TooltipDirection.RIGHT,
              }}
            >
              <FontAwesomeIcon icon="trash" />
            </Button>
          </div>
          {index === migrations.length - 1 ? null : (
            <hr className={styles['divider']} />
          )}
        </Fragment>
      ))}
    </div>
  );
};
