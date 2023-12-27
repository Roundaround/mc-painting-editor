import { IconInput } from '$renderer/components/input/IconInput';
import { NumberInput } from '$renderer/components/input/NumberInput';
import { TextInput } from '$renderer/components/input/TextInput';
import { Tooltip, TooltipDirection } from '$renderer/components/Tooltip';
import { useDispatch, useSelector } from '$renderer/utils/store';
import { metadataActions } from '$common/store/metadata';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, HTMLProps } from 'react';
import styles from './MetadataEditor.module.scss';

const { setId, setName, setDescription, setPackFormat } = metadataActions;

interface MetadataEditorProps extends HTMLProps<HTMLDivElement> {}

export const MetadataEditor: FC<MetadataEditorProps> = (props) => {
  const { className: passedClassName, ...htmlProps } = props;

  const id = useSelector((state) => state.metadata.id);
  const name = useSelector((state) => state.metadata.name);
  const description = useSelector((state) => state.metadata.description);
  const packFormat = useSelector((state) => state.metadata.packFormat);

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
      <div className={styles['pack-format']}>
        <NumberInput
          id="pack-format"
          label="Pack Format"
          min={1}
          max={999}
          value={packFormat}
          onChange={(e) => dispatch(setPackFormat(e.target.valueAsNumber))}
        />
        <a
          className={styles['pack-format-help']}
          href="https://minecraft.gamepedia.com/Resource_pack#Pack_format"
          target="_blank"
        >
          <FontAwesomeIcon icon="question" />
        </a>
      </div>
      <IconInput />
    </div>
  );
};
