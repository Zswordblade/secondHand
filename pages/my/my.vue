<template>
	<view>
		<my-login v-if="!token" :code="code"></my-login>
    <my-userinfo v-else></my-userinfo>
	</view>
</template>

<script>
  import { mapState } from "vuex"
   export default {
		data() {
			return {
				code:''
			};
		},
    computed:{
      ...mapState( 'user', ['token'])
    },
    onLoad:function(){
    			uni.login({
    				success: (res) => {
    					if (res.errMsg == "login:ok") {
    						this.code = res.code;
    					} else {
    						uni.showToast({
    							title: '系统异常，请联系管理员!'
    						})
    					}
    				}
    			})
    		},
  }
</script>

<style lang="scss">
</style>
