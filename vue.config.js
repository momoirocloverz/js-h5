const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
  // 关闭eslint报错
  lintOnSave: false,
  productionSourceMap: false,
  outputDir: 'build',
  publicPath: './',
  devServer: {
    // https: true,
    open: true,
    overlay: {
      warnings: true,
      error: true
    },
    proxy: {
      '/web': {
        target: 'http://dev-jiangshan-tzyjs-apiweb.hzanchu.com',
        // target: 'https://jiangshan-tzyjs-web.zjsszxc.com',
        secure: false,
        changeOrigin: true
      },
      '/admin': {
        target: 'https://dev-jiangshan-tzyjs-admini.hzanchu.com',
        // target: 'https://pre-jiangshan-tzyjs-admini.hzanchu.com',
        secure: false,
        changeOrigin: true
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/variable.less') // 变量文件位置
      ]
    }
  }
  //   configureWebpack(config) {
  //     if (process.env.NODE_ENV === 'production') {
  //       config.optimization = {
  //         minimizer: [
  //           new TerserPlugin({
  //             terserOptions: {
  //               compress: {
  //                 drop_console: true,
  //               },
  //             },
  //           }),
  //         ],
  //       }
  //     }
  //   },
}
