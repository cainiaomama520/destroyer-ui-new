<template>
	<div class='apiReportPage'>
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
			<el-form-item label="销售：" v-if="form.roleType == 'admin' || form.roleType == 'adver'" key='roleType'>
				<el-select v-model="form.sales" filterable placeholder="请选择销售">
					<el-option v-for="(item,index) in salesList" :key="item.id" :label="item.id+'-'+item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="网盟：" v-if="form.roleType == 'admin' || form.roleType == 'adver'" key='roleType1'>
				<el-select v-model="form.netunion" filterable multiple collapse-tags placeholder="请选择网盟">
					<el-option v-for="(item,index) in netunionList" :key="item.id" :label="item.id+'-'+item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<div v-if="form.roleType == 'admin'" key='roleType2'>
				<el-form-item label="offerId：">
					<el-input v-model="form.offerId" placeholder="请输入内容"></el-input>
				</el-form-item>
				<el-form-item label="ID：">
					<el-input v-model="form.ID" placeholder="请输入内容"></el-input>
				</el-form-item>
				<el-form-item label="包名：">
					<el-input v-model="form.packageName" placeholder="请输入内容"></el-input>
				</el-form-item>
				<el-form-item label="渠道：">
					<el-select v-model="form.channel" filterable multiple collapse-tags placeholder="请选择渠道">
						<el-option v-for="(item,index) in channelList" :key="item.id" :label="item.id+'-'+item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="子渠道：">
					<el-input v-model="form.subChannel" placeholder="请输入内容"></el-input>
				</el-form-item>
				<el-form-item label="国家：">
					<el-select v-model="form.countries" filterable multiple collapse-tags placeholder="请选择国家">
						<el-option v-for="(item,index) in countryList" :key="item.id" :label="item.id+'-'+item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="系统：">
					<el-select v-model="form.osType">
						<el-option label="不限" value="all"></el-option>
						<el-option label="iOS" value="iOS"></el-option>
						<el-option label="Android" value="Android"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="订单名：">
					<el-input v-model="form.offerName" placeholder="请输入内容"></el-input>
				</el-form-item>
				<el-form-item label="订单组：">
					<el-select v-model="form.offerGroup" filterable multiple collapse-tags placeholder="请选择订单组">
						<el-option v-for="(item,index) in offerGroupList" :key="item.id" :label="item.id+'-'+item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="转化率：">
					<el-col :span="11">
						<el-input placeholder="请输入内容" v-model="form.cvrStart">
							<template slot="append">%</template>
						</el-input>
					</el-col>
					<el-col class="line" :span="2">-</el-col>
					<el-col :span="11">
						<el-input placeholder="请输入内容" v-model="form.cvrEnd">
							<template slot="append">%</template>
						</el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="维度：">
					<el-checkbox-group v-model="form.searchGroup"  @change='checkboxChange'>
						<el-checkbox v-for="item in checkboxList" :label="item" :key="item.value" :checked='item.checked' :disabled='item.disabled'>{{item.name}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</div>
			<el-form-item label="渠道：" v-if="form.roleType == 'channel'" key='roleType3'>
				<el-select v-model="form.channel" filterable multiple collapse-tags placeholder="请选择渠道">
					<el-option v-for="(item,index) in channelList" :key="item.id" :label="item.id+'-'+item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="onsubmitSearch()" style='margin-left:80px;'>查询</el-button>
			</el-form-item>
		</el-form>
		<div class="tableBox">
			<el-form :inline="true">
				<el-form-item>
					<el-button class="btnClass" @click="downloadReport()">下载</el-button>
				</el-form-item>
				<el-form-item label="隐藏列：">
					<el-checkbox-group v-model="checkedList">
						<el-checkbox v-for="(col,index) in tableHeaderName" :key="index" v-if="!col.hidden" v-model="col.value" :label='col.name'></el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
			<el-table :data="tableData" :summary-method='getSummaries' show-summary stripe style="width: 100%" height='500' v-loading="tableloading"  @sort-change="sortChange">
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
					checkedList: ['日期', 'ID', '订单名称', '网盟', '有效点击', '总转化', '转化率','渠道转化', '总收入', '支出', '利润'],
					adminHead:['无效点击', '扣量转化', '重复转化'],
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
						netunion: [], //网盟
						channel: [], //渠道
						subChannel: '', //子渠道
						osType: 'all',
						offerId: '',
						ID: '',
						packageName: '',
						countries: [],
						offerName: '',
						offerGroup: [],
						cvrStart: '',
						cvrEnd: '',
						searchGroup: [] //维度
					},
					salesList: [], //销售列表
					netunionList: [], //网盟列表
					offerGroupList: [], //订单组列表
					channelList: [], //渠道列表
					countryList: [],
					checkboxList: [{
						name: 'offerid',
						value: 'offerid',
						checked: false,
						disabled: false
					}, {
						name: 'ID(切换前)',
						value: 'idBefore',
						checked: false,
						disabled: false
					}, {
						name: '渠道',
						value: 'channel',
						checked: false,
						disabled: false
					}, {
						name: '子渠道',
						value: 'subchannel',
						checked: false,
						disabled: false
					}, {
							name: '包名',
							value: 'PackageName',
							checked: false,
							disabled: false
						},{
							name: '国家',
							value: 'country',
							checked: false,
							disabled: false
						}, {
							name: '系统',
							value: 'os',
							checked: false,
							disabled: false
						}, {
							name: '订单组',
							value: 'offerGroup',
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
						name: 'ID',
						value: false,
						bind: 'advertiserName',
						sort: false,
						hidden: true
					}, {
						name: 'ID(切换前)',
						value: false,
						bind: 'totalCvs',
						sort: 'custom',
						hidden: true
					}, {
						name: 'offerid',
						value: false,
						bind: 'productName',
						sort: false,
						hidden: true
					}, {
						name: '订单名称',
						value: false,
						bind: 'advLinkTagName',
						sort: false,
						hidden: true
					}, {
						name: '包名',
						value: false,
						bind: 'totalCvs',
						sort: 'custom',
						hidden: true
					}, {
						name: '网盟',
						value: false,
						bind: 'mediaName',
						sort: false,
						hidden: true
					}, {
						name: '渠道',
						value: false,
						bind: 'clkValidCount',
						sort: 'custom',
						hidden: true
					}, {
						name: '子渠道',
						value: false,
						bind: 'totalCvs',
						sort: 'custom',
						hidden: true
					}, {
						name: '订单组名称',
						value: false,
						bind: 'idpCvs',
						sort: 'custom',
						hidden: true
					}, {
						name: '有效点击',
						value: false,
						bind: 'totalCvs',
						sort: 'custom',
						hidden: true
					}, {
						name: '无效点击',
						value: false,
						bind: 'consume',
						sort: false,
						hidden: true
					}, {
						name: '总转化',
						value: false,
						bind: 'totalCvs',
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
						bind: 'totalCvs',
						sort: 'custom',
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
						name: '总收入',
						value: false,
						bind: 'totalCvs',
						sort: 'custom',
						hidden: true
					}, {
						name: '支出',
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
				//网盟
//				this.$api.get(this.apiList., '', function(result) {
//					v.netunionList=result;
//				});
				//渠道列表
//				this.$api.get(this.apiList., '', function(result) {
//					v.channelList=result;
//				});
				//国家列表
//				this.$api.get(this.apiList., '', function(result) {
//					v.countryList=result;
//				});
				//订单组列表
//				this.$api.get(this.apiList., '', function(result) {
//					v.offerGroupList=result;
//				});
			},
			methods: {
				//角色变化，
				roleTypeChange(val) {
					let _this = this;
					//重置输入框
					_this.form.sales = ''; //销售
					_this.form.netunion = []; //网盟
					_this.form.channel = []; //渠道
					_this.form.subChannel =''; //子渠道
					_this.form.channel = []; //渠道
					_this.form.osType = 'all';
					_this.form.offerId = '';
					_this.form.ID = '';
					_this.form.packageName = '';
					_this.form.offerName = '';
					_this.form.cvrStart = '';
					_this.form.cvrEnd = '';
					_this.form.countries = [];
					_this.form.offerGroup = [];
					_this.form.searchGroup = [];
					//角色变化，维度随之变换
					let arrayShow = [];
					let arryHidden = [];
					let groupArray = [];
					//将默认显示的表头重置
					_this.checkedList = [];
					//将前端控制的隐藏列重置
					_this.adminHead = [];
					//重置表头
					for(let [i, tmp] of _this.tableHeaderName.entries()) {
						tmp.value = false;
						tmp.hidden = true;
					};
					if(val === 'admin') {
						arrayShow = ['日期', 'ID', '订单名称', '网盟', '有效点击', '总转化', '转化率','渠道转化', '总收入', '支出', '利润'];
						arryHidden = ['无效点击', '扣量转化', '重复转化'];
					} else if(val === 'adver') {
						arrayShow = ['日期', '网盟', '有效点击', '总转化', '转化率', '总收入', '渠道转化', '支出', '利润'];
						arryHidden = ['无效点击', '重复转化'];
					} else if(val === 'channel') {
						arrayShow = ['日期', '渠道',  '有效点击', '渠道转化', '转化率', '支出', '总转化','总收入','利润'];
						arryHidden = ['无效点击', '重复转化'];
					}
					_this.checkedList = _this.checkedList.concat(arrayShow);
					_this.adminHead = _this.adminHead.concat(arryHidden);
//					console.log(_this.checkedList)
//					console.log(_this.adminHead)
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
					//勾选子渠道则默认勾选渠道
					if(groupName.indexOf('子渠道') != -1 && groupName.indexOf('渠道') == -1){
						for(let [m, tmp2] of v.checkboxList.entries()) {
							if(tmp2.name === '渠道'){
								tmp2.disabled = true;
								tmp2.checked = true;
								groupName.push(tmp2.name);
								v.form.searchGroup.push(tmp2);
								break;
							}
						}
					}else if(groupName.indexOf('子渠道') != -1 && groupName.indexOf('渠道') != -1){
						for(let [m, tmp2] of v.checkboxList.entries()) {
							if(tmp2.name === '渠道'){
								tmp2.disabled = true;
								break;
							}
						}
					}else{
						for(let [k, tmp3] of v.checkboxList.entries()) {
							if(tmp3.name === '渠道'){
								tmp3.disabled = false;
								break;
							}
						}
					}
					v.checkedList = v.checkedList.concat(groupName);
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
						}]
					} else if(this.form.roleType === 'adver') {
						params.filterSearch = [{
							'name': 'sales',
							'value': this.form.sales
						}, {
							'name': 'netunion',
							'value': this.form.netunion.map(String)
						}]
					} else if(this.form.roleType === 'channel') {
						params.filterSearch = [{
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
	.apiReportPage {
		padding: 20px;
		
		.el-form--inline .el-form-item {
			margin-right: 20px;
		}
		.block {
			float: right;
			margin: 25px 0 10px 35px;
		}
		.line {
			text-align: center;
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