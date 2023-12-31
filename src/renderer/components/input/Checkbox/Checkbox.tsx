import { FC, HTMLProps, ReactNode, useMemo } from 'react';
import { Tooltip, TooltipProps } from '../../Tooltip';
import styles from './Checkbox.module.scss';

type TooltipPropsSansChildren = Omit<TooltipProps, 'children'>;

interface CheckboxProps extends HTMLProps<HTMLInputElement> {
  id: string;
  label?: string;
  inline?: boolean;
  tooltip?: ReactNode | TooltipPropsSansChildren;
}

export const Checkbox: FC<CheckboxProps> = (props) => {
  const {
    id,
    label,
    inline,
    tooltip,
    className: passedClassName,
    ...htmlProps
  } = props;

  const checkbox = useMemo(() => {
    const classNames = ['wrapper', inline ? 'wrapper--inline' : '']
      .map((name) => styles[name as keyof typeof styles])
      .concat(passedClassName || '')
      .join(' ')
      .trim();

    return (
      <div className={classNames}>
        {!label ? null : (
          <label htmlFor={id} className="select-none text-xs">
            {label}
          </label>
        )}
        <input id={id} type="checkbox" {...htmlProps} />
      </div>
    );
  }, [id, label, inline, passedClassName, htmlProps]);

  if (tooltip === undefined) {
    return checkbox;
  }

  const tooltipProps = isTooltipProps(tooltip) ? tooltip : { content: tooltip };
  return (
    <Tooltip directTabbable={false} {...tooltipProps}>
      {checkbox}
    </Tooltip>
  );
};

function isTooltipProps(
  tooltip: ReactNode | TooltipPropsSansChildren,
): tooltip is TooltipPropsSansChildren {
  return (tooltip as TooltipPropsSansChildren).content !== undefined;
}
