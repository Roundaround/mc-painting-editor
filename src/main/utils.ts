import { customAlphabet } from 'nanoid/non-secure';

export const nanoid = customAlphabet('1234567890abcdef', 10);

export function sendMessageAndListenForResponse<
  Targs extends any[],
  Tresponse extends any[],
>(focusedWindow: Electron.BrowserWindow, topic: string, ...args: Targs) {
  if (!focusedWindow) {
    return Promise.reject('No focused window');
  }

  return new Promise<Tresponse>((resolve, _) => {
    const reqId = nanoid(10);

    focusedWindow.webContents.ipc.once(
      `${topic}-${reqId}`,
      (mainEvent, ...response) => {
        resolve(response as Tresponse);
      },
    );

    focusedWindow.webContents.send(topic, reqId, ...args);
  });
}
