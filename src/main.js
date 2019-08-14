// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router';
import api from './utils/request.js'
import App from './App'
// 将API方法绑定到全局
Vue.prototype.$api = api
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// 引入echarts
import echarts from 'echarts';
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(VueRouter);

import wbobj from './utils/wbobj.js'
Vue.use(wbobj);

/* eslint-disable no-new */
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
