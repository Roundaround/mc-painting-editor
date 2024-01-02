import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';

import type { TooltipPropsSansChildren } from '$renderer/components/Tooltip';
import { Tooltip, isTooltipProps } from '$renderer/components/Tooltip';
import { clsxm } from '$renderer/utils/clsxm';

export enum ButtonVariant {
  DEFAULT = 'default',
  LARGE = 'large',
  ICON = 'icon',
  ICON_MINI = 'icon-mini',
  ICON_TINY = 'icon-tiny',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tooltip?: ReactNode | TooltipPropsSansChildren;
  variant?: ButtonVariant;
};

const InnerButton: FC<ButtonProps> = ({
  variant,
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={clsxm(
        'group inline-block items-center justify-center rounded-md bg-blue-600 px-2 py-1 text-base font-medium text-gray-100 transition-[shadow,transform] duration-75 hover:scale-105 hover:shadow-lg active:scale-95',
        {
          'rounded-2xl px-8 py-5 text-2xl font-bold':
            variant === ButtonVariant.LARGE,
          'inline-flex aspect-square p-0 [&>svg]:w-full':
            variant === ButtonVariant.ICON ||
            variant === ButtonVariant.ICON_MINI ||
            variant === ButtonVariant.ICON_TINY,
          'w-8 rounded-full': variant === ButtonVariant.ICON,
          'w-6 rounded-full': variant === ButtonVariant.ICON_MINI,
          'w-4 rounded-full text-xs': variant === ButtonVariant.ICON_TINY,
        },
        className,
      )}
      type="button"
      {...props}
    >
      <>
        <div
          className={clsxm(
            'pointer-events-none absolute left-0 top-0 z-10 h-full w-full rounded-md bg-neutral-200 opacity-0 transition-opacity group-hover:opacity-10 group-active:opacity-0',
            {
              'rounded-2xl': variant === ButtonVariant.LARGE,
              'rounded-full':
                variant === ButtonVariant.ICON ||
                variant === ButtonVariant.ICON_MINI ||
                variant === ButtonVariant.ICON_TINY,
            },
          )}
        />
        {children}
      </>
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

export default Button;
