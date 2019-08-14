<template>
	<el-container class="bigBackground">
		<el-header class="header-main header-fixed">
			<div class="left-header-main">
				<div id="mex-api-text">Destroyer</div>
				<el-menu theme="dark" :default-active="$route.path" :active="$route.path" mode="horizontal" unique-opened class="el-menu-demo" router active-text-color="#ffd04b" background-color="#545c64" text-color="#fff" id="head-el-menu">
		            <el-menu-item index="/Home">首页</el-menu-item>
		            <el-menu-item index="/Report/guestReport">数据管理</el-menu-item>
		            <el-menu-item index="/GuestOffer/creativeList">直客订单</el-menu-item>
		            <el-menu-item index="/ApiOffer/realtimeOfferList">API订单</el-menu-item>
		            <el-menu-item index="/Advertiser/apiAdvList">客户管理</el-menu-item>
		            <el-menu-item index="/Channel/apiChannel">渠道管理</el-menu-item>
		            <el-menu-item index="/AssistTool/offlineLog">辅助工具</el-menu-item>
		        </el-menu>
			</div>
			<div class="right-header-main">
				<el-button style="float:right;margin:0 30px" type="info" icon="el-icon-close"  size='medium' circle></el-button>
			</div>
		</el-header>
		<el-main>
	    	<router-view></router-view>
	    </el-main>
	</el-container>
</template>

<script>
	export default {
		
	}
</script>

<style scoped="scoped" lang="scss"> 
.bigBackground{
	background: #E4E7ED;
}
.header-main {
    width: 100%;
    height: 60px;
    background: #545c64;
    display: flex;
    justify-content: space-between;
    align-items: center;
    #mex-api-text {
        display: inline-block;
        line-height: 60px;
        width: 120px;
        color: white;
        text-align: center;
        font-style: italic;
        font-weight: bolder;
        font-size: 20px;
    }
    #head-el-menu {
        display: inline-block;
        background-color: #545c64;
    }
    .left-header-main {
        display: flex;
        justify-content: flex-start;
    }
    .right-header-main{
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
}
</style>