import { FC, HTMLProps } from 'react';
import styles from './Checkbox.module.scss';

interface CheckboxProps extends HTMLProps<HTMLInputElement> {
  id: string;
  label?: string;
  inline?: boolean;
}

export const Checkbox: FC<CheckboxProps> = (props) => {
  const { id, label, inline, className: passedClassName, ...htmlProps } = props;

  const classNames = ['wrapper', inline ? 'wrapper--inline' : '']
    .map((name) => styles[name as keyof typeof styles])
    .concat(passedClassName || '')
    .join(' ')
    .trim();

  return (
    <div className={classNames}>
      {!label ? null : (
        <label htmlFor={id} className={styles['label']}>
          {label}
        </label>
      )}
      <input id={id} type="checkbox" {...htmlProps} />
    </div>
  );
};
