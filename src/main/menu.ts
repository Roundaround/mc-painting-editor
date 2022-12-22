import { dialog, Menu, MenuItemConstructorOptions } from 'electron';
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

export const registerMenu = () => {
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
};
