import { Tooltip, TooltipProps } from 'components/Tooltip';
import { ReactNode, useMemo } from 'react';
import styles from './Button.module.scss';

export interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  tooltip?: ReactNode | TooltipProps;
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

  const tooltipProps = useMemo(() => {
    if (tooltip === undefined) {
      return undefined;
    } else if (isTooltipProps(tooltip)) {
      return tooltip;
    } else {
      return { children: tooltip };
    }
  }, [tooltip]);

  return tooltip === undefined ? (
    button
  ) : (
    <Tooltip {...tooltipProps}>{button}</Tooltip>
  );
};

function isTooltipProps(
  tooltip: ReactNode | TooltipProps
): tooltip is TooltipProps {
  return (tooltip as TooltipProps).children !== undefined;
}
