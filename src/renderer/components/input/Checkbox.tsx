import { FC, InputHTMLAttributes, ReactNode } from 'react';

import type { TooltipPropsSansChildren } from '$renderer/components/Tooltip';
import { Tooltip, isTooltipProps } from '$renderer/components/Tooltip';
import { clsxm } from '$renderer/utils/clsxm';

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label?: string;
  inline?: boolean;
  tooltip?: ReactNode | TooltipPropsSansChildren;
};

const InnerCheckbox: FC<CheckboxProps> = ({
  id,
  label,
  inline,
  className,
  ...props
}) => {
  return (
    <div
      className={clsxm(
        'gap-1/10 relative flex flex-col',
        {
          'flex-row items-center gap-1': inline,
        },
        className,
      )}
    >
      {!label ? null : (
        <label htmlFor={id} className="select-none text-xs">
          {label}
        </label>
      )}
      <input id={id} type="checkbox" {...props} />
    </div>
  );
};

export const Checkbox: FC<CheckboxProps> = ({ tooltip, ...props }) => {
  if (tooltip === undefined) {
    return <InnerCheckbox {...props} />;
  }

  const tooltipProps = isTooltipProps(tooltip) ? tooltip : { content: tooltip };
  return (
    <Tooltip directTabbable={false} {...tooltipProps}>
      <InnerCheckbox {...props} />
    </Tooltip>
  );
};

export default Checkbox;
