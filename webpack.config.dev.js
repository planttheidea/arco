'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDashboard = require('webpack-dashboard/plugin');

const defaultConfig = require('./webpack.config.js');

const PORT = 3000;

const preLoaders = defaultConfig.module.preLoaders.map((preLoader) => {
  return Object.assign({}, preLoader, {
    cacheable: true
  });
});

const loaders = defaultConfig.module.loaders.map((loader) => {
  if (loader.loader === 'babel') {
    return Object.assign({}, loader, {
      cacheable: true,
      include: [
        /src/,
        /TodoList/
      ],
      query: {
        plugins: [
          'transform-decorators-legacy'
        ]
      }
    });
  }

  return Object.assign({}, loader, {
    cacheable: true
  });
});

module.exports = Object.assign({}, defaultConfig, {
  cache: true,

  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    host: 'localhost',
    inline: true,
    lazy: false,
    noInfo: false,
    quiet: false,
    port: PORT,
    stats: {
      colors: true,
      progress: true
    }
  },

  entry: [
    path.resolve(__dirname, 'TodoList', 'index.js')
  ],

  eslint: Object.assign({}, defaultConfig.eslint, {
    failOnWarning: false
  }),

  externals: null,

  module: {
    preLoaders,
    loaders
  },

  output: Object.assign({}, defaultConfig.output, {
    publicPath: `http://localhost:${PORT}/`
  }),

  plugins: [
    ...defaultConfig.plugins,
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new HtmlWebpackPlugin(),
    new WebpackDashboard()
  ]
});
