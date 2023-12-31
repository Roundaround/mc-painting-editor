import type { FC, InputHTMLAttributes } from 'react';

import { clsxm } from '$renderer/utils/clsxm';

type BaseInputProps = InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>;
};

export const BaseInput: FC<BaseInputProps> = ({ className, ...props }) => {
  return (
    <input
      className={clsxm(
        'cursor-auto rounded-md bg-neutral-700 px-2 py-1 text-gray-200',
        className,
      )}
      {...props}
    />
  );
};

export default BaseInput;
