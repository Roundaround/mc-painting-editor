import { ReactNode, useMemo } from 'react';
import { Tooltip, TooltipProps } from '../Tooltip';
import styles from './Button.module.scss';

type TooltipPropsSansChildren = Omit<TooltipProps, 'children'>;

export enum ButtonStyle {
  DEFAULT = 'default',
  LARGE = 'large',
  ICON = 'icon',
}

const defaultProps = {
  style: ButtonStyle.DEFAULT,
};

export interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  tooltip?: ReactNode | TooltipPropsSansChildren;
  style?: ButtonStyle;
}

export const Button = (props: ButtonProps & typeof defaultProps) => {
  const { onClick, children, tooltip, style } = props;

  const button = useMemo(() => {
    const classNames = [styles['button'], styles[`button--${style}`]].join(' ');

    return (
      <button onClick={onClick} className={classNames} type="button">
        {children}
      </button>
    );
  }, [style, onClick, children]);

  if (tooltip === undefined) {
    return button;
  }

  const tooltipProps = isTooltipProps(tooltip) ? tooltip : { content: tooltip };
  return <Tooltip {...tooltipProps}>{button}</Tooltip>;
};

Button.defaultProps = defaultProps;

function isTooltipProps(
  tooltip: ReactNode | TooltipPropsSansChildren
): tooltip is TooltipPropsSansChildren {
  return (tooltip as TooltipPropsSansChildren).content !== undefined;
}
