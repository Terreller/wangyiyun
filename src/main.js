// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
/* eslint-disable*/
// 引入fastclick-》解决300ms延迟的问题
import fastclick from 'fastclick'
// 官方推荐将fastclick绑定到body下，这样在body下的元素都不会有300ms的延迟
Vue.config.productionTip = false

//引入mint-ui
import { Lazyload, InfiniteScroll} from 'mint-ui'
import 'mint-ui/lib/style.css'

//图片懒加载
Vue.use(Lazyload)
Vue.use(InfiniteScroll)
import axios from 'axios'
//将axios添加到vue的原型中
Vue.prototype.$http = axios
//监听全局路由变化
router.beforeEach((to, from, next) => {
  if (to.path === '/' || to.path === '/hot' || to.path === '/search') {
    store.state.tabBarShow = true
  } else {
    store.state.tabBarShow = false
  }
  next()
})
//引入jsonp
import VueJsonp from 'vue-jsonp'
Vue.use(VueJsonp)

//引入初始化css
import './common/styles/index.less'
import './common/font/iconfont.css'
// rem初始化
import './common/reset.js'
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
