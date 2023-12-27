import { defineConfig } from 'vite';
import path from 'path';

// Project root directory path.
const rootDir = process.cwd();

/**
 * Main process - Vite configuration
 */
export default defineConfig({
  build: {
    rollupOptions: {
      // Provide native modules as externals eg: ['serialport', 'sqlite3']
      external: [],
    },
  },
  resolve: {
    alias: {
      $src: path.join(rootDir, 'src'),
      $main: path.join(rootDir, 'src/main'),
      $common: path.join(rootDir, 'src/common'),
    },
  },
});
