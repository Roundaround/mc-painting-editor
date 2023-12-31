import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, HTMLProps } from 'react';

import { Button, ButtonVariant } from '$renderer/components/input/Button';
import { clsxm } from '$renderer/utils/clsxm';

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
    <span
      className={clsxm(
        classNames,
        'bg-blue-600 text-base font-medium text-gray-100',
        {
          'border border-neutral-700 bg-transparent': outline,
        },
      )}
      {...htmlProps}
    >
      {label}
      {!onDelete ? null : (
        <Button
          className={clsxm(styles['delete-button'], 'bg-neutral-700', {
            'bg-blue-600': outline,
          })}
          variant={ButtonVariant.ICON_TINY}
          onClick={onDelete}
        >
          <FontAwesomeIcon icon={'xmark'} />
        </Button>
      )}
    </span>
  );
};
