import {
	rootUrl
} from './baseUrl'
export default {
	install(Vue, options) {
		Vue.prototype.rootUrl = rootUrl;
		Vue.prototype.getUrlParams = function() {
			var url = location.search; //获取url中"?"符后的字串
			var theRequest = new Object();
			if(url.indexOf("?") != -1) {
				var str = url.substr(1);
				strs = str.split("&");
				for(var i = 0; i < strs.length; i++) {
					theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
				}
			}
			return theRequest;
		};
		//接口列表
		Vue.prototype.apiList = {
			// 登陆
//			login: '/api/authenticate',
			login:'/adx/sys/login',
			dashboardOperatorChat:''

		}
	}
}