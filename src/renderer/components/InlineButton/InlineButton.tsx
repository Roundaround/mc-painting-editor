import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react';

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
    <button onClick={onClick} className={classNames} {...htmlProps}>
      <div className={styles['overlay']}></div>
      {children}
    </button>
  );
};
