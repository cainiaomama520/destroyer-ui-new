<template>
	<div class="loginPage">
		<div class="login-wrap">
			<div class="ms-title">Destroyer</div>
			<div class="ms-login">
				<el-form :model="login" :rules="rules" ref="login" label-width="0px" class="demo-ruleForm" @keyup.native.enter="handleSubmit('login')">
					<el-form-item prop="email">
						<el-input type="email" v-model="login.email" placeholder="Email"></el-input>
					</el-form-item>
					<el-form-item prop="passwd">
						<el-input type="password" placeholder="password" v-model="login.passwd"></el-input>
					</el-form-item>
					<el-form-item class="login-btn">
						<el-button type="primary" @click="handleSubmit('login')">登录</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				login: {
					email: '',
					passwd: ''
				},
				rules: {
					email: [{
						required: true,
						message: '请输入Email',
						trigger: 'blur'
					}
//					, {
//						type: "email",
//						message: "请输入Email",
//						trigger: 'blur'
//					}
					],
					passwd: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}]
				}
			}
		},
		mounted: function() {
			
		},
		methods: {
			handleSubmit(formName) {
				this.$refs[formName].validate((valid) => {
		          if (valid) {
		            var v = this;
					let obj = {
	                    username: v.login.email,
	                    password: v.login.passwd
	               }
					v.$api.post(v.apiList.login+"?username=" + v.login.email + "&password=" + v.login.passwd, obj, function(r) {
						console.log(r)
						if(r.code != 500) {
							localStorage.setItem("API_TOKEN", r.token);
							v.$router.push("Home");
						} else{
							v.$message.error(r.msg);
							 return false;
						}
					});
		         } else {
		            return false;
		          }
		       });
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.loginPage{
		 position: absolute;
	    top: 0px;
	    left: 0px;
	    width: 100%;
	    background: #d2d6de;
	    min-height: 100%;
	}
	 .login-wrap{
       width: 360px;
       margin:7% auto;
    }
    .ms-title{
		font-size: 35px;
	    text-align: center;
	    margin-bottom: 25px;
	    font-weight: 300;
    }
    .ms-login{
    	background: #fff;
	    padding: 20px;
	    border-top: 0;
   		color: #666;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>