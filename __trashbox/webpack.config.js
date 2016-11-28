'use strict';

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');


module.exports = {
  entry: ['./testing/main.js'],
  target: 'node',
  output: {
    path: '.dest',
    filename: 'webpack.bundle.spec.js',
    libraryTarget: 'commonjs2',
  },
  externals: [
    nodeExternals(),
  ],
  resolve: {
    // extensions: ['', '.ts', '.js']
    extensions: ['.ts', '.js']
  },
  plugins: [],
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loaders: ['awesome-typescript-loader'],
      },
    ]
  },
  // devtool: 'source-map',
};
