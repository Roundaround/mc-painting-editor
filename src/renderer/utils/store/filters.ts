import { Painting, paintingsSelectors } from '@common/store/paintings';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import fuzzysort from 'fuzzysort';
import { RootState } from '.';

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
    showMissingImage: (state) => {
      return {
        ...initialFiltersState,
        missingImage: true,
      };
    },
    showMissingId: (state) => {
      return {
        ...initialFiltersState,
        missingId: true,
      };
    },
  },
});

export const filtersReducer = filtersSlice.reducer;
export const filtersActions = filtersSlice.actions;

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

const selectMatchingPaintings = createSelector(
  [(state: RootState) => state.filters, paintingsSelectors.selectAll],
  (filters, paintings) => {
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
  }
);

// const selectMatchingPaintings = (
//   state: { filters: FiltersState },
//   paintings: Painting[]
// ) => {
//   const { search, missingImage, missingId, width, height } = state.filters;
//   return paintings
//     .filter((painting) => {
//       if (missingImage && painting.path) {
//         return false;
//       }
//       if (missingId && painting.id) {
//         return false;
//       }
//       if (!matchesSizeFilter(painting, width)) {
//         return false;
//       }
//       if (!matchesSizeFilter(painting, height)) {
//         return false;
//       }
//       if (
//         search &&
//         fuzzysort.go(search, [painting.id, painting.name, painting.artist], {
//           threshold: -10000,
//         }).length === 0
//       ) {
//         return false;
//       }
//       return true;
//     })
//     .map((painting) => painting.uuid);
// };

const selectHasFilters = createSelector(
  [(state: RootState) => state.filters],
  (filters) => {
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
  }
);

// const selectHasFilters = (state: { filters: FiltersState }) => {
//   const { search, missingImage, missingId, width, height } = state.filters;
//   return (
//     search !== '' ||
//     missingImage ||
//     missingId ||
//     width.operator !== 'gt' ||
//     width.value !== 0 ||
//     height.operator !== 'gt' ||
//     height.value !== 0
//   );
// };

export const filtersSelectors = {
  selectMatchingPaintings,
  selectHasFilters,
};
