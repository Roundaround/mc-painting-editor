import path from 'path';
import { defineConfig } from 'vite';

// Project root directory path.
const rootDir = process.cwd();

/**
 * Worker process for reading zip files - Vite configuration
 */
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        'worker/read-zip': path.join(rootDir, 'src/worker/read-zip.ts'),
      },
    },
  },
  resolve: {
    alias: {
      $common: path.join(rootDir, 'src/common'),
    },
  },
});
