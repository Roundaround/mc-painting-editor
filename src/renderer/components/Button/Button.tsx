import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
  useMemo,
} from 'react';
import { Tooltip, TooltipProps } from '../Tooltip';
import styles from './Button.module.scss';

type TooltipPropsSansChildren = Omit<TooltipProps, 'children'>;

export enum ButtonVariant {
  DEFAULT = 'default',
  LARGE = 'large',
  ICON = 'icon',
  ICON_MINI = 'icon-mini',
}

const defaultProps = {
  variant: ButtonVariant.DEFAULT,
};

interface ButtonProps
  extends Omit<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    'variant'
  > {
  tooltip?: ReactNode | TooltipPropsSansChildren;
  variant?: ButtonVariant;
}

export const Button = (props: ButtonProps & typeof defaultProps) => {
  const {
    onClick,
    children,
    tooltip,
    variant,
    className: passedClassName,
    ...htmlProps
  } = props;

  const button = useMemo(() => {
    const classNames = [
      styles['button'],
      variant === ButtonVariant.DEFAULT ? '' : styles[`button--${variant}`],
    ]
      .concat(passedClassName || '')
      .join(' ')
      .trim();

    return (
      <button
        onClick={onClick}
        className={classNames}
        type="button"
      >
        {children}
      </button>
    );
  }, [variant, onClick, children]);

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
