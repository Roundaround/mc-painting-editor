import { FC, HTMLProps } from 'react';
import { metadataSlice } from '../../../common/store';
import { useDispatch, useSelector } from '../../utils/store';
import { IconInput } from '../IconInput';
import { TextInput } from '../TextInput';
import styles from './MetadataEditor.module.scss';

const { setId, setName, setDescription } = metadataSlice.actions;

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
      <TextInput
        id="id"
        label="ID"
        value={id}
        onChange={(e) => dispatch(setId(e.target.value))}
      />
      <TextInput
        id="name"
        label="Name"
        value={name}
        onChange={(e) => dispatch(setName(e.target.value))}
      />
      <TextInput
        id="description"
        label="Description"
        value={description}
        onChange={(e) => dispatch(setDescription(e.target.value))}
      />
      <IconInput />
    </div>
  );
};
