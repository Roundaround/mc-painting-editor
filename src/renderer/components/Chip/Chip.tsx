import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, HTMLProps } from 'react';
import { Button, ButtonVariant } from '../Button';
import styles from './Chip.module.scss';

interface ChipProps extends HTMLProps<HTMLSpanElement> {
  label: string;
  onDelete?: () => void;
}

export const Chip: FC<ChipProps> = (props) => {
  const { label, onDelete, className: passedClassName, ...htmlProps } = props;

  const classNames = ['chip', onDelete ? 'chip--deletable' : null]
    .map((name) => styles[name as keyof typeof styles])
    .concat(passedClassName || '')
    .join(' ')
    .trim();

  return (
    <span className={classNames} {...htmlProps}>
      {label}
      {!onDelete ? null : (
        <Button
          className={styles['delete-button']}
          variant={ButtonVariant.ICON_TINY}
          onClick={onDelete}
        >
          <FontAwesomeIcon icon={'xmark'} />
        </Button>
      )}
    </span>
  );
};
