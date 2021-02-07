const path = require('path')
const { modifyVars } = require('./src/utils/themeUtil.js')
const isProd = process.env.NODE_ENV === 'production'

module.exports = {

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/theme/theme.less')]
    }
  },
  devServer: {
    historyApiFallback: true
  },
  configureWebpack: config => {
    if (!isProd) {
      config.devtool = 'source-map'
    }
    config.entry.app = ['babel-polyfill', './src/main.js']
    config.performance = {
      hints: false
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: modifyVars(),
          javascriptEnabled: true
        }
      }
    }
  },
  publicPath: '/'
}
