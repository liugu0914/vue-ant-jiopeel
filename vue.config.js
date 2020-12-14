const path = require('path')
const { modifyVars } = require('./src/utils/themeUtil.js')

module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/theme/index.less')]
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
