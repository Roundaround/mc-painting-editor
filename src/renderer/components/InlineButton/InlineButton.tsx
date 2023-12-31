import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react';

import { clsxm } from '$renderer/utils/clsxm';
import styles from './InlineButton.module.scss';

export interface InlineButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

export const InlineButton: FC<InlineButtonProps> = (props) => {
  const { onClick, children, className: passedClassName, ...htmlProps } = props;

  const classNames = ['wrapper']
    .map((name) => styles[name as keyof typeof styles])
    .concat(passedClassName || '')
    .join(' ')
    .trim();

  return (
    <button
      onClick={onClick}
      className={clsxm(classNames, 'group')}
      {...htmlProps}
    >
      <div
        className={clsxm(
          styles['overlay'],
          'bg-transparent, transition-colors duration-75 hover:bg-neutral-200/10 group-hover:bg-neutral-200/10',
        )}
      ></div>
      {children}
    </button>
  );
};
