import { Menu, MenuItemConstructorOptions } from 'electron';
import contextMenu from 'electron-context-menu';
import { openZipFile, saveZipFile } from './files';
import { store } from './store';

export const menuTemplate: MenuItemConstructorOptions[] = [
  {
    label: '&File',
    submenu: [
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

          focusedWindow.webContents.ipc.once(
            'confirmation',
            (event, confirmed) => {
              if (!confirmed) {
                return;
              }
              openZipFile(focusedWindow);
            }
          );
          focusedWindow.webContents.send(
            'confirmation',
            'You have unsaved changes. ' +
              'Are you sure you want to open a new file?'
          );
        },
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: (menuItem, focusedWindow, event) => {
          if (!focusedWindow) {
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
  ]);
  Menu.setApplicationMenu(menu);

  contextMenu({
    showSearchWithGoogle: false,
    showSelectAll: false,
  });
};
