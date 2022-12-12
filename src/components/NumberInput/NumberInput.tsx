import styles from './NumberInput.module.scss';

export interface NumberInputProps {
  id: string;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const NumberInput = (props: NumberInputProps) => {
  const { id, label, value, onChange, ...rest } = props;

  return (
    <div className={styles['number-input']}>
      <label htmlFor={id} className={styles['number-input__label']}>
        {label}
      </label>
      <div className={styles['number-input__input-container']}>
        <input
          id={id}
          className={styles['number-input__input']}
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
            onChange(e);
          }}
          {...rest}
        />
      </div>
    </div>
  );
};
