import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { MakerZIP } from '@electron-forge/maker-zip';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { PublisherGithub } from '@electron-forge/publisher-github';
import type { ForgeConfig } from '@electron-forge/shared-types';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

require('dotenv').config();

const config: ForgeConfig = {
  packagerConfig: {
    name: 'Custom Paintings Pack Editor',
    icon: 'icons/icon',
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      title: 'Custom Paintings Pack Editor',
      iconUrl:
        'https://raw.githubusercontent.com/Roundaround/mc-painting-editor/main/icons/icon.ico',
      setupIcon: 'icons/icon.ico',
    }),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({
      options: {
        icon: 'icons/icon.png',
      },
    }),
    new MakerDeb({
      options: {
        icon: 'icons/icon.png',
      },
    }),
    new MakerDMG({
      icon: 'icons/icon.icns',
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
    new WebpackPlugin({
      mainConfig,
      devContentSecurityPolicy: `default-src mc-painting-editor: 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:`,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            name: 'main_window',
            html: './src/renderer/index.html',
            js: './src/renderer/index.tsx',
            preload: {
              js: './src/main/preload.ts',
            },
          },
        ],
      },
    }),
  ],
};

export default config;
