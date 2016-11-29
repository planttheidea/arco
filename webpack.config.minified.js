'use strict';

const webpack = require("webpack");
const OptimizeJsPlugin = require('optimize-js-plugin');

const defaultConfig = require("./webpack.config.js");

const loaders = defaultConfig.module.loaders.concat([
  {
    cacheable: true,
    include: [
      /src/
    ],
    loader: 'strip-loader?strip[]=testParameter',
    test: /\.js/
  }
]);

module.exports = Object.assign({}, defaultConfig, {
  devtool: null,

  output: Object.assign({}, defaultConfig.output, {
    filename: "arco.min.js"
  }),

  module: Object.assign({}, defaultConfig.module, {
    loaders
  }),

  plugins: defaultConfig.plugins.concat([
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        booleans: true,
        conditionals: true,
        drop_console: false,
        drop_debugger: true,
        join_vars: true,
        screw_ie8: true,
        sequences: true,
        warnings: false
      },
      mangle: true,
      sourceMap: false
    }),
    new OptimizeJsPlugin({
      sourceMap: false
    })
  ])
});
