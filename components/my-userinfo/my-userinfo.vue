<template>
  <view class="my-userinfo-container">
  
      <!-- 头像昵称区域 -->
      <view class="top-box">
        <image :src="userinfo.avatarUrl" class="avatar"></image>
        <view class="nickname">{{userinfo.nickName}}</view>
      </view>
      
      <view class="panel">
        <!-- 面板的主体 -->
        <view class="panel-body">
          <!-- 面板主体中的 item 项 -->
          <navigator url="../../subpkg/my_favorites/my_favorites">
            <view class="panel-item">
              <image src="/static/my-icons/star.png" class="icon"></image>
              <text>收藏</text>
            </view>
          </navigator>
          <view class="panel-item">
            <image src="/static/my-icons/sell.png" class="icon"></image>
            <text>在售二手</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon2.png" class="icon"></image>
            <text>待收货</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon4.png" class="icon"></image>
            <text>已完成订单</text>
          </view>
        </view>
      </view>
      
      <view class="panel">
        <view class="panel-list-item" @click="toAddress">
          <text>收货地址</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="panel-list-item" @click="logout">
          <text>退出登录</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
      </view>
  </view>
</template>

<script>
  import { mapState,mapMutations } from "vuex"
  export default {
    name:"my-userinfo",
    data() {
      return {
        goodsList:[]
      };
    },
    computed:{
      ...mapState('user', ['userinfo','token'])
    },
    mounted(){
      //获取用户收藏
      this.getList()
    },
    methods:{
      ...mapMutations('user',['updateUserInfo','updateToken']),
      async logout(){
        const [err,succ] = await uni.showModal({
          title:'提示',
          content: '确认退出登录吗？'
        }).catch(err => err)
        
        if(succ && succ.confirm) {
          this.updateUserInfo({})
          this.updateToken('')
        }
      },
      toAddress(){
        uni.navigateTo({
          url:'/subpkg/address_detail/address_detail'
        })
      },
      ...mapMutations('favor',['addTocart']),
      //获取用户收藏
      async getList(){
        const res  = await uni.$http.get('/api/my/favoriGoods',{token:this.token})
        if (res.statusCode !== 200) return uni.$showMsg()
        this.goodsList = res.data
        // this.goodsList.forEach(item=>{
        //   item.picUrl = uni.$http.baseUrl+'/'+item.pic_url.split('./')[1]
        // })
        console.log(this.goodsList)
        this.goodsList.forEach(item=>{
          this.addTocart({goodsid:item.goodsID})
        })
      },
    }
  }
</script>

<style lang="scss">
.my-userinfo-container {
  height: 100vh;
  // 为整个组件的结构添加浅灰色的背景
  background-color: #e3e3e3;

  .top-box {
    height: 400rpx;
    background-color: #c00000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .avatar {
      display: block;
      width: 90px;
      height: 90px;
      border-radius: 45px;
      border: 2px solid white;
      box-shadow: 0 1px 5px black;
    }

    .nickname {
      color: white;
      font-weight: bold;
      font-size: 16px;
      margin-top: 10px;
    }
  }
}

  .panel {
    background-color: white;
    border-radius: 3px;
    margin: 8px 0;

    .panel-body {
      display: flex;
      justify-content: space-around;

      .panel-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        font-size: 13px;
        padding: 10px 0;

        .icon {
          width: 35px;
          height: 35px;
        }
      }
    }
  }
.panel-list-item {
  height: 45px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  padding: 0 10px;
}
</style>
