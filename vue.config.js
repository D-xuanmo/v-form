const path = require('path')

module.exports = {
  lintOnSave: true,
  // outputDir: 'doc',
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/upyun': {
        target: 'https://assets.xuanmo.xin',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  configureWebpack: {
    entry: {
      app: path.resolve(__dirname, './example/main.js')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@doc': path.resolve(__dirname, './example')
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/style/variable.scss";'
      }
    }
  },
  productionSourceMap: false
}
