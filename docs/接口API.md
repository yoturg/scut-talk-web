api 文件目录下，按页面划分接口或者按模块划分，把业务代码抽离出。

## 配置

在 config/index.js 配置文件下：
```javascript
// 第 7 行到 30 行
module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    /**
     * proxyTable：用来配置 http 代理，是一个基于 node 的中间件，使用的是 http-proxy-middleware 第三方库
     */
    proxyTable: {
      '/api': {
        target: 'https://api.douban.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': 'v2'
        }
      }
      /**
       * 配置完的效果是这样：
       * axios.get('/api/book/1220562') 
       * 代理映射
       * axios.get('https://api.douban.com/v2/book/1220562)
       */
    },
```

## 使用
在 pages/home/Home.vue 文件
```javascript
// 引入接口文件
import { Login } from '@/api/home'

// 使用
  mounted () {
    axios
      .get('/api/book/1220562')
      .then(Login.getUserInfo)
      .catch(err => console.log(err))
  }
```