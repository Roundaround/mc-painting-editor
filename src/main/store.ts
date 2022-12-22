import { configureStore, PayloadAction } from '@reduxjs/toolkit';
import { BrowserWindow, ipcMain } from 'electron';
import {
  paintingsAdapter,
  reducers,
  syncWithExternal,
  trackDirty,
} from '../common/store';

export function createStore(mainWindow: BrowserWindow) {
  const newStore = configureStore({
    reducer: { ...reducers },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(trackDirty)
        .concat(
          syncWithExternal((action) => {
            mainWindow.webContents.send('reduxAction', action);
          })
        ),
  });

  ipcMain.on(
    'reduxAction',
    (event, action: PayloadAction<unknown, string, any>) => {
      newStore.dispatch(action);
    }
  );

  newStore.subscribe(() => {
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
