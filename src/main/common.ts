import { BrowserWindow } from 'electron';

export interface AppContext {
  mainWindow: BrowserWindow | null;
  tempDir: string;
}
