import { Painting } from '@common/store';
import { createSlice } from '@reduxjs/toolkit';
import fuzzysort from 'fuzzysort';

export interface SizeFilter<T extends 'width' | 'height'> {
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
    resetAll: () => initialFiltersState,
  },
});

export const { reducer: filtersReducer, actions: filtersActions } =
  filtersSlice;

function matchesSizeFilter<T extends 'width' | 'height'>(
  painting: Painting,
  filter: SizeFilter<T>
): boolean {
  const { operator, value } = filter;

  if (operator === 'eq' && painting[filter.dimension] !== value) {
    return false;
  }
  if (operator === 'ne' && painting[filter.dimension] === value) {
    return false;
  }
  if (operator === 'gt' && painting[filter.dimension] <= value) {
    return false;
  }
  if (operator === 'lt' && painting[filter.dimension] >= value) {
    return false;
  }

  return true;
}

export const selectMatchingPaintings =
  (paintings: Painting[]) => (filters: FiltersState) => {
    const { search, missingImage, missingId, width, height } = filters;
    return paintings
      .filter((painting) => {
        if (missingImage && painting.path) {
          return false;
        }
        if (missingId && painting.id) {
          return false;
        }
        if (!matchesSizeFilter(painting, width)) {
          return false;
        }
        if (!matchesSizeFilter(painting, height)) {
          return false;
        }
        if (
          search &&
          fuzzysort.go(search, [painting.id, painting.name, painting.artist], {
            threshold: -10000,
          }).length === 0
        ) {
          return false;
        }
        return true;
      })
      .map((painting) => painting.uuid);
  };

export const selectHasFilters = (filters: FiltersState) => {
  const { search, missingImage, missingId, width, height } = filters;
  return (
    search !== '' ||
    missingImage ||
    missingId ||
    width.operator !== 'gt' ||
    width.value !== 0 ||
    height.operator !== 'gt' ||
    height.value !== 0
  );
};
