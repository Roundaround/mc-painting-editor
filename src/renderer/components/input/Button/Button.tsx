import { ButtonHTMLAttributes, DetailedHTMLProps, FC, ReactNode } from 'react';

import { Tooltip, TooltipProps } from '$renderer/components/Tooltip';
import { clsxm } from '$renderer/utils/clsxm';

import styles from './Button.module.scss';

type TooltipPropsSansChildren = Omit<TooltipProps, 'children'>;

export enum ButtonVariant {
  DEFAULT = 'default',
  LARGE = 'large',
  ICON = 'icon',
  ICON_MINI = 'icon-mini',
  ICON_TINY = 'icon-tiny',
}

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

const InnerButton: FC<ButtonProps> = ({
  children,
  variant,
  className,
  ...htmlProps
}) => {
  return (
    <button
      className={clsxm(
        styles['button'],
        'items-center justify-center rounded-md bg-blue-600 px-3 py-1 text-base font-medium text-gray-100 duration-75 before:rounded-md before:bg-neutral-200 before:opacity-0 before:transition-opacity hover:before:opacity-10 active:before:opacity-0',
        {
          'rounded-2xl px-8 py-5 text-2xl font-bold before:rounded-2xl':
            variant === ButtonVariant.LARGE,
          'inline-flex aspect-square p-0 [&>svg]:w-full':
            variant === ButtonVariant.ICON ||
            variant === ButtonVariant.ICON_MINI ||
            variant === ButtonVariant.ICON_TINY,
          'w-8 rounded-full before:rounded-full':
            variant === ButtonVariant.ICON,
          'w-6 rounded-full before:rounded-full':
            variant === ButtonVariant.ICON_MINI,
          'w-4 rounded-full text-xs before:rounded-full':
            variant === ButtonVariant.ICON_TINY,
        },
        className,
      )}
      type="button"
      {...htmlProps}
    >
      {children}
    </button>
  );
};

export const Button = ({ tooltip, ...props }: ButtonProps) => {
  if (tooltip === undefined) {
    return <InnerButton {...props} />;
  }

  const tooltipProps = isTooltipProps(tooltip) ? tooltip : { content: tooltip };
  return (
    <Tooltip directTabbable={false} {...tooltipProps}>
      <InnerButton {...props} />
    </Tooltip>
  );
};

function isTooltipProps(
  tooltip: ReactNode | TooltipPropsSansChildren,
): tooltip is TooltipPropsSansChildren {
  return (tooltip as TooltipPropsSansChildren).content !== undefined;
}
