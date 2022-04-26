<template>
  <view>
    <view class="goods-list">
       <van-grid column-num="2" gutter="10" :square="true">
          <van-grid-item
            v-for="item in floorList"
            :key="item.id"
            use-slot
            :clickable="true"
            custom-class="grid-item"
            @click="toEdit(item.id, item.selled)"
          >
              <image :src="item.picUrl"></image>
              <image v-if="Number(item.selled)" src="../../static/my-icons/已售.png" class="selled"></image>
              <text class="van-ellipsis">{{item.title}}</text>
          </van-grid-item>
        </van-grid>
        <uni-load-more
          :status="loading"
          :contentText="contentObj"
          @clickLoadMore="onLoadMore"
          style="text-align: center;"
        ></uni-load-more>
      </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        pageNum: 0,
        userID: null,
        floorList: [],
        loading: 'more',
        contentObj: {
          contentdown: "显示更多",
          contentrefresh: "正在加载...",
          contentnomore: "没有更多数据了"
        }
      }
    },
    onLoad(options) {
      console.log('load')
      this.userID = options.token
      this.getList()
    },
    onShow() {
      this.getList()
    },
    onReady() {
      uni.setNavigationBarTitle({ title: '待出商品' })
    },
    methods: {
      async getList() {
        const res = await uni.$http.get('/api/my/userGoods',{ token:this.userID, pageNum: this.pageNum })
        if (res.statusCode !== 200) return uni.$showMsg()
        if (res.data.msg === 'true') {
          if (this.pageNum >0) {
            this.floorList = [...this.floorList, ...res.data.results]
          } else {
            this.floorList = res.data.results
          }
          this.floorList.forEach(item => {
            item.picUrl = uni.$http.baseUrl+'/'+item.pic_url.split('./')[1]
          })
        } else {
          console.log(res.data.err)
        }
      },
      async onLoadMore(e) {
        console.log(e.detail)
        this.loading = 'loading'
        this.pageNum++
        const length = this.floorList.length
        await this.getList()
        if (this.floorList.length === length) {
          setTimeout(() => {
            this.loading = 'noMore'
          },300)
        } else {
          setTimeout(() => {
            this.loading = 'more'
          },300)
        }
      },
      toEdit(id, selled) {
        if(!Number(selled)) {
          uni.navigateTo({
            url:'../../subpkg/goods_edit/goods_edit?id=' + id
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .goods-list {
      padding: 20rpx;
      background-color: #F2F3F4 ;
      .grid-item {
        border-radius: 10px;
      }
      text {
          width:280rpx;
          font:12px "Fira Sans", sans-serif
      }
      image {
        height: 90%;
        width: 100%;
        border-radius: 5px;
      }
      .selled {
        position: absolute;
        top: 0;
        left: 0;
        height: 50%;
        width: 50%;
      }
  }
</style>
