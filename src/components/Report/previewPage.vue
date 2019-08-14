<template>
	<el-container class='reportPage'>
		<el-aside width="200px">
			<!--<el-radio-group v-model="isCollapse" size="mini">
				<el-radio-button :label="false">展开</el-radio-button>
				<el-radio-button :label="true">收起</el-radio-button>
			</el-radio-group>-->
			<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" unique-opened router :collapse="isCollapse">
				<el-menu-item index="/Report/guestReport">
					<i class="el-icon-menu"></i>
					<span slot="title">直客报表</span>
				</el-menu-item>
				<el-menu-item index="/Report/apiReport">
					<i class="el-icon-setting"></i>
					<span slot="title">API报表</span>
				</el-menu-item>
			</el-menu>
		</el-aside>
		<el-main>
			<router-view></router-view>
		</el-main>
	</el-container>
</template>

<script>
	export default {
		data() {
				return {
					isCollapse: false
				};
			},
			methods: {
				handleOpen(key, keyPath) {
					console.log(key, keyPath);
				},
				handleClose(key, keyPath) {
					console.log(key, keyPath);
				}
			}
	}
</script>
<style  scoped="scoped" lang="scss">
	.reportPage {
		background: #fff;
	}
	.el-aside{
		background: #545c64;
	}
</style>