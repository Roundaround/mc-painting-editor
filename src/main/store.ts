import { configureStore, Middleware, PayloadAction } from '@reduxjs/toolkit';
import { BrowserWindow, ipcMain } from 'electron';
import {
  asSyncAction,
  cleanActionMeta,
  LOCAL_META,
  markLocalActions,
  PayloadActionWithMeta,
  reducers,
  SYNC_META,
} from '../common/store';

export function createStore(mainWindow: BrowserWindow) {
  const syncWithRenderer: Middleware =
    () =>
    (next) =>
    <T>(action: PayloadActionWithMeta<T>) => {
      if (action.meta !== SYNC_META && action.meta !== LOCAL_META) {
        mainWindow.webContents.send('reduxAction', asSyncAction(action));
      }

      next(cleanActionMeta(action));
    };

  const newStore = configureStore({
    reducer: { ...reducers },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(markLocalActions).concat(syncWithRenderer),
  });

  ipcMain.on(
    'reduxAction',
    (event, action: PayloadAction<unknown, string, any>) => {
      newStore.dispatch(action);
    }
  );

  return newStore;
}

export type MainStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<MainStore['getState']>;
export type Dispatch = MainStore['dispatch'];

export let store: MainStore;
