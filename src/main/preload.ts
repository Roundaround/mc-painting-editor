import { contextBridge, ipcRenderer } from 'electron';

const api = {
  requestAndReadZipFile(): Promise<string> {
    return ipcRenderer.invoke('requestAndReadZipFile');
  },
  onSet: {
    icon: (callback: (icon: string) => void) => {
      ipcRenderer.on('setIcon', (event, icon) => callback(icon));
      return () => ipcRenderer.off('setIcon', callback);
    },
    id: (callback: (id: string) => void) => {
      ipcRenderer.on('setId', (event, id) => callback(id));
      return () => ipcRenderer.off('setId', callback);
    },
    name: (callback: (name: string) => void) => {
      ipcRenderer.on('setName', (event, name) => callback(name));
      return () => ipcRenderer.off('setName', callback);
    },
  },
} as const;

export type IpcApi = typeof api;

contextBridge.exposeInMainWorld('electron', api);
