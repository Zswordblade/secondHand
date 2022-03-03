<template>
  <view>
  
  
    <!-- 渲染收货信息的盒子 -->
    <view class="address-info-box">
      <view class="row1">
        <view class="row1-left">
          <view class="username">收货人：<text>{{address.user_name}}</text></view>
        </view>
        <view class="row1-right">
          <view class="phone">电话：<text>{{address.phone}}</text></view>
          <!-- <uni-icons type="arrowright" size="16"></uni-icons> -->
        </view>
      </view>
      <view class="row2">
        <view class="row2-left">收货地址：</view>
        <view class="row2-right">{{address.address}}</view>
      </view>
    </view>

  </view>
</template>

<script>
  // import {mapState} from "vuex"
  export default {
    name:"my-address",
    props:['address'],
    data() {
      return {
      };
    },
    computed:{
      // ...mapState('user',['token']),
      // addstr() {
      //     if (!this.address.provinceName) return ''
      //     // 拼接 省，市，区，详细地址 的字符串并返回给用户
      //     return this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo
      // },
    },
    methods:{

    }
  }
</script>

<style lang="scss">

// 选择收货地址的盒子
.address-choose-box {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 渲染收货信息的盒子
.address-info-box {
  font-size: 12px;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 5px;
  // border:  solid;
  box-shadow: 1px 1px 5px #888888;
  margin-bottom: 5px;

  // 第一行
  .row1 {
    display: flex;
    justify-content: space-between;

    .row1-right {
      display: flex;
      align-items: center;

      .phone {
        margin-right: 5px;
      }
    }
  }

  // 第二行
  .row2 {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .row2-left {
      white-space: nowrap;
    }
  }
}
</style>
