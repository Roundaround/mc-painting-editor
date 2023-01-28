import { useSelector } from '@/utils/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, HTMLProps } from 'react';
import styles from './IconInput.module.scss';

interface IconInputProps extends HTMLProps<HTMLDivElement> {}

export const IconInput: FC<IconInputProps> = (props) => {
  const { className: passedClassName, ...htmlProps } = props;

  const icon = useSelector((state) => state.metadata.icon);

  const wrapperClassNames = ['wrapper']
    .map((name) => styles[name as keyof typeof styles])
    .concat(passedClassName || '')
    .join(' ')
    .trim();

  const inputClassNames = ['input', !icon ? 'input--empty' : '']
    .map((name) => styles[name as keyof typeof styles])
    .join(' ')
    .trim();

  return (
    <div {...htmlProps} className={wrapperClassNames}>
      <div className={styles['label']}>Icon</div>
      <div
        className={inputClassNames}
        onClick={() => {
          window.electron.openIconFile();
        }}
      >
        <div className={styles['overlay']}>
          <div className={styles['overlay-icon']}>
            <FontAwesomeIcon icon="edit" />
          </div>
        </div>
        {!icon ? null : <img src={icon} className={styles['image']} />}
      </div>
    </div>
  );
};
