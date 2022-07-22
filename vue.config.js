
// const path  = require('path'); //引入path模块
// function resolve(dir) {
//   return path.join(__dirname, dir)
// }

module.exports = {
  // http://182.92.104.174:9999/armedPolice/v1/armedPolice/api
  publicPath: './',
  devServer: {
    // host: 'localhost',
    port: '8010', // 端口号
    https: false, // https: {type:Bollean}
    open: false, // 配置自动启动浏览器
    // 配置代理
    proxy: {
      "/api": {
        target: process.env.VUE_APP_BASE_URL, // 想要访问接口域名
        changeOrigin: true, // 开启跨域,在本地创建一个虚拟服务,然后发送请求的数据,并同时接收请求的数据,这样服务端和服务端进行数据交互就不会有问题
        pathRewrite: {
          "^/api": '', // 利用这个地面的值拼接上target里面的地址
        }
      }
    }
  }
}
// module.exports = {

//   publicPath : process.env.NODE_ENV === 'production' ? './' : '/',
//   chainWebpack: (config) => {
//     config.resolve.alias
//     .set('@', resolve('./src'))
//     .set('components', resolve('./src/components'))  //set第一个参数：设置的别名，第二个参数：设置的路径　
//     .set('network', resolve('./src/network'))　
//     .set('utils', resolve('./src/utils'))
//     .set('views', resolve('./src/views'))
//     .set('assets', resolve('./src/assets'))
//   },
// }

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