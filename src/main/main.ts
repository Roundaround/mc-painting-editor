import {
  BrowserWindow,
  app,
  dialog,
  ipcMain,
  net,
  protocol,
  shell,
} from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer';
import fs from 'fs';
import path from 'path';
import url from 'url';

import {
  appTempDir,
  openIconFile,
  openPaintingFile,
  saveSplitZipFile,
} from '$main/files';
import { registerMenu } from '$main/menu';
import {
  getOrCreateStore,
  store,
  updateAppInfoInStore,
  updateTitleFromStore,
} from '$main/store';

let mainWindow: BrowserWindow | null = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Auto update
if (process.env.NODE_ENV !== 'development') {
  const { updateElectronApp } = require('update-electron-app');
  updateElectronApp();
}

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1400,
    icon: 'icons/icon.png',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

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
  // Register custom protocol for fetching files from the app's temp directory.
  protocol.handle('mc-painting-editor', (req) => {
    return net.fetch(
      url.fileURLToPath(
        'file://' + req.url.slice('mc-painting-editor://'.length)
      )
    );
  });

  registerMenu();

  if (process.env.NODE_ENV === 'development') {
    // For some reason React devtools is not playing nicely with Electron.
    // Current workaround is to install it twice.
    // https://github.com/electron/electron/issues/36545
    installExtension(REACT_DEVELOPER_TOOLS);
    installExtension(REACT_DEVELOPER_TOOLS);

    // Also install Redux devtools.
    installExtension(REDUX_DEVTOOLS);
  }

  createWindow();
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
      fs.rmSync(path.join(appTempDir, file), { recursive: true });
    }
  } catch (e) {
    // Directory either doesn't exist or no longer writable.
    // Either way, do nothing.
  }
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
