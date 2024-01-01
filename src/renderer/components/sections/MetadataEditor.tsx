import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC, HTMLProps } from 'react';

import { metadataActions } from '$common/store/metadata';
import { Tooltip, TooltipDirection } from '$renderer/components/Tooltip';
import { Button, ButtonVariant } from '$renderer/components/Button';
import { IconInput } from '$renderer/components/input/IconInput';
import { NumberInput } from '$renderer/components/input/NumberInput';
import { TextInput } from '$renderer/components/input/TextInput';
import { useDispatch, useSelector } from '$renderer/utils/store/root';

const { setId, setName, setDescription, setPackFormat, setTargetScale } =
  metadataActions;

interface MetadataEditorProps extends HTMLProps<HTMLDivElement> {}

export const MetadataEditor: FC<MetadataEditorProps> = (props) => {
  const { className: passedClassName, ...htmlProps } = props;

  const id = useSelector((state) => state.metadata.id);
  const name = useSelector((state) => state.metadata.name);
  const description = useSelector((state) => state.metadata.description);
  const packFormat = useSelector((state) => state.metadata.packFormat);
  const targetScale = useSelector((state) => state.metadata.targetScale);

  const dispatch = useDispatch();

  const fieldClasses = 'flex flex-row items-end justify-between gap-4';

  return (
    <div {...htmlProps} className="flex flex-col gap-4 overflow-y-auto p-2">
      <div className="text-xl">Metadata</div>
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
      <div className={fieldClasses}>
        <NumberInput
          id="pack-format"
          label="Pack Format"
          min={1}
          max={999}
          value={packFormat}
          onChange={(e) => dispatch(setPackFormat(e.target.valueAsNumber))}
        />
        <Tooltip
          content={
            `Minecraft's official 'pack_format' value for the resource pack. ` +
            `Click to learn more.`
          }
          direction={TooltipDirection.RIGHT}
          directTabbable={false}
        >
          <a
            className="flex-fixed m-0 inline-flex aspect-square w-8 items-center justify-center rounded-full bg-blue-600 p-0 text-gray-100"
            href="https://minecraft.fandom.com/wiki/Pack_format#Resources"
            target="_blank"
          >
            <FontAwesomeIcon icon="question" className="w-full" />
          </a>
        </Tooltip>
      </div>
      <div className={fieldClasses}>
        <NumberInput
          id="target-scale"
          label="Target Scale"
          min={1}
          max={10}
          value={targetScale}
          onChange={(e) => dispatch(setTargetScale(e.target.valueAsNumber))}
        />
        <Button
          variant={ButtonVariant.ICON}
          tooltip={{
            content:
              `Doesn't directly affect anything, but is used to ` +
              `calculate the  preferred image size for each painting based ` +
              `on the block dimensions. "1" means 16x16 pixels per block, ` +
              `"2" means 32x32, etc.`,
            direction: TooltipDirection.RIGHT,
          }}
        >
          <FontAwesomeIcon icon="question" />
        </Button>
      </div>
      <IconInput />
    </div>
  );
};

export default MetadataEditor;
