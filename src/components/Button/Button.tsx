import { Tooltip, TooltipProps } from 'components/Tooltip';
import { useMemo } from 'react';
import styles from './Button.module.scss';

export interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  tooltip?: TooltipProps;
}

export const Button = (props: ButtonProps) => {
  const { onClick, children, tooltip } = props;

  const button = useMemo(
    () => (
      <button onClick={onClick} className={styles['button']} type="button">
        <span className={styles['button-text']}>{children}</span>
      </button>
    ),
    [onClick, children]
  );

  return tooltip ? <Tooltip {...tooltip}>{button}</Tooltip> : button;
};
