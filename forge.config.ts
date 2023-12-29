import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { PublisherGithub } from '@electron-forge/publisher-github';
import type { ForgeConfig } from '@electron-forge/shared-types';
import path from 'node:path';
import process from 'node:process';

import VitePlugin from '@electron-forge/plugin-vite';

const rootDir = process.cwd();

const config: ForgeConfig = {
  packagerConfig: {
    name: 'Custom Paintings Pack Editor',
    executableName: 'custom-paintings-pack-editor',
    icon: path.join(rootDir, 'icons/icon'),
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      title: 'Custom Paintings Pack Editor',
      iconUrl:
        'https://raw.githubusercontent.com/Roundaround/mc-painting-editor/main/icons/icon.ico',
      setupIcon: path.join(rootDir, 'icons/icon.ico'),
    }),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({
      options: {
        icon: path.join(rootDir, 'icons/icon.png'),
      },
    }),
    new MakerDeb({
      options: {
        icon: path.join(rootDir, 'icons/icon.png'),
      },
    }),
    new MakerDMG({
      icon: path.join(rootDir, 'icons/icon.icns'),
    }),
  ],
  publishers: [
    new PublisherGithub({
      repository: {
        owner: 'roundaround',
        name: 'mc-painting-editor',
      },
      draft: true,
      prerelease: true,
    }),
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process,
      // Preload scripts, Worker process, etc. If you are familiar with Vite
      // configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding
          // file of `config`.
          entry: path.join(rootDir, 'src/main/main.ts'),
          config: path.join(rootDir, 'vite/vite.main.config.ts'),
        },
        {
          entry: path.join(rootDir, 'src/main/preload.ts'),
          config: path.join(rootDir, 'vite/vite.preload.config.ts'),
        },
        {
          entry: [
            path.join(rootDir, 'src/worker/read-zip.ts'),
            path.join(rootDir, 'src/worker/clear-tmp.ts'),
          ],
          config: path.join(rootDir, 'vite/vite.workers.config.ts'),
        },
      ],
      renderer: [
        {
          // Name becomes available in main/main.ts in capital case format:
          // 'MAIN_WINDOW_**'
          name: 'main_window',
          config: path.join(rootDir, 'vite/vite.renderer.config.ts'),
        },
      ],
    }),
  ],
};

export default config;
