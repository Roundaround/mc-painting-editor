import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC, HTMLProps } from 'react';
import { Fragment } from 'react';

import {
  migrationsActions,
  migrationsSelectors,
} from '$common/store/migrations';
import { Button, ButtonVariant } from '$renderer/components/Button';
import { Tooltip, TooltipDirection } from '$renderer/components/Tooltip';
import { clsxm } from '$renderer/utils/clsxm';
import { useDispatch, useSelector } from '$renderer/utils/store/root';

import styles from './MigrationList.module.scss';

const { removeMigration } = migrationsActions;

interface MigrationListProps extends HTMLProps<HTMLDivElement> {}

export const MigrationList: FC<MigrationListProps> = ({
  className,
  ...props
}) => {
  const migrations = useSelector(migrationsSelectors.selectAll);

  const dispatch = useDispatch();

  return (
    <div {...props} className={clsxm(styles['wrapper'], 'p-2', className)}>
      <div className="mb-4 text-xl">Migrations</div>
      {migrations.map((migration, index) => (
        <Fragment key={migration.id}>
          <div className={styles['migration']}>
            <div className={styles['info']}>
              <div>{migration.id}</div>
              <div>{migration.pairs.length} painting(s)</div>
            </div>
            <div className={clsxm(styles['actions'], 'gap-2')}>
              {!migration.description ? null : (
                <Tooltip
                  content={migration.description}
                  direction={TooltipDirection.RIGHT}
                >
                  <div
                    className={clsxm(
                      styles['description'],
                      'rounded-full bg-blue-600 text-gray-100',
                    )}
                  >
                    <FontAwesomeIcon icon="comment-dots" />
                  </div>
                </Tooltip>
              )}
              <Button
                className="bg-red-900"
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
          </div>
          {index === migrations.length - 1 ? null : (
            <hr className="border-white/20" />
          )}
        </Fragment>
      ))}
    </div>
  );
};
