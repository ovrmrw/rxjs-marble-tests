'use strict';

const webpack = require('webpack');


module.exports = {
  entry: ['./testing/main.js'],
  output: {
    path: '.dest',
    filename: 'webpack.bundle.spec.js',
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  plugins: [],
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        // loaders: ['awesome-typescript-loader?tsconfig=config/tsconfig.test-rxjs.json'],
        loaders: ['awesome-typescript-loader'],
      },
    ]
  },
  // devtool: 'inline-source-map',
};