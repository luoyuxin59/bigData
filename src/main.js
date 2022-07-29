import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Bus from './untils/bus'
//  导入excel插件
import XLSX from 'xlsx'
Vue.prototype.XLSX = XLSX
Vue.prototype.$bus = Bus
//全局引入
import VueCron from 'vue-cron'
Vue.use(VueCron);
// 引入样式文件 
import './assets/css/cahngeElement.css'
import './assets/css/normalize.css'
import './assets/css/commons.less'

// 引入icon
import './assets/css/iconfont/iconfont.css'

// 按需引入element-ui
import './plugins/element'
import 'element-ui/lib/theme-chalk/index.css';
import $ from 'jquery'
import './untils/d3.v3.min.js'
var id = 31;
//  引入echarts
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
store.dispatch('getStudentType')
