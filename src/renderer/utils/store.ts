import { configureStore, Middleware } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase,
} from 'react-redux';
import {
  asSyncAction,
  cleanActionMeta,
  LOCAL_META,
  markLocalActions,
  paintingsAdapter,
  PayloadActionWithMeta,
  reducers,
  SYNC_META,
} from '../../common/store';

const syncWithMain: Middleware =
  () =>
  (next) =>
  <T>(action: PayloadActionWithMeta<T>) => {
    if (action.meta !== SYNC_META && action.meta !== LOCAL_META) {
      window.electron.sendReduxAction(asSyncAction(action));
    }

    next(cleanActionMeta(action));
  };

export const store = configureStore({
  reducer: { ...reducers },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(markLocalActions).concat(syncWithMain),
});

console.log('Store created');
window.electron.listenForReduxActions((action) => {
  console.log('Received action from main', action);
  store.dispatch(action);
});

export const paintingsSelectors = paintingsAdapter.getSelectors(
  (state: RootState) => state.paintings
);

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;

export const useDispatch = useDispatchBase as () => Dispatch;
export const useSelector = useSelectorBase as TypedUseSelectorHook<RootState>;
