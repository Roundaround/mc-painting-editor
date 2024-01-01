import { FC, HTMLAttributes, useEffect } from 'react';

import { editorActions } from '$common/store/editor';
import { Button } from '$renderer/components/Button';
import { TextInput } from '$renderer/components/input/TextInput';
import { clsxm } from '$renderer/utils/clsxm';
import { useDispatch, useSelector } from '$renderer/utils/store/root';

const { setSplitId, setSplitName, clearOverlay } = editorActions;

type SplitModalProps = HTMLAttributes<HTMLDivElement>;

export const SplitModal: FC<SplitModalProps> = ({ className, ...props }) => {
  const splitId = useSelector((state) => state.editor.split.id);
  const splitName = useSelector((state) => state.editor.split.name);

  const dispatch = useDispatch();

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dispatch(clearOverlay());
      } else if (event.key === 'Enter') {
        window.electron.splitSelected();
      }
    };

    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [dispatch]);

  return (
    <div
      className={clsxm(
        'bg-app flex w-2/5 min-w-[30ch] max-w-[60ch] flex-col items-stretch justify-center gap-4 rounded-md p-5 shadow-2xl',
        className,
      )}
      {...props}
    >
      <TextInput
        id="splitting-id"
        label="ID"
        required
        maxLength={32}
        value={splitId}
        onChange={(e) => {
          dispatch(setSplitId(e.target.value));
        }}
      />
      <TextInput
        id="splitting-name"
        label="Name"
        maxLength={32}
        value={splitName}
        onChange={(e) => {
          dispatch(setSplitName(e.target.value));
        }}
      />
      <div className="flex-fixed flex flex-row gap-4 *:flex-1">
        <Button
          onClick={() => {
            dispatch(clearOverlay());
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            window.electron.splitSelected();
          }}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default SplitModal;
