import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase,
} from 'react-redux';

import { reducers, syncWithExternal, trackDirty } from '$common/store/root';
import { filtersReducer } from '$renderer/utils/store/filters';

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

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;

export const useDispatch = useDispatchBase as () => Dispatch;
export const useSelector = useSelectorBase as TypedUseSelectorHook<RootState>;
