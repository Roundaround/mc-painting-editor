import { FC, HTMLProps, ReactNode } from 'react';

import { BaseInput } from '$renderer/components/input/BaseInput/BaseInput';

import styles from './NumberInput.module.scss';

export interface NumberInputProps
  extends Omit<HTMLProps<HTMLDivElement>, 'label'> {
  label?: ReactNode;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: React.Ref<HTMLInputElement>;
}

export const NumberInput: FC<NumberInputProps> = (props: NumberInputProps) => {
  const {
    id,
    label,
    value,
    onChange,
    className: passedClassName,
    ...htmlProps
  } = props;

  const classNames = ['wrapper']
    .map((name) => styles[name as keyof typeof styles])
    .concat(passedClassName || '')
    .join(' ')
    .trim();

  return (
    <div className={classNames} {...htmlProps}>
      {!label ? null : (
        <label htmlFor={id} className="select-none text-xs">
          {label}
        </label>
      )}
      <div className={styles['input-container']}>
        <BaseInput
          id={id}
          ref={props.inputRef}
          className={styles['input']}
          type="number"
          value={value}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (isNaN(value)) {
              if (props.min === undefined) {
                return;
              }
              e.target.value = props.min.toString();
            } else if (props.min !== undefined && value < props.min) {
              e.target.value = props.min.toString();
            } else if (props.max !== undefined && value > props.max) {
              e.target.value = props.max.toString();
            }
            onChange?.(e);
          }}
        />
      </div>
    </div>
  );
};
