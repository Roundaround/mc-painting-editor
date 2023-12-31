import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC, HTMLProps, ReactNode } from 'react';

import { BaseInput } from '$renderer/components/input/BaseInput/BaseInput';
import { Button, ButtonVariant } from '$renderer/components/input/Button';

import styles from './TextInput.module.scss';
import { clsxm } from '$renderer/utils/clsxm';

interface TextInputProps extends Omit<HTMLProps<HTMLDivElement>, 'label'> {
  label?: ReactNode;
  prefix?: string;
  suffix?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  inputRef?: React.Ref<HTMLInputElement>;
}

export const TextInput: FC<TextInputProps> = (props) => {
  const {
    id,
    label,
    prefix,
    suffix,
    value,
    onChange,
    onBlur,
    onEnter,
    onClear,
    className: passedClassName,
    ...htmlProps
  } = props;

  const classNames = ['wrapper']
    .map((name) => styles[name as keyof typeof styles])
    .concat(passedClassName || '')
    .join(' ')
    .trim();

  const inputClassNames = ['input', onClear ? 'input--clearable' : null]
    .map((name) => styles[name as keyof typeof styles])
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
        {!prefix ? null : <div className={styles['prefix']}>{prefix}</div>}
        <BaseInput
          id={id}
          ref={props.inputRef}
          className={inputClassNames}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={(event) => {
            if (onEnter && event.key === 'Enter') {
              onEnter(event);
            } else if (onClear && event.key === 'Escape') {
              onClear();
            }
          }}
        />
        {!onClear ? null : (
          <Button
            className={clsxm(styles['clear-button'], 'bg-neutral-700')}
            variant={ButtonVariant.ICON_MINI}
            onClick={onClear}
          >
            <FontAwesomeIcon icon={'xmark'} />
          </Button>
        )}
        {!suffix ? null : <div className={styles['suffix']}>{suffix}</div>}
      </div>
    </div>
  );
};
