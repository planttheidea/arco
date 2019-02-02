'use strict';

const path = require('path');
const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  devtool: '#source-map',

  entry: [path.resolve(__dirname, 'src', 'index.js')],

  externals: ['immutable'],

  mode: 'development',

  module: {
    rules: [
      {
        enforce: 'pre',
        include: [/src/],
        loader: 'eslint-loader',
        options: {
          configFile: '.eslintrc',
          emitError: true,
          failOnError: true,
          failOnWarning: true,
          formatter: require('eslint-friendly-formatter'),
        },
        test: /\.js$/,
      },
      {
        include: [/src/],
        loader: 'babel-loader',
        test: /\.js?$/,
      },
    ],
  },

  output: {
    filename: 'arco.js',
    library: 'Arco',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    umdNamedDefine: true,
  },

  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new LodashModuleReplacementPlugin({
      collections: true,
    }),
  ],
};
