'use strict';

const defaultConfig = require('./webpack.config.js');

module.exports = Object.assign({}, defaultConfig, {
  devtool: false,

  mode: 'production',

  output: Object.assign({}, defaultConfig.output, {
    filename: 'arco.min.js',
  }),
});
