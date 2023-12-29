import fs from 'fs';
import path from 'path';

import type { C2PMessage } from '$common/worker/clear-tmp';
import type { BasePayloadAction } from '$common/worker/common';

function main() {
  const appTempDir = process.argv[2];

  if (!appTempDir) {
    postMessage({
      type: 'error',
      content: 'Missing app temp dir argument!',
    });
    return;
  }

  try {
    const files = fs.readdirSync(appTempDir);
    for (const file of files) {
      fs.rmSync(path.join(appTempDir, file), { recursive: true });
    }
  } catch (e) {
    // Directory either doesn't exist or no longer writable. Report the error
    // and just exit.
    console.error(e);

    const error =
      e instanceof Error ? e : new Error('An unknown error occurred');

    postMessage({
      type: 'error',
      content: error,
    });
  }

  postMessage({
    type: 'done',
  });
}

function postMessage(message: C2PMessage) {
  process.parentPort.postMessage(message);
}

function postActionMessage(action: BasePayloadAction) {
  postMessage({
    type: 'action',
    action,
  });
}

try {
  main();
} catch (e) {
  // TODO: Show error to user.
  console.error(e);

  const error = e instanceof Error ? e : new Error('An unknown error occurred');

  postMessage({
    type: 'error',
    content: error,
  });
}
