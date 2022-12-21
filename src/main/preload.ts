import { PayloadAction } from '@reduxjs/toolkit';
import { contextBridge, ipcRenderer } from 'electron';

const api = {
  openZipFile(): Promise<string> {
    return ipcRenderer.invoke('openZipFile');
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
} as const;

export type IpcApi = typeof api;

contextBridge.exposeInMainWorld('electron', api);
