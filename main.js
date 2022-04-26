import Vue from 'vue'
import App from './App'
import store from './store/store.js'

// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'


uni.$http = $http

// 请求的根路径
// $http.baseUrl = 'http://127.0.0.1:3200'
$http.baseUrl = 'http://192.168.1.85:3200'


// 请求拦截器
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: '数据加载中...'
  })
}

// 响应拦截器
$http.afterRequest = function() {
  uni.hideLoading()
}

// 封装弹框的方法
uni.$showMsg = function(title = '数据请求失败！', duration = 1500, icon = 'none') {
  uni.showToast({
    title,
    duration,
    icon
  })
}

Vue.config.productionTip = false
Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})
app.$mount()
