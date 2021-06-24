const path = require('path')

module.exports = {
  lintOnSave: true,
  outputDir: 'example-dist',
  publicPath: process.env.NODE_ENV === 'production' ? '/v-form/' : '/',
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    }
  },
  configureWebpack: {
    entry: {
      app: path.resolve(__dirname, './example/main.js')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './packages'),
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
