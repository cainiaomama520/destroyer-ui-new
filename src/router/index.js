import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import TopHeader from '@/components/common/TopHeader'
import Home from '@/components/Home'
//报表
import Report from '@/components/Report/previewPage'
import apiReport from '@/components/Report/apiReport'
import guestReport from '@/components/Report/guestReport'
//直客订单
import GuestOffer from '@/components/GuestOffer/previewPage'
import guestCreative from '@/components/GuestOffer/creativeList'
import guestOffer from '@/components/GuestOffer/offerList'
import guestCampaign from '@/components/GuestOffer/campaignList'
import guestOfferOpera from '@/components/GuestOffer/offerOperaList'
import guestCampaignOpera from '@/components/GuestOffer/campaignOperaList'
//API订单
import ApiOffer from '@/components/ApiOffer/previewPage'
import realtimeOffer from '@/components/ApiOffer/realtimeOfferList'
import historyOffer from '@/components/ApiOffer/historyOfferList'
import offerGroup from '@/components/ApiOffer/offerGroupList'
import pullOffer from '@/components/ApiOffer/pullOfferList'
import putOffer from '@/components/ApiOffer/putOfferList'
//客户管理
import Advertiser from '@/components/Advertiser/previewPage'
import apiAdver from '@/components/Advertiser/apiAdvList'
import guestAdver from '@/components/Advertiser/guestAdvList'
//渠道管理
import Channel from '@/components/Channel/previewPage'
import apiChannel from '@/components/Channel/apiChannel'
import cpaChannel from '@/components/Channel/cpaChannel'
//离线日志
import AssistTool from '@/components/AssistTool/previewPage'
import offlineLog from '@/components/AssistTool/offlineLog'

Vue.use(Router)

const routes = [{
	path: '',
	component: TopHeader,
	children: [{
		path: 'Home',
		component: Home,
		name: '首页'
	}]
}, {
	path: '/Report',
	/*报表*/
	component: TopHeader,
	name: '报表',
	children: [{
		path: '',
		component: Report,
		children: [{
			path: 'apiReport',
			component: apiReport,
			name: 'API报表'
		}, {
			path: 'guestReport',
			component: guestReport,
			name: '直客报表'
		}]
	}]
}, {
	path: '/GuestOffer',
	/*直客订单*/
	component: TopHeader,
	children: [{
		path: '',
		component: GuestOffer,
		children: [{
			path: 'creativeList',
			component: guestCreative,
			name: '创意列表'
		}, {
			path: 'offerList',
			component: guestOffer,
			name: '直客订单报表'
		}, {
			path: 'campaignList',
			component: guestCampaign,
			name: '直客活动列表'
		}, {
			path: 'offerOperaList',
			component: guestOfferOpera,
			name: '订单操作记录列表'
		}, {
			path: 'campaignOperaList',
			component: guestCampaignOpera,
			name: '活动操作记录列表'
		}]
	}]
}, {
	path: '/ApiOffer',
	/*API订单*/
	component: TopHeader,
	children: [{
		path: '',
		component: ApiOffer,
		children: [{
			path: 'realtimeOfferList',
			component: realtimeOffer,
			name: '实时订单列表'
		}, {
			path: 'historyOfferList',
			component: historyOffer,
			name: '历史订单报表'
		}, {
			path: 'offerGroupList',
			component: offerGroup,
			name: '订单组列表'
		}, {
			path: 'pullOfferList',
			component: pullOffer,
			name: '拉取订单列表'
		}, {
			path: 'putOfferList',
			component: putOffer,
			name: '订单放单列表'
		}]
	}]
}, {
	path: '/Advertiser',
	/*客户管理*/
	component: TopHeader,
	children: [{
		path: '',
		component: Advertiser,
		children: [{
			path: 'apiAdvList',
			component: apiAdver,
			name: '直客广告主'
		}, {
			path: 'guestAdvList',
			component: guestAdver,
			name: 'API网盟'
		}]
	}]
}, {
	path: '/Channel',
	/*渠道管理*/
	component: TopHeader,
	children: [{
		path: '',
		component: Channel,
		children: [{
			path: 'apiChannel',
			component: apiChannel,
			name: 'API渠道'
		}, {
			path: 'cpaChannel',
			component: cpaChannel,
			name: 'CPA渠道'
		}]
	}]
}, {
	path: '/AssistTool',
	/*离线日志*/
	component: TopHeader,
	children: [{
		path: '',
		component: AssistTool,
		children: [{
			path: 'offlineLog',
			component: offlineLog,
			name: '离线日志'
		}]
	}]
}, {
	path: '/login',
	name: '登录',
	component: Login
}]

const router = new Router({
	mode: 'history',
	routes,
	scrollBehavior(to, from, savedPosition) {
		if(savedPosition) {
			return savedPosition;
		} else {
			return {
				x: 0,
				y: 0
			};
		}
	}
});
router.beforeEach((to, from, next) => {
	var token = localStorage.getItem("API_TOKEN");
	if(to.path !== '/login' && !token) {

		return next('/login');
	} else {
		return next();
	}
});
export default router