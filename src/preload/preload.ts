import { EntityId, PayloadAction } from '@reduxjs/toolkit';
import { contextBridge, ipcRenderer } from 'electron';

const api = {
  openIconFile(): Promise<void> {
    return ipcRenderer.invoke('openIconFile');
  },
  openPaintingFile(paintingId: EntityId): Promise<void> {
    return ipcRenderer.invoke('openPaintingFile', paintingId);
  },
  splitSelected(): Promise<void> {
    return ipcRenderer.invoke('splitSelected');
  },
  requestAppInfo(): Promise<void> {
    return ipcRenderer.invoke('requestAppInfo');
  },
  sendReduxAction<T>(action: PayloadAction<T, string, any>) {
    ipcRenderer.send('reduxAction', action);
  },
  listenForReduxActions(
    callback: (action: PayloadAction<unknown, string, any>) => void,
  ) {
    ipcRenderer.on(
      'reduxAction',
      (event, action: PayloadAction<unknown, string, any>) => {
        callback(action);
      },
    );
  },
  listenForRequestConfirmation() {
    ipcRenderer.on(
      'confirmation',
      async (event, reqId: string, message: string) => {
        ipcRenderer.send(`confirmation-${reqId}`, confirm(message));
      },
    );
  },
} as const;

export type IpcApi = typeof api;

contextBridge.exposeInMainWorld('electron', api);
