import { FC, HTMLProps } from 'react';
import { filtersActions } from '../../utils/filtersSlice';
import { useDispatch, useSelector } from '../../utils/store';
import { TextInput } from '../TextInput';
import styles from './Filters.module.scss';

const { setSearch, clearSearch, setMissingImage, setMissingId } =
  filtersActions;

interface FiltersProps extends HTMLProps<HTMLDivElement> {}

export const Filters: FC<FiltersProps> = (props) => {
  const { className: passedClassName, ...htmlProps } = props;

  const search = useSelector((state) => state.filters.search);
  const missingImage = useSelector((state) => state.filters.missingImage);
  const missingId = useSelector((state) => state.filters.missingId);

  const dispatch = useDispatch();

  const classNames = ['wrapper']
    .map((name) => styles[name as keyof typeof styles])
    .concat(passedClassName || '')
    .join(' ')
    .trim();

  return (
    <div {...htmlProps} className={classNames}>
      <div>
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
      <div>
        <div>
          <label htmlFor="missing-image">Missing an image</label>
          <input
            type="checkbox"
            id="missing-image"
            checked={missingImage}
            onChange={(e) => {
              dispatch(setMissingImage(e.currentTarget.checked));
            }}
          />
        </div>
        <div>
          <label htmlFor="missing-id">Missing an id</label>
          <input
            type="checkbox"
            id="missing-id"
            checked={missingId}
            onChange={(e) => {
              dispatch(setMissingId(e.currentTarget.checked));
            }}
          />
        </div>
      </div>
    </div>
  );
};
