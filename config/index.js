'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    /**
     * proxyTable：用来配置 http 代理，是一个基于 node 的中间件，使用的是 http-proxy-middleware 第三方库
     */
    proxyTable: {
      // '/api': {
      //   target: 'https://api.douban.com',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api': 'v2'
      //   }
      // },
      /**
       * 测试环境
       */
      '/Martell/a': {
        target: 'http://120.78.230.108:8865/Martell/a/',
        changeOrigin: true,
        pathRewrite: {
          '^/Martell/a': ''
        }
      }
      /**
       * 生产环境
       */
      // '/Martell/a': {
      //   target: 'http://47.107.173.139/Martell/a/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/Martell/a': ''
      //   }
      // }
      /**
       * 配置完的效果是这样：
       * axios.get('/api/getName?id=1')
       * 代理映射
       * axios.get('https://api.douban.com/v2/getName?id=1)
       */
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    // assetsPublicPath: '/vue-test',
    /**
     * assetsPublicPath: 构建资源的根目录
     * /vue-test => 服务器ip地址/vue-test/...
     * 若设置为 / 则 => 服务器ip地址/... 这样则不符合我们有多个项目放到同一个服务器上的需求
     */

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
