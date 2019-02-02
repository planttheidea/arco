'use strict';

const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const defaultConfig = require('./webpack.config.js');

const PORT = 3000;

const rules = defaultConfig.module.rules
  .map((rule) => {
    if (rule.loader === 'babel-loader') {
      return Object.assign({}, rule, {
        include: [/src/, /TodoList/],
        query: {
          plugins: ['transform-decorators-legacy']
        }
      });
    }

    if (rule.loader === 'eslint-loader') {
      return Object.assign({}, rule, {
        options: Object.assign({}, rule.options, {
          failOnWarning: false
        })
      });
    }

    return rule;
  })
  .concat([
    {
      include: [/node_modules/, /TodoList/],
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: true
          }
        },
        'postcss-loader'
      ],
      test: /\.css$/
    }
  ]);

module.exports = Object.assign({}, defaultConfig, {
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

  entry: [path.resolve(__dirname, 'TodoList', 'index.js')],

  externals: undefined,

  module: Object.assign({}, defaultConfig.module, {
    rules
  }),

  output: Object.assign({}, defaultConfig.output, {
    publicPath: `http://localhost:${PORT}/`
  }),

  plugins: [
    ...defaultConfig.plugins,
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new HtmlWebpackPlugin()
  ]
});
