import { Button, ButtonVariant } from '$renderer/components/input/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, HTMLProps } from 'react';
import styles from './Chip.module.scss';

interface ChipProps extends HTMLProps<HTMLSpanElement> {
  label: string;
  outline?: boolean;
  onDelete?: () => void;
}

export const Chip: FC<ChipProps> = (props) => {
  const {
    label,
    outline,
    onDelete,
    className: passedClassName,
    ...htmlProps
  } = props;

  const classNames = [
    'chip',
    outline ? 'chip--outlined' : '',
    onDelete ? 'chip--deletable' : null,
  ]
    .map((name) => styles[name as keyof typeof styles])
    .concat(passedClassName || '')
    .join(' ')
    .trim();

  return (
    <span className={`${classNames} font-medium text-base`} {...htmlProps}>
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
