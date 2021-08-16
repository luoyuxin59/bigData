
const path  = require('path'); //引入path模块
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {

  publicPath : process.env.NODE_ENV === 'production' ? './' : '/',
  chainWebpack: (config) => {
    config.resolve.alias
    .set('@', resolve('./src'))
    .set('components', resolve('./src/components'))  //set第一个参数：设置的别名，第二个参数：设置的路径　
    .set('network', resolve('./src/network'))　
    .set('utils', resolve('./src/utils'))
    .set('views', resolve('./src/views'))
    .set('assets', resolve('./src/assets'))
  },
}

// module.exports = {
//   // baseUrl: 'http://192.168.1.73:8081/DateEntry/v1',
//   outputDir: 'dist',
//   lintOnSave: true,
//   runtimeCompiler: true, //关键点在这
//   // 调整内部的 webpack 配置。
//   // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/webpack.md
//   chainWebpack:  (config) => {
//     config.resolve.alias
//     .set('@', resolve('./src'))
//     .set('components', resolve('./src/components'))  //set第一个参数：设置的别名，第二个参数：设置的路径　
//     .set('network', resolve('./src/network'))　
//     .set('utils', resolve('./src/utils'))
//     .set('views', resolve('./src/views'))
//     .set('assets', resolve('./src/assets'))
//   },
//   configureWebpack: () => {},
//   // 配置 webpack-dev-server 行为。
//   devServer: {
//     open: process.platform === 'darwin',
//     host: '0.0.0.0',
//     port: 8080,
//     https: false,
//     hotOnly: false,
//     // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/cli-service.md#配置代理
//     proxy: null, // string | Object
//     before: app => {}
//   }
// }