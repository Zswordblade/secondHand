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
    // methods:{
    //   async goLogin(e){
    //         uni.getUserProfile({
    //           desc:'用于完善个人信息',
    //           lang:'zh_CN',
    //           success(user){
    //             console.log(user);
    //           },
    //           fail(){
    //             uni.$showMsg('若需使用请授权')
    //           }
    //         })
    //         const res = await uni.$http.get('/api/getSession',{code:this.code});
    //         console.log(res);
    //   },
      // getSetting() {
      //   return new Promise(function(resolve, reject) {
      //     uni.getSetting({
      //       success: function(res) {
      //         if (res.authSetting['scope.userInfo']) {
      //           console.log('存在');
      //           resolve(true);
      //         } else {
      //           console.log('不存在');
      //           resolve(false);
      //         }
      //       }
      //     })
      //   }).catch((e) => {
      //     console.log(e)
      //   });
      // }
    
  }
</script>

<style lang="scss">

</style>
