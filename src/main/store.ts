import { configureStore, Middleware, PayloadAction } from '@reduxjs/toolkit';
import { BrowserWindow, ipcMain } from 'electron';
import {
  asSyncAction,
  cleanActionMeta,
  LOCAL_META,
  markLocalActions,
  paintingsAdapter,
  PayloadActionWithMeta,
  reducers,
  SYNC_META,
  trackDirty,
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
      getDefaultMiddleware()
        .concat(trackDirty)
        .concat(markLocalActions)
        .concat(syncWithRenderer),
  });

  ipcMain.on(
    'reduxAction',
    (event, action: PayloadAction<unknown, string, any>) => {
      newStore.dispatch(action);
    }
  );

  newStore.subscribe(() => {
    console.log('Updating title from store');
    updateTitleFromStore(mainWindow, newStore);
  });

  store = newStore;
  return newStore;
}

export function updateTitleFromStore(
  mainWindow: BrowserWindow,
  store: MainStore
) {
  const state = store.getState();
  const filename = state.editor.filename || '(Untitled)';
  const prefix = state.editor.dirty ? '• ' : '';
  const title = `${prefix}${filename} - Custom Painting Editor`;
  console.log([
    state.editor.dirty,
    mainWindow.getTitle(),
    title,
  ]);
  if (mainWindow.getTitle() !== title) {
    mainWindow.setTitle(title);
  }
}

export const paintingsSelectors = paintingsAdapter.getSelectors(
  (state: RootState) => state.paintings
);

export type MainStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<MainStore['getState']>;
export type Dispatch = MainStore['dispatch'];

export let store: MainStore;
