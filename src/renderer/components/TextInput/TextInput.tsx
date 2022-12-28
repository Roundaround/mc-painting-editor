import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSProperties, FC, HTMLProps } from 'react';
import { Button, ButtonVariant } from '../Button';
import styles from './TextInput.module.scss';

interface TextInputProps extends HTMLProps<HTMLDivElement> {
  id: string;
  label?: string;
  prefix?: string;
  suffix?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  style?: CSSProperties;
  inputProps?: HTMLProps<HTMLInputElement>;
}

export const TextInput: FC<TextInputProps> = (props) => {
  const {
    id,
    label,
    prefix,
    suffix,
    value,
    onChange,
    onClear,
    inputProps,
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
        <label htmlFor={id} className={styles['label']}>
          {label}
        </label>
      )}
      <div className={styles['input-container']}>
        {!prefix ? null : <div className={styles['prefix']}>{prefix}</div>}
        <input
          id={id}
          className={inputClassNames}
          value={value}
          onChange={onChange}
          {...inputProps}
        />
        {!onClear ? null : (
          <Button
            className={styles['clear-button']}
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
