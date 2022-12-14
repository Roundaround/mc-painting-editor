import { Tooltip, TooltipProps } from 'components/Tooltip';
import { ReactNode, useMemo } from 'react';
import styles from './Button.module.scss';

type TooltipPropsSansChildren = Omit<TooltipProps, 'children'>;

export interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  tooltip?: ReactNode | TooltipPropsSansChildren;
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
  tooltip: ReactNode | TooltipPropsSansChildren
): tooltip is TooltipPropsSansChildren {
  return (tooltip as TooltipPropsSansChildren).content !== undefined;
}
