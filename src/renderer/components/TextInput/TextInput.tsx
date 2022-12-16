import styles from './TextInput.module.scss';

interface TextInputProps {
  id: string;
  label: string;
  prefix?: string;
  suffix?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextInput = (props: TextInputProps) => {
  const { id, label, prefix, suffix, value, onChange, ...rest } = props;

  return (
    <div className={styles['text-input']}>
      <label htmlFor={id} className={styles['text-input__label']}>
        {label}
      </label>
      <div className={styles['text-input__input-container']}>
        {!prefix ? null : (
          <div className={styles['text-input__prefix']}>{prefix}</div>
        )}
        <input
          id={id}
          className={styles['text-input__input']}
          value={value}
          onChange={onChange}
          {...rest}
        />
        {!suffix ? null : (
          <div className={styles['text-input__suffix']}>{suffix}</div>
        )}
      </div>
    </div>
  );
};
