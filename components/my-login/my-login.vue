<template>
   <view class="login-container">
      <!-- 提示登录的图标 -->
      <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
      <!-- 登录按钮 -->
      <button type="primary" class="btn-login" @tap="goLogin">一键登录</button>
      <!-- 登录提示 -->
      <view class="tips-text">登录后尽享更多权益</view>
    </view>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'
  export default {
    name:"my-login",
    props:['code'],
    data() {
      return {
        userInfo: {}
      };
    },
    computed:{
      // ...mapState('user', ['userinfo','token'])
    },
    methods:{
      ...mapMutations('user',['updateUserInfo','updateToken']),
      async setUserInfo(user, token) {
        // console.log(user)
        const obj = {
          name: user.nickName,
          avr_url: user.avatarUrl,
          userID: token
        }
        const res  = await uni.$http.post('/api/setUserInfo',obj)
        if (res.statusCode !== 200) return uni.$showMsg()
        if (res.data.msg === 'true') 
          this.updateToken(token)
        else 
          console.log(res.data.err)
      },
      async goLogin(e){
        const {data:res} = await uni.$http.get('/api/getSession',{code:this.code});
        const context = this
        uni.getUserProfile({
          desc:'用于完善个人信息',
          lang:'zh_CN',
          success(user){
            context.setUserInfo(user.userInfo, res.data.openid)
            context.updateUserInfo(user.userInfo)
          },
          fail(){
            uni.$showMsg('若需使用请授权')
          }
        })
      },
    }
  }
</script>

<style lang="scss">
    .login-container {
      // 登录盒子的样式
      height: 750rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #f8f8f8;
      position: relative;
      overflow: hidden;
    
      // 绘制登录盒子底部的半椭圆造型
      &::after {
        content: ' ';
        display: block;
        position: absolute;
        width: 100%;
        height: 40px;
        left: 0;
        bottom: 0;
        background-color: white;
        border-radius: 100%;
        transform: translateY(50%);
      }
    
      // 登录按钮的样式
      .btn-login {
        width: 90%;
        border-radius: 100px;
        margin: 15px 0;
        background-color: #c00000;
      }
    
      // 按钮下方提示消息的样式
      .tips-text {
        font-size: 12px;
        color: gray;
      }
    }
</style>
