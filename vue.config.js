const path = require('path')

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
          // modifyVars: {
          //   'primary-color': '#FFF',
          //   'link-color': '#1DA57A',
          //   'border-radius-base': '2px'
          // },
          javascriptEnabled: true
        }
      }
    }
  },
  publicPath: '/'
}
