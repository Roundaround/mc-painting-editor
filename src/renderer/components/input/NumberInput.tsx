import { FC, InputHTMLAttributes, ReactNode } from 'react';

import { BaseInput } from '$renderer/components/input/BaseInput';
import { clsxm } from '$renderer/utils/clsxm';

interface NumberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: React.Ref<HTMLInputElement>;
}

export const NumberInput: FC<NumberInputProps> = ({
  id,
  label,
  inputRef,
  min,
  max,
  step,
  value,
  onChange,
  onEnter,
  onKeyDown,
  className,
  ...props
}) => {
  return (
    <div
      className={clsxm('gap-1/10 relative flex w-full flex-col', className)}
      {...props}
    >
      {!label ? null : (
        <label htmlFor={id} className="select-none text-xs">
          {label}
        </label>
      )}
      <div className="gap-1/10 flex flex-row items-center">
        <BaseInput
          id={id}
          ref={inputRef}
          className={clsxm('flex-1', className)}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (isNaN(value)) {
              if (min === undefined) {
                return;
              }
              e.target.value = min.toString();
            } else if (min !== undefined && value < min) {
              e.target.value = min.toString();
            } else if (max !== undefined && value > max) {
              e.target.value = max.toString();
            }
            onChange?.(e);
          }}
          onKeyDown={(event) => {
            if (onEnter && event.key === 'Enter') {
              onEnter(event);
            }
            onKeyDown?.(event);
          }}
        />
      </div>
    </div>
  );
};

export default NumberInput;
