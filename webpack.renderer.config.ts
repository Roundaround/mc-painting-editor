import path from 'path';
import type { Configuration } from 'webpack';

import { plugins } from './webpack.plugins';
import { rules } from './webpack.rules';

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

rules.push({
  test: /\.s[ac]ss$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader' },
    { loader: 'sass-loader' },
  ],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, 'src/common'),
      '@': path.resolve(__dirname, 'src/renderer'),
    },
    extensions: [
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.css',
      '.scss',
      '.woff',
      '.woff2',
      '.ttf',
      '.eot',
      '.json',
    ],
  },
};
