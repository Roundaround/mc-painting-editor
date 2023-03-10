import { app, BrowserWindow, dialog, ipcMain, protocol, shell } from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from 'electron-devtools-installer';
import fs from 'fs';
import url from 'url';
import {
  appTempDir,
  openIconFile,
  openPaintingFile,
  openZipFile,
  saveSplitZipFile
} from './files';
import { registerMenu } from './menu';
import {
  getOrCreateStore,
  store,
  updateAppInfoInStore,
  updateTitleFromStore
} from './store';

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let mainWindow: BrowserWindow | null = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Auto update
require('update-electron-app')();

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1400,
    icon: 'icons/icon.png',
    show: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      spellcheck: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.once('ready-to-show', () => {
    if (mainWindow) {
      updateTitleFromStore(mainWindow);
      updateAppInfoInStore();
      mainWindow.show();

      if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
      }
    }
  });

  mainWindow.on('close', (e) => {
    if (!mainWindow) {
      return;
    }

    if (!store.getState().editor.dirty) {
      return;
    }

    const choice = dialog.showMessageBoxSync(mainWindow, {
      type: 'question',
      buttons: ['Yes', 'No'],
      title: 'Confirm',
      message: 'You have unsaved changes. Are you sure you want to quit?',
    });
    if (choice === 1) {
      e.preventDefault();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // open url in a browser and prevent default
    shell.openExternal(url);
    return { action: 'deny' };
  });

  getOrCreateStore(mainWindow);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  protocol.registerFileProtocol('mc-painting-editor', (request, callback) => {
    callback(
      url.fileURLToPath(
        'file://' + request.url.slice('mc-painting-editor://'.length)
      )
    );
  });

  registerMenu();
  createWindow();

  installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  try {
    const files = fs.readdirSync(appTempDir);
    for (const file of files) {
      fs.rmSync(appTempDir, { recursive: true });
    }
  } catch (e) {
    // Directory either doesn't exist or no longer writable.
    // Either way, do nothing.
  }
});

ipcMain.handle('openZipFile', (event, args) => {
  if (!mainWindow) {
    return '';
  }

  return openZipFile(mainWindow);
});

ipcMain.handle('openIconFile', (event, args) => {
  if (!mainWindow) {
    return '';
  }

  return openIconFile(mainWindow);
});

ipcMain.handle('openPaintingFile', (event, paintingId) => {
  if (!mainWindow) {
    return '';
  }

  return openPaintingFile(mainWindow, paintingId);
});

ipcMain.handle('splitSelected', (event) => {
  if (!mainWindow) {
    return '';
  }

  saveSplitZipFile(mainWindow);
});

ipcMain.handle('requestAppInfo', (event) => {
  if (!mainWindow) {
    return '';
  }

  return updateAppInfoInStore();
});
