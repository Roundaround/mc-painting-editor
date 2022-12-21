import { configureStore, Middleware } from '@reduxjs/toolkit';
import {
  asSyncAction,
  cleanActionMeta,
  LOCAL_META,
  markLocalActions,
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

window.electron.listenForReduxActions((action) => {
  store.dispatch(action);
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
