const path = require('path')
const { merge } = require('webpack-merge')

const config = require('./webpack.config')

module.exports = merge(config, {
  mode: 'development',

  devtool: 'inline-source-map',

  devServer: {
    devMiddleware: {
      writeToDisk: true
    },
    port: 8008,
    open: true
  },

  output: {
    path: path.resolve(__dirname, 'public'),
    assetModuleFilename: '[name][ext]',
    clean: true
  }
})
