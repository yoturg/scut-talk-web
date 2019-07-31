// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 应用element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入happy-scroll的css
import 'vue-happy-scroll/docs/happy-scroll.css'

// 小写转大写和转驼峰的两个方法
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

import 'vue-easytable/libs/themes-base/index.css'
import {VTable, VPagination} from 'vue-easytable'

// 引入滚动组件及其样式
import { HappyScroll } from 'vue-happy-scroll'

// emoji的自定义方法导入
import { emoji } from './util/emoji.js'

// reset的css文件
import '@/assets/styles/reset.css'
import '@/assets/styles/globalStyle.styl'

// 引入vuex的store
import store from './store/index'

// 导入异步组件
import axios from 'axios'
import qs from 'qs'

// 解决promise的兼容性问题
import promise from 'es6-promise'
promise.polyfill()

Vue.component(HappyScroll.name, HappyScroll)

Vue.use(ElementUI)
Vue.component(VTable.name, VTable)
Vue.component(VPagination.name, VPagination)
require('babel-core/register')
// 批量导入全局组件开始
const requireComponent = require.context(
  // 其组件目录的相对路径
  './_global',
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式(大写字母开头，.vue或.js结尾)
  /[A-Z]\w+\.(vue|js)$/
)
if (requireComponent.keys()) {
  requireComponent.keys().forEach(fileName => {
  // 获取组件配置
    const componentConfig = requireComponent(fileName)

    // 获取组件的 PascalCase 命名
    const componentName = upperFirst(
      camelCase(
      // 剥去文件名开头的 `./` 和结尾的扩展名（）
        fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
      )
    )

    // 全局注册组件
    Vue.component(
      componentName,
      // 如果这个组件选项是通过 `export default` 导出的，
      // 那么就会优先使用 `.default`，
      // 否则回退到使用模块的根。
      componentConfig.default || componentConfig
    )
  })
}
// 批量导入全局组件结束

Vue.prototype.axios = axios
axios.defaults.timeout = 1000 * 60 * 2

Vue.prototype.emoji = emoji

Vue.prototype.exit = function () {
  window.localStorage.clear()
  window.location.replace('/talkinglite/')
}
Vue.prototype.qs = qs
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
