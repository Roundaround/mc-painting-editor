import { Menu, MenuItemConstructorOptions } from 'electron';
import contextMenu from 'electron-context-menu';

import { editorActions } from '$common/store/editor';
import { paintingsActions, paintingsSelectors } from '$common/store/paintings';
import { clearTempDir, openZipFile, saveZipFile } from '$main/files';
import { store } from '$main/store';
import { sendMessageAndListenForResponse } from '$main/utils';

type ConfirmationArgs = [string];
type ConfirmationResponse = [boolean];

export const menuTemplate: MenuItemConstructorOptions[] = [
  {
    label: '&File',
    submenu: [
      {
        label: 'New',
        accelerator: 'CmdOrCtrl+N',
        click: async (menuItem, focusedWindow, event) => {
          if (!focusedWindow) {
            return;
          }

          if (!store.getState().editor.dirty) {
            store.dispatch(editorActions.newFile());
            clearTempDir();
            return;
          }

          const [confirmed] = await sendMessageAndListenForResponse<
            ConfirmationArgs,
            ConfirmationResponse
          >(
            focusedWindow,
            'confirmation',
            'You have unsaved changes. Are you sure you want to start a new file?',
          );

          if (!confirmed) {
            return;
          }

          store.dispatch(editorActions.newFile());
          clearTempDir();
        },
      },
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click: async (menuItem, focusedWindow, event) => {
          if (!focusedWindow) {
            return;
          }

          if (!store.getState().editor.dirty) {
            openZipFile(focusedWindow);
            return;
          }

          const [confirmed] = await sendMessageAndListenForResponse<
            ConfirmationArgs,
            ConfirmationResponse
          >(
            focusedWindow,
            'confirmation',
            'You have unsaved changes. Are you sure you want to open another file?',
          );

          if (!confirmed) {
            return;
          }

          openZipFile(focusedWindow);
        },
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: (menuItem, focusedWindow, event) => {
          if (!focusedWindow) {
            return;
          }
          if (!store.getState().editor.dirty) {
            return;
          }
          saveZipFile(focusedWindow);
        },
      },
      {
        label: 'Save As',
        accelerator: 'CmdOrCtrl+Shift+S',
        click: (menuItem, focusedWindow, event) => {
          if (!focusedWindow) {
            return;
          }
          saveZipFile(focusedWindow, true);
        },
      },
      {
        label: 'Exit',
        click: (menuItem, focusedWindow, event) => {
          if (!focusedWindow) {
            return;
          }
          focusedWindow.close();
        },
      },
    ],
  },
  {
    label: '&Select',
    submenu: [
      {
        label: 'Deselect all',
        id: 'clear-selection',
        click: (menuItem, focusedWindow, event) => {
          if (!focusedWindow) {
            return;
          }
          store.dispatch(paintingsActions.clearSelection());
        },
      },
      {
        label: 'Remove selected',
        id: 'remove-selected',
        enabled: false,
        click: async (menuItem, focusedWindow, event) => {
          if (!focusedWindow) {
            return;
          }

          const selected = paintingsSelectors
            .selectAll(store.getState())
            .filter((p) => p.marked).length;

          if (!selected) {
            return;
          }

          const [confirmed] = await sendMessageAndListenForResponse<
            ConfirmationArgs,
            ConfirmationResponse
          >(
            focusedWindow,
            'confirmation',
            `Are you sure you want to remove ${selected} paintings?`,
          );

          if (!confirmed) {
            return;
          }

          store.dispatch(paintingsActions.removeSelected());
        },
      },
      {
        label: 'Create pack from selected',
        id: 'create-pack-from-selected',
        enabled: false,
        click: (menuItem, focusedWindow, event) => {
          if (!focusedWindow) {
            return;
          }

          const selected = paintingsSelectors
            .selectAll(store.getState())
            .filter((p) => p.marked).length;

          if (!selected) {
            return;
          }

          store.dispatch(editorActions.openSplitModal());
        },
      },
    ],
  },
];

const helpTemplate: MenuItemConstructorOptions[] = [
  {
    label: '&Help',
    submenu: [
      {
        label: 'About',
        accelerator: 'CmdOrCtrl+H',
        click: (menuItem, focusedWindow, event) => {
          if (!focusedWindow) {
            return;
          }

          store.dispatch(editorActions.openAboutModal());
        },
      },
    ],
  },
];

const developmentAdditions: MenuItemConstructorOptions[] = [
  {
    label: '&View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.reload();
          }
        },
      },
      {
        label: 'Force Reload',
        accelerator: 'CmdOrCtrl+Shift+R',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.webContents.reloadIgnoringCache();
          }
        },
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: (() => {
          if (process.platform === 'darwin') {
            return 'Alt+Command+I';
          } else {
            return 'Ctrl+Shift+I';
          }
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.webContents.toggleDevTools();
          }
        },
      },
      {
        label: 'Toggle Full Screen',
        accelerator: (() => {
          if (process.platform === 'darwin') {
            return 'Ctrl+Command+F';
          } else {
            return 'F11';
          }
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        },
      },
    ],
  },
];

export const registerMenu = () => {
  const menu = Menu.buildFromTemplate([
    ...menuTemplate,
    ...(process.env.NODE_ENV === 'development' ? developmentAdditions : []),
    ...helpTemplate,
  ]);
  Menu.setApplicationMenu(menu);

  contextMenu({
    showSearchWithGoogle: false,
    showSelectAll: false,
  });
};
