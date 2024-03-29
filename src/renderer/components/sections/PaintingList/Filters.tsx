import { FC, HTMLAttributes } from 'react';

import { Checkbox } from '$renderer/components/input/Checkbox';
import { CompareSelect } from '$renderer/components/input/CompareSelect';
import { NumberInput } from '$renderer/components/input/NumberInput';
import { TextInput } from '$renderer/components/input/TextInput';
import { clsxm } from '$renderer/utils/clsxm';
import { filtersActions } from '$renderer/utils/store/filters';
import { useDispatch, useSelector } from '$renderer/utils/store/root';

const {
  setSearch,
  clearSearch,
  setMissingImage,
  setMissingId,
  setWidthOperator,
  setWidthValue,
  setHeightOperator,
  setHeightValue,
} = filtersActions;

type FiltersProps = HTMLAttributes<HTMLDivElement>;

export const Filters: FC<FiltersProps> = ({ className, ...props }) => {
  const search = useSelector((state) => state.filters.search);
  const missingImage = useSelector((state) => state.filters.missingImage);
  const missingId = useSelector((state) => state.filters.missingId);
  const widthOp = useSelector((state) => state.filters.width.operator);
  const widthVal = useSelector((state) => state.filters.width.value);
  const heightOp = useSelector((state) => state.filters.height.operator);
  const heightVal = useSelector((state) => state.filters.height.value);

  const dispatch = useDispatch();

  const rowClasses = 'flex flex-row items-center justify-start gap-4';

  return (
    <div
      {...props}
      className={clsxm(
        'flex flex-col items-stretch gap-5 border-b border-b-neutral-600 bg-gray-600/10 px-2 py-4',
        className,
      )}
    >
      <div className={rowClasses}>
        <TextInput
          id="search"
          label="Search"
          value={search}
          onChange={(event) => {
            dispatch(setSearch(event.currentTarget.value));
          }}
          onClear={() => {
            dispatch(clearSearch());
          }}
        />
      </div>
      <div className={rowClasses}>
        <Checkbox
          id="missing-image"
          label="Missing an image"
          inline={true}
          checked={missingImage}
          onChange={(e) => {
            dispatch(setMissingImage(e.currentTarget.checked));
          }}
        />
        <Checkbox
          id="missing-id"
          label="Missing an ID"
          inline={true}
          checked={missingId}
          onChange={(e) => {
            dispatch(setMissingId(e.currentTarget.checked));
          }}
        />
      </div>
      <div className={rowClasses}>
        <NumberInput
          id="width"
          label={
            <CompareSelect
              id="width-op"
              label="Width"
              value={widthOp}
              onChange={(value) => {
                dispatch(setWidthOperator(value));
              }}
            />
          }
          min={0}
          max={10000}
          step={1}
          value={widthVal}
          onChange={(event) => {
            dispatch(setWidthValue(event.currentTarget.value));
          }}
        />
      </div>
      <div className={rowClasses}>
        <NumberInput
          id="height"
          label={
            <CompareSelect
              id="height-op"
              label="Height"
              value={heightOp}
              onChange={(value) => {
                dispatch(setHeightOperator(value));
              }}
            />
          }
          min={0}
          max={10000}
          step={1}
          value={heightVal}
          onChange={(event) => {
            dispatch(setHeightValue(event.currentTarget.value));
          }}
        />
      </div>
    </div>
  );
};

export default Filters;
