import { Menu, MenuItemConstructorOptions } from 'electron';
import { openZipFile, saveZipFile } from './files';

export const menuTemplate: MenuItemConstructorOptions[] = [
  {
    label: '&File',
    submenu: [
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click: (menuItem, focusedWindow, event) => {
          if (!focusedWindow) {
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
