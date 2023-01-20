import { reducers, syncWithExternal, trackDirty } from '@common/store';
import { configureStore, PayloadAction } from '@reduxjs/toolkit';
import { BrowserWindow, ipcMain } from 'electron';

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
  const title = `${prefix}${filename} - Custom Paintings Pack Editor`;
  if (mainWindow.getTitle() !== title) {
    mainWindow.setTitle(title);
  }
}

export type MainStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<MainStore['getState']>;
export type Dispatch = MainStore['dispatch'];

export let store: MainStore;
