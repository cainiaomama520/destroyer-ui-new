<template lang="html">
	<div id="guestEcharts"></div>
</template>

<script>
	export default {
		props: ['backData'],
		mounted() {
		},
		watch: {
		},
		methods: {
			drawLine() {
				// 基于准备好的dom，初始化echarts实例
				let myChart = this.$echarts.init(document.getElementById('guestEcharts'));
				var v = this;
				// 绘制图表
				myChart.setOption({
					tooltip: {
						trigger: 'axis',
						// 辅助线
						axisPointer: {
							type: 'cross',
						}
					},
					grid: {
						left: '40px',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						data: v.backData.categories,
						boundaryGap: false, //坐标轴两边留白
					}],
					yAxis: [{
						type: 'value',
					}],
					series: [{
						smooth: true,
						symbol: 'circle', //设定为实心点
						symbolSize: 10, //设定实心点的大小
						name: v.backData.currentEchartsName.name,
						type: 'line',
						stack: '总量',
						data: v.backData[v.backData.currentEchartsName.id],
						itemStyle: {
							normal: {
								color: '#409EFF',
								borderColor: "#409EFF"
							}
						},
						lineStyle: {
							normal: {
								color: '#409EFF',
								width: '2'
							}
						},
					}]
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	#guestEcharts {
		height: 100%;
		width: 100%;
	}
</style>