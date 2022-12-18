import { IpcApi } from '../main/preload';

declare global {
  interface Window {
    electron: IpcApi;
  }
}

export { };

