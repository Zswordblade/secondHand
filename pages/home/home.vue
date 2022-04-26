<template>
  <view>

    <!-- 分类导航区域 -->
   <view class="nav-list">
      <view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navClickHandler(i+1)">
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
        <uni-load-more :status="loading" :contentText="contentObj" @clickLoadMore="onLoadMore" style="text-align: center;"></uni-load-more>
    </view>
  </view>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        swiperList: [],
        navList: [],
        floorList: [],
        pageNum: 0,
        loading: 'more',
        contentObj: {
          contentdown: "显示更多",
          contentrefresh: "正在加载...",
          contentnomore: "没有更多数据了"
        },
        activeName: null
      };
    },
    computed:{
      ...mapState('user',['token'])
    },
    onLoad() {
      this.getNavList()
      this.getFloorList()
    },
    onShow() {
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
      navClickHandler(index) {
        uni.navigateTo({
          url:'../../subpkg/goods_list/goods_list?sort=' + index
        })
      },
      // 获取商品列表的方法
      async getFloorList() {
        let data = {
          pageNum: this.pageNum
        }
        const res  = await uni.$http.get('/api/home/floordata',data)
        if (res.statusCode !== 200) return uni.$showMsg()
        if (this.pageNum >0) {
          this.floorList = [...this.floorList,...res.data.results]
          // console.log(this.floorList)
        } else {
          this.floorList = res.data.results
        }
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
      async onLoadMore(e) {
        console.log(e.detail)
        this.loading = 'loading'
        this.pageNum++
        const length = this.floorList.length
        await this.getFloorList()
        if (this.floorList.length === length) {
          setTimeout(() => {
            this.loading = 'noMore'
          },300)
        } else {
          setTimeout(() => {
            this.loading = 'more'
          },300)
        }
      }
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
