import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase,
} from 'react-redux';
import {
  paintingsAdapter,
  reducers,
  syncWithExternal,
  trackDirty,
} from '../../common/store';
import { filtersReducer } from './filtersSlice';

export const store = configureStore({
  reducer: {
    ...reducers,
    filters: filtersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(trackDirty)
      .concat(
        syncWithExternal((action) => {
          window.electron.sendReduxAction(action);
        })
      ),
});

window.electron.listenForReduxActions((action) => {
  store.dispatch(action);
});

export const paintingsSelectors = paintingsAdapter.getSelectors(
  (state: RootState) => state.paintings
);

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;

export const useDispatch = useDispatchBase as () => Dispatch;
export const useSelector = useSelectorBase as TypedUseSelectorHook<RootState>;
