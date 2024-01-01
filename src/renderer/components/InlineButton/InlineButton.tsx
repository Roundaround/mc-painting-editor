import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';

import type { TooltipPropsSansChildren } from '$renderer/components/Tooltip';
import { Tooltip, isTooltipProps } from '$renderer/components/Tooltip';
import { clsxm } from '$renderer/utils/clsxm';

import styles from './InlineButton.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tooltip?: ReactNode | TooltipPropsSansChildren;
};

const InnerButton: FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={clsxm(styles['wrapper'], className, 'group')}
      type="button"
      {...props}
    >
      <div
        className={clsxm(
          styles['overlay'],
          'bg-transparent, transition-colors duration-75 hover:bg-neutral-200/10 group-hover:bg-neutral-200/10',
        )}
      ></div>
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
