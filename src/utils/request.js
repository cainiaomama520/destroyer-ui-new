// 配置API接口地址
import {
    rootUrl
} from './baseUrl'
	// 引用axios
var axios = require('axios')
	// 自定义判断元素类型JS
function toType(obj) {
	return({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull(o) {
	for(var key in o) {
		if(o[key] === null) {
			delete o[key]
		}
		if(toType(o[key]) === 'string') {
			o[key] = o[key].trim()
		} else if(toType(o[key]) === 'object') {
			o[key] = filterNull(o[key])
		} else if(toType(o[key]) === 'array') {
			o[key] = filterNull(o[key])
		}
	}
	return o
}
function dateFormat(time) {
    var date = new Date(time);
    var year = date.getFullYear();
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    // 拼接
    return year + "-" + month + "-" + day;
}

/*
  接口处理函数
  这个函数每个项目都是不一样的，我现在调整的是适用于
  https://cnodejs.org/api/v1 的接口，如果是其他接口
  需要根据接口的参数进行调整。参考说明文档地址：
  https://cnodejs.org/topic/5378720ed6e2d16149fa16bd
  主要是，不同的接口的成功标识和失败提示是不一致的。
  另外，不同的项目的处理方法也是不一致的，这里出错就是简单的alert
*/

function apiAxios(method, url, params, success, failure) {
	if(params) {
		params = filterNull(params)
	}
//	console.log(params)
	if(localStorage.getItem("API_TOKEN")!=null){
    	var token = 'Bearer ' + localStorage.getItem("API_TOKEN");
		axios.defaults.headers.common['Authorization'] = token;
    }
	axios({
			method: method,
			url: url,
			data: method === 'POST' || method === 'PUT' ? params : null,
			params: method === 'GET' || method === 'DELETE' ? params : null,
			baseURL: rootUrl,
			withCredentials: false
		})
		.then(function(res) {
			if(res.status == 200 || res.status == 201) {
				if(success) {
					success(res.data)
				}
			} else {
				if(failure) {
					failure(res.data)
				} else {
					window.alert('error: ' + JSON.stringify(res.data))
				}
			}
		})
		.catch(function(err) {
			console.log('error.', err);
			if(err.response.status == 401) {
				localStorage.removeItem("API_TOKEN");
				window.location.href = '/login';
				return;
			}
			if(err.response.status == 500) {
				if(err.response.data.detail == undefined) {
					alert('api error, HTTP CODE: ' + err.response.status);
				} else {
					alert('api error: ' + err.response.data.detail);
				}
				return;
			}
			let res = err.response
			if(err) {
				window.alert('api error, HTTP CODE: ' + res.status)
			}
		})
}

// 返回在vue模板中的调用接口
export default {
	get: function(url, params, success, failure) {
		return apiAxios('GET', url, params, success, failure)
	},
	post: function(url, params, success, failure) {
		return apiAxios('POST', url, params, success, failure)
	},
	put: function(url, params, success, failure) {
		return apiAxios('PUT', url, params, success, failure)
	},
	delete: function(url, params, success, failure) {
		return apiAxios('DELETE', url, params, success, failure)
	},
	dateFormat:dateFormat
}