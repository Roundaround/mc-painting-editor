import { Menu, MenuItemConstructorOptions } from 'electron';
import { openZipFile } from './files';

export const menuTemplate: MenuItemConstructorOptions[] = [
  {
    label: 'File',
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
    ],
  },
];

export const registerMenu = () => {
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
};
