<template>
	<div class='guestReportPage'>
		<el-form :inline="true" :model="form" class="demo-form-inline">
			<el-form-item label="日期：">
				<el-date-picker v-model="form.Date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="汇总方式：">
				<el-radio-group v-model="form.dateSearchType">
					<el-radio label='day'>日</el-radio>
					<el-radio label='hour'>小时</el-radio>
					<el-radio label='week'>周</el-radio>
					<el-radio label='month'>月</el-radio>
					<el-radio label='custom'>自定义</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="角色：">
				<el-select v-model="form.roleType" @change='roleTypeChange'>
					<el-option label="运营" value="admin"></el-option>
					<el-option label="广告主&销售" value="adver"></el-option>
					<el-option label="媒介&渠道" value="channel"></el-option>
				</el-select>
			</el-form-item>
			<div v-if="form.roleType == 'admin' || form.roleType == 'adver'" key='roleType'>
				<el-form-item label="销售:">
					<el-select v-model="form.sales" filterable placeholder="请选择销售">
						<el-option v-for="(item,index) in salesList" :key="item.id" :label="item.id+'-'+item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="订单:">
					<el-select v-model="form.offer" filterable multiple collapse-tags placeholder="请选择订单">
						<el-option v-for="(item,index) in offerList" :key="item.id" :label="item.id+'-'+item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="广告主:">
					<el-select v-model="form.adver" filterable multiple collapse-tags placeholder="请选择广告主">
						<el-option v-for="(item,index) in advList" :key="item.id" :label="item.id+'-'+item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
			</div>
			<div v-if="form.roleType == 'admin'" key='roleType1'>
				<el-form-item label="渠道:">
					<el-select v-model="form.channel" filterable multiple collapse-tags placeholder="请选择渠道">
						<el-option v-for="(item,index) in channelList" :key="item.id" :label="item.id+'-'+item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="国家:">
					<el-select v-model="form.countries" filterable multiple collapse-tags placeholder="请选择国家" @change='countryChange'>
						<el-option v-for="(item,index) in countryList" :key="item.id" :label="item.id+'-'+item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="系统:">
					<el-select v-model="form.osType" @change='osChange'>
						<el-option label="不限" value="all"></el-option>
						<el-option label="iOS" value="iOS"></el-option>
						<el-option label="Android" value="Android"></el-option>
					</el-select>
				</el-form-item>
			</div>
			<div v-if="form.roleType == 'channel'" key='roleType2'>
				<el-form-item label="订单(切换前):">
					<el-select v-model="form.offerBefore" filterable multiple collapse-tags placeholder="请选择订单">
						<el-option v-for="(item,index) in offerBeforeList" :key="item.id" :label="item.id+'-'+item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="渠道:">
					<el-select v-model="form.channel" filterable multiple collapse-tags placeholder="请选择渠道">
						<el-option v-for="(item,index) in channelList" :key="item.id" :label="item.id+'-'+item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
			</div>
			<el-form-item label="聚合维度：">
				<el-checkbox-group v-model="form.searchGroup" @change='checkboxChange'>
					<el-checkbox v-for="item in checkboxList" :label="item" :key="item.value" :checked='item.checked' :disabled='item.disabled'>{{item.name}}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="onsubmitSearch()" style='margin-left:80px;'>查询</el-button>
			</el-form-item>
		</el-form>
		<div class="tableBox">
			<el-form  :inline="true">
				<el-form-item>
					<el-button class="btnClass" @click="downloadReport()">下载</el-button>
				</el-form-item>
				<el-form-item label='隐藏列：'>
					<el-checkbox-group v-model="checkedList">
						<el-checkbox v-for="(col,index) in tableHeaderName" :key="index" v-if="!col.hidden" v-model="col.value" :label='col.name'></el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
			<el-table :data="tableData" :summary-method='getSummaries' show-summary stripe style="width: 100%" height='200' v-loading="tableloading"  @sort-change="sortChange">
				<template v-for="(col ,index) in tableHeaderName">
					<el-table-column v-if='checkedList.indexOf(col.name) != -1 && col.value' :fixed="0==index?'left':false" :label=col.name :prop=col.bind :sortable=col.sort>
						<template slot-scope="scope">
							<span v-if="scope.row[col.bind]===''">--</span>
							<span v-else-if="scope.row[col.bind]===0">0</span>
							<span v-else>{{scope.row[col.bind]}}</span>
						</template>
					</el-table-column>
				</template>
			</el-table>
			<div class="block">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageCtr.pageCurrent" :page-sizes="[10, 50, 100, 400]" :page-size="pageCtr.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageCtr.pageTatol">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
				return {
					adminHead: ['无效点击', '扣量转化', '重复转化'],
					checkedList: ['日期', '订单', '广告主', '渠道', '活动', '有效点击', '总转化', '转化率', '渠道转化', '客户价格', '消耗金额', '渠道价格', '支出金额'],
					pageCtr: {
						pageSize: 10,
						pageTatol: 0,
						pageCurrent: 1
					},
					pickerOptions: {
						shortcuts: [{
							text: '今天',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime());
								picker.$emit('pick', [start, end]);
							}
						}, {
							text: '昨天',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
								end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
								picker.$emit('pick', [start, end]);
							}
						}, {
							text: '过去七天',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
								end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
								picker.$emit('pick', [start, end]);
							}
						}, {
							text: '本月',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.setDate(1));
								end.setTime(end.getTime());
								picker.$emit('pick', [start, end]);
							}
						}, {
							text: '上个月',
							onClick(picker) {
								var date = new Date();
								var day = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
								const end = new Date(new Date().getFullYear(), new Date().getMonth() - 1, day);
								const start = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
								picker.$emit('pick', [start, end]);
							}
						}]
					},
					form: {
						Date: [this.$api.dateFormat(new Date()), this.$api.dateFormat(new Date())],
						dateSearchType: 'day',
						roleType: 'admin',
						sales: '', //销售
						offer: [], //切换后订单
						adver: [], //广告主
						offerBefore: [], //切换前订单
						channel: [], //渠道
						countries: [],
						osType: 'all',
						searchGroup: [] //维度
					},
					salesList: [], //销售列表
					offerList: [], //切换后订单列表
					advList: [], //广告主列表
					offerBeforeList: [], //切换前列表
					channelList: [], //渠道列表
					countryList: ['1'],
					checkboxList: [{
						name: '订单（切换前）',
						value: 'offerBefore',
						checked: false,
						disabled: false
					}, {
						name: '活动',
						value: 'acyive',
						checked: true,
						disabled: false
					}, {
						name: '子渠道',
						value: 'subchannel',
						checked: false,
						disabled: false
					}, {
						name: '国家',
						value: 'country',
						checked: false,
						disabled: false
					}, {
						name: '系统',
						value: 'os',
						checked: false,
						disabled: false
					}],
					tableHeaderName: [{
						name: '日期',
						value: false,
						bind: 'time',
						sort: 'custom',
						hidden: true
					}, {
						name: '订单',
						value: false,
						bind: 'advertiserName',
						sort: false,
						hidden: true
					}, {
						name: '订单（切换前）',
						value: false,
						bind: 'totalCvs',
						sort: 'custom',
						hidden: true
					}, {
						name: '广告主',
						value: false,
						bind: 'productName',
						sort: false,
						hidden: true
					}, {
						name: '渠道',
						value: false,
						bind: 'advLinkTagName',
						sort: false,
						hidden: true
					}, {
						name: '子渠道',
						value: false,
						bind: 'totalCvs',
						sort: 'custom',
						hidden: true
					}, {
						name: '活动',
						value: false,
						bind: 'mediaName',
						sort: false,
						hidden: true
					}, {
						name: '有效点击',
						value: false,
						bind: 'clkValidCount',
						sort: 'custom',
						hidden: true
					}, {
						name: '无效点击',
						value: false,
						bind: 'totalCvs',
						sort: 'custom',
						hidden: true
					}, {
						name: '总转化',
						value: false,
						bind: 'idpCvs',
						sort: 'custom',
						hidden: true
					}, {
						name: '转化率',
						value: false,
						bind: 'totalCvs',
						sort: 'custom',
						hidden: true
					}, {
						name: '渠道转化',
						value: false,
						bind: 'consume',
						sort: false,
						hidden: true
					}, {
						name: '扣量转化',
						value: false,
						bind: 'totalCvs',
						sort: 'custom',
						hidden: true
					}, {
						name: '重复转化',
						value: false,
						bind: 'totalCvs',
						sort: 'custom',
						hidden: true
					}, {
						name: '客户价格',
						value: false,
						bind: 'totalCvs',
						sort: 'custom',
						hidden: true
					}, {
						name: '消耗金额',
						value: false,
						bind: 'totalCvs',
						sort: 'custom',
						hidden: true
					}, {
						name: '利润',
						value: false,
						bind: 'totalCvs',
						sort: 'custom',
						hidden: true
					}, {
						name: '渠道价格',
						value: false,
						bind: 'totalCvs',
						sort: 'custom',
						hidden: true
					}, {
						name: '支出金额',
						value: false,
						bind: 'totalCvs',
						sort: 'custom',
						hidden: true
					}, {
						name: '国家',
						value: false,
						bind: 'totalCvs',
						sort: 'custom',
						hidden: true
					}, {
						name: '系统',
						value: false,
						bind: 'totalCvs',
						sort: 'custom',
						hidden: true
					}],
					tableloading: false,
					tableData: [],
					order: 'asc',
					sidx: 'dateTime'
				}
			},
			mounted() {
				var v = this;
				//销售列表
//				this.$api.get(this.apiList., '', function(result) {
//					v.salesList=result;
//				});
				//切换后订单列表
//				this.$api.get(this.apiList., '', function(result) {
//					v.offerList=result;
//				});
				//广告主列表
//				this.$api.get(this.apiList., '', function(result) {
//					v.advList=result;
//				});
				//切换前订单列表
//				this.$api.get(this.apiList., '', function(result) {
//					v.offerBeforeList=result;
//				});
				//渠道列表
//				this.$api.get(this.apiList., '', function(result) {
//					v.channelList=result;
//				});
				//国家列表
//				this.$api.get(this.apiList., '', function(result) {
//					v.countryList=result;
//				});
			},
			methods: {
				//国家搜索框有值时，维度中的国家自动勾选
				countryChange(val) {
					let v = this;
					if(val.length > 0) {
						for(let [i, tmp] of v.checkboxList.entries()) {
							if(tmp.name === '国家') {
								tmp.disabled = true;
								v.form.searchGroup.push(tmp)
								break;
							}
						};
					} else {
						for(let [i, tmp] of v.checkboxList.entries()) {
							if(tmp.name === '国家') {
								tmp.disabled = false;
								v.form.searchGroup = v.removeByValue(v.form.searchGroup, tmp);
								break;
							}
						};
					}
					v.checkboxChange(v.form.searchGroup);
				},
				//系统下拉框不为不限时，维度中的系统自动勾选
				osChange(val) {
					let v = this;
					if(val != "all") {
						for(let [i, tmp] of v.checkboxList.entries()) {

							if(tmp.name === '系统') {
								tmp.disabled = true;
								v.form.searchGroup.push(tmp)
								break;
							}
						};
					} else {
						for(let [i, tmp] of v.checkboxList.entries()) {

							if(tmp.name === '系统') {
								tmp.disabled = false;
								v.form.searchGroup = v.removeByValue(v.form.searchGroup, tmp);
								break;
							}
						};
					}
					v.checkboxChange(v.form.searchGroup);
				},
				//角色变化，
				roleTypeChange(val) {
					let _this = this;
					//重置输入框
					_this.form.sales = ''; //销售
					_this.form.offer = []; //切换后订单
					_this.form.adver = []; //广告主
					_this.form.offerBefore = []; //切换前订单
					_this.form.channel = []; //渠道
					_this.form.countries = [];
					_this.form.osType = 'all';
					_this.form.searchGroup = [];
					//角色变化，维度随之变换
					let arrayShow = [];
					let arryHidden = [];
					let groupArray = [];
					//将默认显示的表头重置
					_this.checkedList = [];
					//将前端控制的隐藏列重置
					_this.adminHead = [];
					//将聚合维度列表重置；
					_this.checkboxList = [];
					//重置表头
					for(let [i, tmp] of _this.tableHeaderName.entries()) {
						tmp.value = false;
						tmp.hidden = true;
					};
					if(val === 'admin') {
						arrayShow = ['日期', '订单', '广告主', '渠道', '活动', '有效点击', '总转化', '转化率', '渠道转化', '客户价格', '消耗金额', '渠道价格', '支出金额'];
						arryHidden = ['无效点击', '扣量转化', '重复转化'];
						groupArray = [{
							name: '订单（切换前）',
							value: 'NetunionId',
							checked: false,
							disabled: false
						}, {
							name: '活动',
							value: 'OfferId',
							checked: true,
							disabled: false
						}, {
							name: '子渠道',
							value: 'ID',
							checked: false,
							disabled: false
						}, {
							name: '国家',
							value: 'PackageName',
							checked: false,
							disabled: false
						}, {
							name: '系统',
							value: 'os',
							checked: false,
							disabled: false
						}]
					} else if(val === 'adver') {
						arrayShow = ['日期', '订单', '广告主', '有效点击', '总转化', '转化率', '客户价格', '消耗金额'];
						arryHidden = ['无效点击', '重复转化', '利润'];
						groupArray = [{
							name: '国家',
							value: 'PackageName',
							checked: false,
							disabled: false
						}, {
							name: '系统',
							value: 'os',
							checked: false,
							disabled: false
						}]
					} else if(val === 'channel') {
						arrayShow = ['日期', '渠道', '订单（切换前）', '有效点击', '渠道转化', '转化率', '渠道价格', '支出金额'];
						arryHidden = ['无效点击', '重复转化'];
						groupArray = [{
							name: '国家',
							value: 'PackageName',
							checked: false,
							disabled: false
						}, {
							name: '系统',
							value: 'os',
							checked: false,
							disabled: false
						}]
					}
					_this.checkedList = _this.checkedList.concat(arrayShow);
					_this.adminHead = _this.adminHead.concat(arryHidden);
					_this.checkboxList = _this.checkboxList.concat(groupArray);
				},
				//将选中的维度放入checkedList中
				checkboxChange(val) {
					console.log(val);
//					debugger
					let v = this;
					//先将维度checkboxList中所有的内容从checkedList中去除
					for(let [i, tmp] of v.checkboxList.entries()) {
						v.checkedList = v.removeByValue(v.checkedList, tmp.name);
					}
					let groupName = [];
					for(let [i, tmp] of val.entries()) {
						groupName.push(tmp.name);
					}
					v.checkedList = v.checkedList.concat(groupName);
//					console.log(v.tableHeaderName)
//					console.log(v.checkedList)
				},
				//生成参数函数
				getParamsFromDom() {
					let params = {
						filterSearch: [],
						groupSearch: [],
						timeSearch: [],
					}
					params.timeSearch = {
						'beginTime': this.form.Date[0],
						'endTime': this.form.Date[1],
						'timeUnit': this.form.dateSearchType
					};
					//聚合维度
					for(let [i, tmp] of this.form.searchGroup.entries()) {
						params.groupSearch.push(tmp.value);
					};
					params.groupSearch = this.handle(params.groupSearch); //数组去重
					if(this.form.roleType === 'admin') {
						params.filterSearch = [{
							'name': 'sales',
							'value': this.form.sales
						}, {
							'name': 'offer',
							'value': this.form.offer.map(String)
						}, {
							'name': 'adver',
							'value': this.form.adver.map(String)
						}, {
							'name': 'channel',
							'value': this.form.channel.map(String)
						}, {
							'name': 'countries',
							'value': this.form.countries.map(String)
						}, {
							'name': 'osType',
							'value': this.form.osType
						}]
					} else if(this.form.roleType === 'adver') {
						params.filterSearch = [{
							'name': 'sales',
							'value': this.form.sales
						}, {
							'name': 'offer',
							'value': this.form.offer.map(String)
						}, {
							'name': 'adver',
							'value': this.form.adver.map(String)
						}]
					} else if(this.form.roleType === 'channel') {
						params.filterSearch = [{
							'name': 'offerBefore',
							'value': this.form.offerBefore.map(String)
						}, {
							'name': 'channel',
							'value': this.form.channel.map(String)
						}]
					}
					return params;
				},
				getTableListWithParams() {
					//this.tableloading = true;
					let _this = this;
					let cdn = {
						'filterSearch': [],
						'groupSearch': [],
						'timeSearch': {
							'beginTime': _this.form.Date[0],
							'endTime': _this.form.Date[1],
							'timeUnit': 'day'
						},
						'page': _this.pageCtr.pageCurrent - 1,
						'limit': _this.pageCtr.pageSize,
						'order': _this.order,
						'sidx': _this.sidx
					};
					let params = _this.getParamsFromDom();
					cdn.filterSearch = params.filterSearch;
					cdn.groupSearch = params.groupSearch;
					cdn.timeSearch = params.timeSearch;
					console.log(cdn)
//					_this.$api.post(_this.apiList.statsUnits, cdn, function(r) {
//						_this.tableLoading = false;
						//表头adminHead包含的值，tableHeaderName的value改为true，hidden改为false
						for(let n = 0; n < _this.adminHead.length; n++) {
							for(let [i, tmp] of _this.tableHeaderName.entries()) {
								if(tmp.name == _this.adminHead[n]) {
									tmp.value = true;
									tmp.hidden = false;
								}
							};
						}
//						console.log(_this.checkedList)
						for(let m = 0; m < _this.checkedList.length; m++) {
							for(let [i, tmp] of _this.tableHeaderName.entries()) {
								if(tmp.name == _this.checkedList[m]) {
									tmp.value = true;
									tmp.hidden = true;
								}
							};
						}
//						console.log(r);
//						if(r && r.list && r.list.length > 0) {
//							_this.tableListData = r.list || [];
//						} else {
//							_this.pageCtr.pageTatol = 0;
//							_this.tableListData = [];
//						};
//					});

				},
				onsubmitSearch() {
					this.pageCtr.pageCurrent = 1;
					this.getTableListWithParams();
				},
				handleSizeChange(val) {
					this.pageCtr.pageSize = val;
					this.getTableListWithParams();
				},
				handleCurrentChange(val) {
					this.pageCtr.pageCurrent = val;
					this.getTableListWithParams();
				},
				downloadReport() {
					let _this = this;
					let cdn = {
						'filterSearch': [],
						'groupSearch': [],
						'timeSearch': {}
					};
					let params = _this.getParamsFromDom();
					cdn.filterSearch = params.filterSearch;
					cdn.groupSearch = params.groupSearch;
					cdn.timeSearch = params.timeSearch;
					this.$api.exportstats('/api/report/exportExcel', cdn, {
						responseType: 'arraybuffer'
					}, function(r) {
						_this.downAdminReportData(r);
					});
				},
				//将文件流转化为excel文件下载
				downAdminReportData(response) {
					var blob = new Blob([response.data], {
						type: 'application/vnd.ms-excel;charset=utf-8'
					});
					var downloadUrl = URL.createObjectURL(blob);
					var a = document.createElement("a");
					a.href = downloadUrl;
					a.download = 'Report.xlsx';
					document.body.appendChild(a);
					a.click();
				},
				getSummaries: function(param) {
					const {
						columns,
						data
					} = param;
					const sums = [];
					let values = [];
					columns.forEach((columns, index) => {
						if(index === 0) {
							sums[index] = '总计';
							return;
						}
//						if(columns.property === 'consume') {
//							values = this.conSum
//						} else if(columns.property === 'clkValidCount') {
//							values = this.clickSum
//						} else if(columns.property === 'idpCvs') {
//							values = this.idpCvsSum
//						} else if(columns.property === 'totalCvs') {
//							values = this.totalCvsSum
//						}
//						if(columns.property === 'consume' || columns.property === 'clkValidCount' || columns.property === 'idpCvs' || columns.property === 'totalCvs') {
//							sums[index] = values;
//						} else {
//							sums[index] = '--';
//						}
					});
					return sums;
				},
				sortChange(column, prop, order) {
					switch(column.order) {
						case 'ascending':
							this.order = 'asc';
							break
						case 'descending':
							this.order = 'desc';
							break
						default:
							this.order = ''
					}
					this.sidx = column.prop;
					if(column.prop === 'time') {
						this.sidx = 'dateTime';
					}
					this.pageCtr.pageCurrent = 1;
					this.getTableListWithParams();
				},
				//删除数组中指定值元素
				removeByValue(arr, val) {
					for(var i = 0; i < arr.length; i++) {
						if(arr[i] == val) {
							arr.splice(i, 1);
							break;
						}
					}
					return arr;
				},
				//数组去重
				handle: function(item) {
					for(var i = 0; i < item.length; i++) {
						for(var n = i + 1; n < item.length; n++) {
							if(item[n] == item[i]) {
								item.splice(n, 1);
								n--;
							}
						}
					}
					return item;
				}
			}
	}
</script>

<style scoped="scoped" lang="scss">
	.guestReportPage {
		padding: 20px;
		.block {
			float: right;
			margin: 25px 0 10px 35px;
		}
		.btnClass {
			margin-left: 0px;
			border-radius: 0px;
			border: none;
			border-bottom: 1px solid #dcdfe6;
			color: #606266;
			margin-right: 20px;
		}
		.el-button.btnClass:focus,
		.el-button.btnClass:hover {
			background: #fff;
			border-color: #409eff;
			color: #409eff;
		}
	}
</style>