import type { FC, InputHTMLAttributes } from 'react';

import { clsxm } from '$renderer/utils/clsxm';

type BaseInputProps = InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>;
};

export const BaseInput: FC<BaseInputProps> = ({ className, ...props }) => {
  return (
    <input
      className={clsxm('rounded-md bg-neutral-700 text-gray-200', className)}
      {...props}
    />
  );
};

export default BaseInput;
