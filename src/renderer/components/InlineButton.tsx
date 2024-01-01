import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';

import type { TooltipPropsSansChildren } from '$renderer/components/Tooltip';
import { Tooltip, isTooltipProps } from '$renderer/components/Tooltip';
import { clsxm } from '$renderer/utils/clsxm';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tooltip?: ReactNode | TooltipPropsSansChildren;
};

const InnerButton: FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={clsxm('group relative p-0', className)}
      type="button"
      {...props}
    >
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-full bg-transparent transition-colors duration-75 hover:bg-neutral-200/10 group-hover:bg-neutral-200/10"></div>
      {children}
    </button>
  );
};

export const InlineButton: FC<ButtonProps> = ({ tooltip, ...props }) => {
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
