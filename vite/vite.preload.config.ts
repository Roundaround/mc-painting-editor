import { defineConfig } from 'vite';
import path from 'path';

// Project root directory path.
const rootDir = process.cwd();

/**
 * Preload process - Vite configuration
 */
export default defineConfig({
  resolve: {
    alias: {
      $main: path.join(rootDir, 'src/main'),
      $common: path.join(rootDir, 'src/common'),
    },
  },
});
