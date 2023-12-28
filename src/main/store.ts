import { configureStore, PayloadAction } from '@reduxjs/toolkit';
import { app, BrowserWindow, ipcMain, Menu } from 'electron';

import { reducers, syncWithExternal, trackDirty } from '$common/store';
import { editorActions } from '$common/store/editor';
import { paintingsSelectors } from '$common/store/paintings';

export let store: MainStore;

function createStore(mainWindow: BrowserWindow) {
  return configureStore({
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
}

export function getOrCreateStore(mainWindow: BrowserWindow) {
  if (store) {
    return store;
  }

  store = createStore(mainWindow);

  ipcMain.on(
    'reduxAction',
    (event, action: PayloadAction<unknown, string, any>) => {
      store.dispatch(action);
    }
  );

  store.subscribe(() => {
    updateTitleFromStore(mainWindow);
    updateBatchActionsFromStore();
  });

  return store;
}

export function updateTitleFromStore(mainWindow: BrowserWindow) {
  const state = store.getState();
  const filename = state.editor.filename || '(Untitled)';
  const prefix = state.editor.dirty ? '• ' : '';
  const title = `${prefix}${filename} - Custom Paintings Pack Editor`;
  if (mainWindow.getTitle() !== title) {
    mainWindow.setTitle(title);
  }
}

export function updateBatchActionsFromStore() {
  const menuItems = [
    'clear-selection',
    'remove-selected',
    'create-pack-from-selected',
  ];

  const anySelected = paintingsSelectors
    .selectAll(store.getState())
    .some((p) => p.marked);

  menuItems.forEach((id) => {
    const menuItem = Menu.getApplicationMenu()?.getMenuItemById(id);
    if (!menuItem) {
      return;
    }
    menuItem.enabled = anySelected;
  });
}

export function updateAppInfoInStore() {
  store.dispatch(
    editorActions.setAppInfo({
      name: app.getName(),
      version: app.getVersion(),
    })
  );
}

export type MainStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<MainStore['getState']>;
export type Dispatch = MainStore['dispatch'];
