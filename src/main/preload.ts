import { contextBridge, ipcRenderer } from 'electron';
import { Painting } from './schemas';

const api = {
  requestAndReadZipFile(): Promise<string> {
    return ipcRenderer.invoke('requestAndReadZipFile');
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
  },
} as const;

export type IpcApi = typeof api;

contextBridge.exposeInMainWorld('electron', api);
