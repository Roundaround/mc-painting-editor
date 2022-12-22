import { PayloadAction } from '@reduxjs/toolkit';
import { contextBridge, ipcRenderer } from 'electron';

const api = {
  openZipFile(): Promise<string> {
    return ipcRenderer.invoke('openZipFile');
  },
  openIconFile(): Promise<void> {
    return ipcRenderer.invoke('openIconFile');
  },
  openPaintingFile(paintingId: string): Promise<void> {
    return ipcRenderer.invoke('openPaintingFile', paintingId);
  },
  sendReduxAction<T>(action: PayloadAction<T, string, any>) {
    ipcRenderer.send('reduxAction', action);
  },
  listenForReduxActions(
    callback: (action: PayloadAction<unknown, string, any>) => void
  ) {
    ipcRenderer.on(
      'reduxAction',
      (event, action: PayloadAction<unknown, string, any>) => {
        callback(action);
      }
    );
  },
  listenForRequestConfirmation() {
    ipcRenderer.on('confirmation', async (event, message: string) => {
      ipcRenderer.send('confirmation', confirm(message));
    });
  },
} as const;

export type IpcApi = typeof api;

contextBridge.exposeInMainWorld('electron', api);
