<template>
	<el-container class="homePage">
		<el-main>
			<el-row>
				<el-col :span="24">
					<el-card shadow="never" v-loading='guestLoading'>
						<div slot="header" class="clearfix">
							<span>直客数据趋势</span>
							<el-dropdown @command="handleCommandGuest" style="float: right; padding: 3px 0">
								<span class="el-dropdown-link">
								    {{guestTimeUnit}}<i class="el-icon-arrow-down el-icon--right"></i>
								</span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="今日">今日</el-dropdown-item>
									<el-dropdown-item command="近一周">近一周</el-dropdown-item>
									<el-dropdown-item command="近一月">近一月</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
						<div>
							<el-radio-group @change='radioGuestChange' v-model="radioGuest" size="small">
								<el-radio-button v-for="item in radioList" :label="item" :key="item.id">{{item.label}}</el-radio-button>
							</el-radio-group>
							<div class="guestEchartsDiv">
								<guestEcharts ref='rightGuestEcharts' :backData='guestChartsArray'></guestEcharts>
							</div>
						</div>
					</el-card>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24">
					<el-card shadow="never" v-loading='apiLoading'>
						<div slot="header" class="clearfix">
							<span>API数据趋势</span>
							<el-dropdown @command="handleCommandApi" style="float: right; padding: 3px 0">
								<span class="el-dropdown-link">
								    {{apiTimeUnit}}<i class="el-icon-arrow-down el-icon--right"></i>
								</span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="今日">今日</el-dropdown-item>
									<el-dropdown-item command="近一周">近一周</el-dropdown-item>
									<el-dropdown-item command="近一月">近一月</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
						<div>
							<el-radio-group v-model="radioApi" @change='radioApiChange' size="small">
								<el-radio-button v-for="item in radioList" :label="item" :key="item.label">{{item.label}}</el-radio-button>
							</el-radio-group>
							<div class="apiEchartsDiv">
								<apiEcharts ref='rightApiEcharts' :apibackData='apiChartsArray'></apiEcharts>
							</div>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</el-main>
	</el-container>
</template>

