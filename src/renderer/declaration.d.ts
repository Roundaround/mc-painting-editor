import { IpcApi } from '../main/preload';

declare global {
  interface Window {
    electron: IpcApi;
  }

  declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
  }

  declare module '*.svg' {
    const content: () => JSX.Element;
    export default content;
  }
}

export {};
