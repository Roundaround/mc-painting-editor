import { FC, HTMLProps } from 'react';
import styles from './CompareSelect.module.scss';

interface CompareSelect extends Omit<HTMLProps<HTMLFormElement>, 'onChange'> {
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
      <label className="select-none text-xs">{label}</label>

      <div className={styles['option']}>
        <label htmlFor={`${id}_gt`} className="select-none text-xs">
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
        <label htmlFor={`${id}_lt`} className="select-none text-xs">
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
        <label htmlFor={`${id}_eq`} className="select-none text-xs">
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
        <label htmlFor={`${id}_ne`} className="select-none text-xs">
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
