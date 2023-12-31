import { FC, HTMLProps } from 'react';

import { Checkbox } from '$renderer/components/input/Checkbox';
import { CompareSelect } from '$renderer/components/input/CompareSelect';
import { NumberInput } from '$renderer/components/input/NumberInput';
import { TextInput } from '$renderer/components/input/TextInput';
import { clsxm } from '$renderer/utils/clsxm';
import { useDispatch, useSelector } from '$renderer/utils/store';
import { filtersActions } from '$renderer/utils/store/filters';

import styles from './Filters.module.scss';

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

interface FiltersProps extends HTMLProps<HTMLDivElement> {}

export const Filters: FC<FiltersProps> = (props) => {
  const { className: passedClassName, ...htmlProps } = props;

  const search = useSelector((state) => state.filters.search);
  const missingImage = useSelector((state) => state.filters.missingImage);
  const missingId = useSelector((state) => state.filters.missingId);
  const widthOp = useSelector((state) => state.filters.width.operator);
  const widthVal = useSelector((state) => state.filters.width.value);
  const heightOp = useSelector((state) => state.filters.height.operator);
  const heightVal = useSelector((state) => state.filters.height.value);

  const dispatch = useDispatch();

  const classNames = ['wrapper']
    .map((name) => styles[name as keyof typeof styles])
    .concat(passedClassName || '')
    .join(' ')
    .trim();

  return (
    <div
      {...htmlProps}
      className={clsxm(
        classNames,
        'border-b border-b-neutral-600 bg-gray-600/10',
      )}
    >
      <div className={styles['row']}>
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
      <div className={styles['row']}>
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
      <div className={styles['row']}>
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
      <div className={styles['row']}>
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
