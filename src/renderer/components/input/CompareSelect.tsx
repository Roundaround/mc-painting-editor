import { FC, HTMLAttributes } from 'react';

import type { CompareOperator } from '$renderer/utils/store/filters';

interface CompareSelect
  extends Omit<HTMLAttributes<HTMLFormElement>, 'onChange'> {
  id: string;
  label?: string;
  value?: CompareOperator;
  onChange?: (value: CompareOperator | undefined) => void;
}

export const CompareSelect: FC<CompareSelect> = ({
  id,
  label,
  onChange,
  value,
  className: passedClassName,
  ...props
}) => {
  const optionClasses = 'flex flex-row items-center gap-1';

  return (
    <form
      className="relative flex flex-row items-center gap-4 rounded-none border-none p-0"
      {...props}
    >
      <label className="select-none text-xs">{label}</label>

      <div className={optionClasses}>
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

      <div className={optionClasses}>
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

      <div className={optionClasses}>
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

      <div className={optionClasses}>
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
