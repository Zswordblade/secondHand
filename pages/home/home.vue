<template>
  <view>

    <!-- 分类导航区域 -->
   <view class="nav-list">
      <view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navClickHandler(item)">
        <image :src="item.img" class="nav-img"></image>
        <p>{{item.title}}</p>
      </view>
    </view>
    
    <!-- 商品列表区域 -->
    <view class="goods-list">
       <van-grid column-num="2" gutter="10" :square="true">
          <van-grid-item v-for="item in floorList" :key="item.id" use-slot custom-class="grid-item" @click="toGoodsDetail(item)">
              <image :src="item.picUrl"></image>
                <text class="van-ellipsis">{{item.title}}</text>
          </van-grid-item>
        </van-grid>
    </view>
  </view>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        // 这是轮播图的数据列表
        swiperList: [],
        // 分类导航的数据列表
        navList: [],
        // 楼层的数据
        floorList: []
      };
    },
    computed:{
      ...mapState('user',['token'])
    },
    onLoad() {
      // 调用方法，获取轮播图的数据
      this.getNavList()
      this.getFloorList()
    },
    methods: {
      async getSwiperList() {
        const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata')
        // 请求失败
        if (res.meta.status !== 200) return uni.$showMsg()
        this.swiperList = res.message
      },
      async getNavList() {
        const res = await uni.$http.get('/api/homehot')
        if (res.statusCode !== 200) return uni.$showMsg()
        // console.log(res.data)
        this.navList = res.data
      },
      navClickHandler(item) {
        if (item.name === '分类') {
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      },
      // 获取首页楼层数据的方法
      async getFloorList() {
        const res  = await uni.$http.get('/api//home/floordata')
        if (res.statusCode !== 200) return uni.$showMsg()
        this.floorList = res.data
        this.floorList.forEach(item=>{
          item.picUrl = uni.$http.baseUrl+'/'+item.pic_url.split('./')[1]
        })
        console.log(this.floorList)
      },
      toGoodsDetail(item){
        if(this.token){
          uni.navigateTo({
            url:'../../subpkg/goods_detail/goods_detail?id='+item.id
          })
        }else{
          uni.$showMsg('请先登录')
        }
      },
    }
  }
</script>

<style lang="scss">
    image {
      width: 100%;
      height: 100%;
    }
  swiper {
    height: 330rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }
  .goods-list {
      padding: 20rpx;
      background-color: #F2F3F4 ;
      .grid-item {
        // width: 320rpx;
        // height: 300rpx;
        border-radius: 10px;
      }
      text {
          width:280rpx;
          font:12px "Fira Sans", sans-serif
      }
      image {
        height: 90%;
        border-radius: 5px;
      }
  }
  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15px 0;

    .nav-img {
      width: 128rpx;
      height: 140rpx;
      border-radius: 60rpx;
    }
    p {
      margin: 0 auto;
      text-align: center;
    }
  }

  .floor-title {
    width: 100%;
    height: 60rpx;
  }

  .right-img-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .floor-img-box {
    display: flex;
    padding-left: 10rpx;
  }
</style>
