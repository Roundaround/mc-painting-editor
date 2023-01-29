import { IconInput } from '@/components/input/IconInput';
import { TextInput } from '@/components/input/TextInput';
import { useDispatch, useSelector } from '@/utils/store';
import { metadataActions } from '@common/store/metadata';
import { FC, HTMLProps } from 'react';
import styles from './MetadataEditor.module.scss';

const { setId, setName, setDescription } = metadataActions;

interface MetadataEditorProps extends HTMLProps<HTMLDivElement> {}

export const MetadataEditor: FC<MetadataEditorProps> = (props) => {
  const { className: passedClassName, ...htmlProps } = props;

  const id = useSelector((state) => state.metadata.id);
  const name = useSelector((state) => state.metadata.name);
  const description = useSelector((state) => state.metadata.description);

  const dispatch = useDispatch();

  const classNames = ['wrapper']
    .map((name) => styles[name as keyof typeof styles])
    .concat(passedClassName || '')
    .join(' ')
    .trim();

  return (
    <div {...htmlProps} className={classNames}>
      <div className={styles['title']}>Metadata</div>
      <TextInput
        id="id"
        label="ID"
        required
        maxLength={32}
        value={id}
        onChange={(e) => dispatch(setId(e.target.value))}
      />
      <TextInput
        id="name"
        label="Name"
        maxLength={32}
        value={name}
        onChange={(e) => dispatch(setName(e.target.value))}
      />
      <TextInput
        id="description"
        label="Description"
        maxLength={128}
        value={description}
        onChange={(e) => dispatch(setDescription(e.target.value))}
      />
      <IconInput />
    </div>
  );
};
