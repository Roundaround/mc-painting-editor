import path from 'path';
import type { Configuration } from 'webpack';

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { rules } from './webpack.rules';

const isDevelopment = process.env.NODE_ENV === 'development';

export const rendererConfig: Configuration = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: isDevelopment
              ? 'style-loader'
              : MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: isDevelopment,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      ...rules,
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      logger: 'webpack-infrastructure',
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[fullhash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].[fullhash].css',
    }),
  ],
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
