import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Project root directory path.
const rootDir = process.cwd();

/**
 * Renderer process - Vite configuration
 */
export default defineConfig(({ mode }) => {
  // Force use mode (fixes HMR for vite plugins)
  process.env.NODE_ENV = mode;

  return {
    plugins: [react()],
    server: {
      hmr: true,
    },
    resolve: {
      alias: {
        $renderer: path.join(rootDir, 'src/renderer'),
        $common: path.join(rootDir, 'src/common'),
      },
    },
  };
});
