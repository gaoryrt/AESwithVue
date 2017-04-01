'use strict'
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const config = require('./config')
const _ = require('./utils')

module.exports = {
  entry: {
    client: './client/index.js'
  },
  output: {
    path: _.outputPath,
    filename: '[name].js',
    publicPath: config.publicPath
  },
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false
  },
  resolve: {
    extensions: ['.js', '.vue', '.css', '.json'],
    alias: {
      root: path.join(__dirname, '../client'),
      components: path.join(__dirname, '../client/components')
    },
    modules: [
      _.cwd('node_modules'),
      // this meanse you can get rid of dot hell
      // for example import 'components/Foo' instead of import '../../components/Foo'
      _.cwd('client')
    ]
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loaders: ['vue-loader']
      },
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: [/node_modules/]
      },
      {
        test: /\.es6$/,
        loaders: ['babel-loader']
      },
      {
        test: /\.(ico|jpg|png|gif|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
        loaders: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            query: {
              progressive: true
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        loaders: [
          'raw-loader',
          {
            loader: 'image-webpack-loader',
            query: {
              svgo:{
                plugins: [
                  {removeTitle: true},
                  {removeViewBox: false},
                  {removeDimensions: true},
                  {removeEmptyAttrs: true},
                  {removeEmptyContainers: true},
                  {removeEmptyText: true},
                  {removeHiddenElems: true},
                  {removeUselessDefs: true},
                  {removeDoctype: true},
                  {removeMetadata: true},
                  {convertColors: true}
                ]
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: config.title,
      template: path.resolve(__dirname, 'index.html'),
      filename: _.outputIndexPath
    }),
    new webpack.LoaderOptionsPlugin(_.loadersOptions()),
    new CopyWebpackPlugin([
      {
        from: _.cwd('./static'),
        // to the roor of dist path
        to: './'
      }
    ])
  ],
  target: _.target
}
