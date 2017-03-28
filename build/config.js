'use strict'
const pkg = require('../package')

module.exports = {
  port: 4000,
  title: 'loooook',
  // when you use electron please set to relative path like ./
  // otherwise only set to absolute path when you're using history mode
  publicPath: '/',
  // add these dependencies to a standalone vendor bundle
  vendor: [
    'vue',
    'vuex',
    'vue-router',
    'vuex-router-sync',
    'promise-polyfill'
  ],
  // disable babelrc by default
  babel: {
    babelrc: false,
    presets: ['vue-app'],
  },
  postcss: [
    // add prefix via postcss since it's faster
    require('autoprefixer')({
      // Vue does not support ie 8 and below
      browsers: ['iOS >= 8.3', 'Android >= 4.4']
    }),
    require('postcss-nested')
  ],
  cssModules: false,
}
