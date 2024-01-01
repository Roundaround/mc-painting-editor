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

const InnerButton: FC<ButtonProps> = ({ variant, className, ...props }) => {
  return (
    <button
      className={clsxm(
        'inline-block items-center justify-center rounded-md bg-blue-600 px-2 py-1 text-base font-medium text-gray-100 transition-[shadow,transform] duration-75 before:pointer-events-none before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-md before:bg-neutral-200 before:opacity-0 before:transition-opacity hover:scale-105 hover:shadow-lg hover:before:opacity-10 active:scale-95 active:before:opacity-0',
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
      {...props}
    />
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
