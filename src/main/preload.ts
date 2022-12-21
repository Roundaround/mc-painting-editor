import { PayloadAction } from '@reduxjs/toolkit';
import { contextBridge, ipcRenderer } from 'electron';
import { Painting } from './schemas';

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
  onSet: {
    icon: (callback: (icon: string) => void) => {
      ipcRenderer.on('setIcon', (event, icon) => callback(icon));
      return () => ipcRenderer.off('setIcon', callback);
    },
    packFormat: (callback: (packFormat: number) => void) => {
      ipcRenderer.on('setPackFormat', (event, packFormat) =>
        callback(packFormat)
      );
      return () => ipcRenderer.off('setPackFormat', callback);
    },
    description: (callback: (description: string) => void) => {
      ipcRenderer.on('setDescription', (event, description) =>
        callback(description)
      );
      return () => ipcRenderer.off('setDescription', callback);
    },
    id: (callback: (id: string) => void) => {
      ipcRenderer.on('setId', (event, id) => callback(id));
      return () => ipcRenderer.off('setId', callback);
    },
    name: (callback: (name: string) => void) => {
      ipcRenderer.on('setName', (event, name) => callback(name));
      return () => ipcRenderer.off('setName', callback);
    },
    paintings: (callback: (paintings: Map<string, Painting>) => void) => {
      ipcRenderer.on('setPaintings', (event, paintings) => callback(paintings));
      return () => ipcRenderer.off('setPaintings', callback);
    },
    paintingPath: (callback: (id: string, paintingPath: string) => void) => {
      ipcRenderer.on('setPaintingPath', (event, id, paintingPath) =>
        callback(id, paintingPath)
      );
      return () => {
        ipcRenderer.off('setPaintingPath', callback);
      };
    },
    loading: (callback: (loading: boolean) => void) => {
      ipcRenderer.on('setLoading', (event, loading) => callback(loading));
      return () => ipcRenderer.off('setLoading', callback);
    },
    filename: (callback: (filename: string) => void) => {
      ipcRenderer.on('setFilename', (event, filename) => callback(filename));
      return () => ipcRenderer.off('setFilename', callback);
    },
  },
  sendValue: <T>(key: string, value: T) => {
    ipcRenderer.send('setValue', key, value);
  },
  listenForValue: <T>(key: string, callback: (value: T) => void) => {
    ipcRenderer.on('setValue', (event, _key, value) => {
      if (_key === key) callback(value);
    });
    return () => {
      ipcRenderer.off('setValue', callback);
    };
  },
} as const;

export type IpcApi = typeof api;

contextBridge.exposeInMainWorld('electron', api);