<script>
	import guestEcharts from './echartsVue/GuestEcharts'
	import apiEcharts from './echartsVue/ApiEcharts'
	export default {
		components: {
			guestEcharts,
			apiEcharts
		},
		data() {
			return {
				guestLoading: false,
				apiLoading: false,
				guestTimeUnit: '今日',
				apiTimeUnit: '今日',
				radioGuest: {label:'点击',id:'click'},
				radioApi: {label:'点击',id:'click'},
				radioList:[
			        {label:'点击',id:'click'},
			        {label:'激活',id:'active'},
			        {label:'收入',id:'in'},
			        {label:'支出',id:'out'}
			    ],
				guestChartsArray: {
					impValidCount: [],
					clkValidCount: [],
					ctr: [],
					clkCost: [],
					categories: [], //横轴
					currentEchartsName: {} ,//图表名称显示
				},
				apiChartsArray: {
					impValidCount: [],
					clkValidCount: [],
					ctr: [],
					clkCost: [],
					categories: [], //横轴
					currentEchartsName: {} ,//图表名称显示
				}
			};
		},
		mounted() {
//		    this.handleCommandGuest(this.guestTimeUnit);
//		    this.handleCommandApi(this.apiTimeUnit);
		  },
		methods: {
			//直客数据趋势时间维度
			handleCommandGuest(command) {
				this.guestTimeUnit = command;
				let type = 'guest';
				this.timeUnitData(command, type);
			},
			//API数据趋势时间维度
			handleCommandApi(command) {
				this.apiTimeUnit = command;
				let type = 'api';
				this.timeUnitData(command, type);
			},
			//切换时间维度
			timeUnitData(handleCommand, type) {
				let currentTime = [];
				let time = new Date();
				if(handleCommand == '今日') {
					currentTime[0] = this.$api.dateFormat(time.getTime());
					currentTime[1] = this.$api.dateFormat(time.getTime());
				} else if(handleCommand == '近一周') {
					currentTime[1] = this.$api.dateFormat(time.getTime() - 3600 * 1000 * 24 * 1);
					currentTime[0] = this.$api.dateFormat(time.getTime() - 3600 * 1000 * 24 * 7);
				} else if(handleCommand == '近一月') {
					currentTime[1] = this.$api.dateFormat(time.getTime() - 3600 * 1000 * 24 * 1);
					currentTime[0] = this.$api.dateFormat(time.getTime() - 3600 * 1000 * 24 * 30);
				}
				console.log(currentTime);
				if(type == 'guest') {
					this.getGuestData(currentTime);
				} else {
					this.getApiData(currentTime);
				}
			},
			getGuestData(currentTime) {
				let v = this;
				let timeUnit = '';
				if(v.guestTimeUnit == '近一周' || v.guestTimeUnit == '近一月') {
					timeUnit = 'day'
				} else {
					timeUnit = 'hour'
				}
				v.guestLoading = true;
				v.guestChartsArray.impValidCount = [];
				v.guestChartsArray.clkValidCount = [];
				v.guestChartsArray.ctr = [];
				v.guestChartsArray.clkCost = [];
				let cdn = {
					'filterSearch': [],
					'timeSearch': {
						'beginTime': currentTime[0],
						'endTime': currentTime[1],
						'timeUnit': timeUnit,
					},
					'order': 'asc',
					'sidx': 'dateTime'
				};
				v.$api.post(v.apiList.dashboardOperatorChat, cdn, function(r) {
					for(var i = 0; i < r.chat.length; i++) {
						let item = r.chat[i];
						v.guestChartsArray.impValidCount.push(item.impValidCount);
						v.guestChartsArray.clkValidCount.push(item.clkValidCount);
						v.guestChartsArray.clkCost.push(item.clkCost);
						v.guestChartsArray.ctr.push(item.ctr);
					}
					v.guestChartsArray.categories = r.categories;
					v.guestChartsArray.currentEchartsName = v.radioGuest
					v.$refs.rightGuestEcharts.drawLine();
					v.guestLoading = false
				})
			},
			getApiData(currentTime) {
				let v = this;
				let timeUnit = '';
				if(v.apiTimeUnit == '近一周' || v.apiTimeUnit == '近一月') {
					timeUnit = 'day'
				} else {
					timeUnit = 'hour'
				}
				v.apiLoading = true;
				v.apiChartsArray.impValidCount = [];
				v.apiChartsArray.clkValidCount = [];
				v.apiChartsArray.ctr = [];
				v.apiChartsArray.clkCost = [];
				let cdn = {
					'filterSearch': [],
					'timeSearch': {
						'beginTime': currentTime[0],
						'endTime': currentTime[1],
						'timeUnit': timeUnit,
					},
					'order': 'asc',
					'sidx': 'dateTime'
				};
				v.$api.post(v.apiList.dashboardOperatorChat, cdn, function(r) {
					for(var i = 0; i < r.chat.length; i++) {
						let item = r.chat[i];
						v.apiChartsArray.impValidCount.push(item.impValidCount);
						v.apiChartsArray.clkValidCount.push(item.clkValidCount);
						v.apiChartsArray.clkCost.push(item.clkCost);
						v.apiChartsArray.ctr.push(item.ctr);
					}
					v.apiChartsArray.categories = r.categories;
					v.apiChartsArray.currentEchartsName = v.radioGuest
					v.$refs.rightGuestEcharts.drawLine();
					v.apiLoading = false
				})
			},
			radioGuestChange(val) {
				console.log(val)
				this.guestChartsArray.currentEchartsName = val;
				this.$refs.rightGuestEcharts.drawLine();
			},
			radioApiChange(val) {
				console.log(val);
				this.apiChartsArray.currentEchartsName = val;
				this.$refs.rightApiEcharts.drawLine();
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.homePage {
		background: #fff;
		.el-row {
			margin-bottom: 30px;
			&:last-child {
				margin-bottom: 0;
			}
		}
		.el-col {
			border-radius: 4px;
		}
		.el-dropdown-link {
			cursor: pointer;
			color: #409eff;
		}
		.guestEchartsDiv {
			width: 96%;
			height: 300px;
		}
		.apiEchartsDiv {
			width: 96%;
			height: 300px;
		}
	}
</style>