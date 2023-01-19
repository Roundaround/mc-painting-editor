import { FC, HTMLProps } from 'react';
import styles from './CompareSelect.module.scss';

interface CompareSelect
  extends Omit<HTMLProps<HTMLFormElement>, 'onChange'> {
  id: string;
  label?: string;
  onChange?: (value: 'gt' | 'lt' | 'eq' | 'ne' | undefined) => void;
}

export const CompareSelect: FC<CompareSelect> = (props) => {
  const {
    id,
    label,
    onChange,
    value,
    className: passedClassName,
    ...htmlProps
  } = props;

  const classNames = ['wrapper']
    .map((name) => styles[name as keyof typeof styles])
    .concat(passedClassName || '')
    .join(' ')
    .trim();

  return (
    <form className={classNames} {...htmlProps}>
      <label className={styles['label']}>{label}</label>

      <div className={styles['option']}>
        <label htmlFor={`${id}_gt`} className={styles['label']}>
          Greater than
        </label>
        <input
          type="radio"
          id={`${id}_gt`}
          name="gt"
          value="gt"
          checked={value === 'gt'}
          onChange={() => onChange?.('gt')}
        />
      </div>

      <div className={styles['option']}>
        <label htmlFor={`${id}_lt`} className={styles['label']}>
          Less than
        </label>
        <input
          type="radio"
          id={`${id}_lt`}
          name="lt"
          value="lt"
          checked={value === 'lt'}
          onChange={() => onChange?.('lt')}
        />
      </div>

      <div className={styles['option']}>
        <label htmlFor={`${id}_eq`} className={styles['label']}>
          Equal to
        </label>
        <input
          type="radio"
          id={`${id}_eq`}
          name="eq"
          value="eq"
          checked={value === 'eq'}
          onChange={() => onChange?.('eq')}
        />
      </div>

      <div className={styles['option']}>
        <label htmlFor={`${id}_ne`} className={styles['label']}>
          Not equal to
        </label>
        <input
          type="radio"
          id={`${id}_ne`}
          name="ne"
          value="ne"
          checked={value === 'ne'}
          onChange={() => onChange?.('ne')}
        />
      </div>
    </form>
  );
};
