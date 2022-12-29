import { createSlice } from '@reduxjs/toolkit';

interface SizeFilter<T extends 'width' | 'height'> {
  readonly dimension: T;
  operator: 'gt' | 'lt' | 'eq' | 'ne';
  value: number;
}

export interface FiltersState {
  search: string;
  missingImage: boolean;
  missingId: boolean;
  width: SizeFilter<'width'>;
  height: SizeFilter<'height'>;
}

const initialFiltersState: FiltersState = {
  search: '',
  missingImage: false,
  missingId: false,
  width: {
    dimension: 'width',
    operator: 'gt',
    value: 0,
  },
  height: {
    dimension: 'height',
    operator: 'gt',
    value: 0,
  },
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState: initialFiltersState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    clearSearch: (state) => {
      state.search = '';
    },
    setMissingImage: (state, action) => {
      state.missingImage = action.payload;
    },
    setMissingId: (state, action) => {
      state.missingId = action.payload;
    },
    setWidthOperator: (state, action) => {
      state.width.operator = action.payload;
    },
    setWidthValue: (state, action) => {
      state.width.value = action.payload;
    },
    resetWidth: (state) => {
      state.width = { ...initialFiltersState.width };
    },
    setHeightOperator: (state, action) => {
      state.height.operator = action.payload;
    },
    setHeightValue: (state, action) => {
      state.height.value = action.payload;
    },
    resetHeight: (state) => {
      state.height = { ...initialFiltersState.height };
    },
  },
});

export const { reducer: filtersReducer, actions: filtersActions } =
  filtersSlice;
