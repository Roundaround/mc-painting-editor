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

  if (tooltip === undefined) {
    return button;
  }

  const tooltipProps = isTooltipProps(tooltip) ? tooltip : { content: tooltip };
  return <Tooltip {...tooltipProps}>{button}</Tooltip>;
};

function isTooltipProps(
  tooltip: ReactNode | TooltipProps
): tooltip is TooltipProps {
  return (tooltip as TooltipProps).content !== undefined;
}
