import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC, InputHTMLAttributes, ReactNode } from 'react';

import { Button, ButtonVariant } from '$renderer/components/Button';
import { BaseInput } from '$renderer/components/input/BaseInput';
import { clsxm } from '$renderer/utils/clsxm';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  value: string;
  prefix?: string;
  suffix?: string;
  onEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  inputRef?: React.Ref<HTMLInputElement>;
}

export const TextInput: FC<TextInputProps> = ({
  id,
  label,
  prefix,
  suffix,
  onEnter,
  onClear,
  className,
  inputRef,
  ...props
}) => {
  return (
    <div className="gap-1/10 relative flex w-full flex-col">
      {!label ? null : (
        <label htmlFor={id} className="select-none text-xs">
          {label}
        </label>
      )}
      <div className="gap-1/10 flex flex-row items-center">
        {!prefix ? null : <div className="whitespace-nowrap">{prefix}</div>}
        <BaseInput
          id={id}
          ref={inputRef}
          className={clsxm(
            'flex-1',
            {
              'pr-9': !!onClear,
            },
            className,
          )}
          onKeyDown={(event) => {
            if (onEnter && event.key === 'Enter') {
              onEnter(event);
            } else if (onClear && event.key === 'Escape') {
              onClear();
            }
          }}
          {...props}
        />
        {!onClear ? null : (
          <Button
            className="absolute bottom-1 right-1 bg-neutral-700"
            variant={ButtonVariant.ICON_MINI}
            onClick={onClear}
          >
            <FontAwesomeIcon icon={'xmark'} />
          </Button>
        )}
        {!suffix ? null : <div className="whitespace-nowrap">{suffix}</div>}
      </div>
    </div>
  );
};

export default TextInput;
