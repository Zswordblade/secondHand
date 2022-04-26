<template>
	<view>
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">
        <text>￥{{goods_info.price}}</text>
        <view class="host-box">
          <image :src="goods_info.avr_url" alt="" class="img-icon"></image>
          <text>{{goods_info.name}}</text>
        </view>
      </view>
      <!-- 信息主体区域 -->
      <view class="goods-info-body">
        <!-- 商品名称 -->
        <view class="goods-name">{{goods_info.title}}</view>
<!--        <view class="favi" @click="toChat">
          <uni-icons type="chat" size="18" color="gray"></uni-icons>
          <text>聊一聊</text>
        </view> -->
      </view>
    </view>
		<swiper :indicator-dots="true" :circular="true" style="height:600rpx">
		  <swiper-item v-for="(item, i) in goods_info.pic_url_list" :key="i">
		    <image :src="item" @click="preview(i)"></image>
		  </swiper-item>
		</swiper>
    <!-- 历史评价 -->
    <view class="eva-container">
      <view class="block-center">历史评价</view>
      <view class="item-container">
        <view class="eva-item" v-for="item in estimateArr" :key="item.id">
          <view class="top-area">
            <view class="sell-box">
              <image :src="item.avr_url"></image><text>{{item.name}}</text>
            </view>
            <view>{{item.create_time}}</view>
          </view>
          <view class="uni-common-pl">{{item.estimate}}</view>
        </view>
        <view style="height:50px"></view>
      </view>
    </view>
    <!-- 收藏，购买按钮 -->
    <view class="goods_nav">
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClickForCol" @buttonClick="buttonClickBuy" />
    </view>
	</view>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
        goodsID:null,
				goods_info: {
          pic_url:'',
          userID: null
        },
        estimateArr: [],
        options: [{
              icon: 'star',
              text: '收藏'
        }],
        buttonGroup: [// 右侧按钮组的配置对象
          {
            text: '立即购买',
            backgroundColor: '#c00000',
            color: '#fff'
          }
        ],
        isStar: null
			};
		},
    computed:{
      ...mapState('user',['token']),
      ...mapState('favor',['cart']),
    },
    watch: {
      isStar(n) {
        if(n) {
          this.options[0].icon = 'star-filled'
        } else {
          this.options[0].icon = 'star'
        }
      }
    },
    onLoad(options) {
      const goods_id = options.id 
      this.goodsID = options.id
      this.init(goods_id)
      if(this.cart.includes(Number(this.goodsID))){ // 查看该商品是否已收藏 
          this.isStar = true
          console.log('商品已收藏')
        }
    },
    methods: {
      ...mapMutations('favor', ['addTocart', 'subFromCart']),
      async init(id) {
        await this.getGoodsDetail(id)
        await this.getEvaluate()
      },
      async getGoodsDetail(id) {
        const res = await uni.$http.get('/api/goodsDetail',{id})
        if(res.statusCode !== 200)
          return uni.$showMsg()
        this.goods_info = res.data[0]
        this.goods_info.pic_url_list = this.goods_info.pic_url.split('./').filter(item=>{
            return item !== ''
        })
        this.goods_info.pic_url_list.forEach((item,index,arr)=>{
          arr[index] = uni.$http.baseUrl + '/' + item
        })
      },
      async getEvaluate() {
        const res = await uni.$http.get('/api/getEstimate',{seller_token:this.goods_info.userID})
        if(res.statusCode !== 200)
          return uni.$showMsg()
        if (res.data.msg === 'true') {
          this.estimateArr = res.data.results
          this.estimateArr.forEach(item => {
            item.create_time = item.create_time.slice(0, 9)
          })
          console.log(this.estimateArr)
        } else {
          console.log(res.data.err)
        }
      },
      preview(i) {
        // 调用 uni.previewImage() 方法预览图片
        uni.previewImage({
          // 预览时，默认显示图片的索引
          current: i,
          // 所有图片 url 地址的数组
          urls: this.goods_info.pic_url_list
        })
      },
      async collect(goods) {//收藏
        const res = await uni.$http.get('/api/collectGoods', goods)
        if(res.statusCode !== 200)
          return uni.$showMsg()
        if(res.data.msg === 'true') {
          this.addTocart(goods)
          this.isStar = !this.isStar
        }
        else return uni.$showMsg('收藏失败')
      },
      async unCollect(data) {//取消收藏
        const res = await uni.$http.get('/api/unCollectGoods', data)
        if(res.statusCode !== 200)
          return uni.$showMsg()
        if(res.data.msg === 'true') {
          this.subFromCart(data)
          this.isStar = !this.isStar
        }
        else return uni.$showMsg('操作失败')
      },
      // 收藏
      async onClickForCol(){
        if(!this.isStar){
          this.collect({ goodsid:this.goodsID, token:this.token })
          // console.log(this.cart)
        } else {
          this.unCollect({ goodsid:this.goodsID, token:this.token })
        }
        // this.isStar = !this.isStar
      },
      buttonClickBuy(){
        uni.navigateTo({
          url:'/subpkg/checkout/checkout?id='+this.goodsID
        })
      },
      toChat() {
        uni.navigateTo({
          url: '../chat/chat'
        })
      }
    }
	}
</script>

<style lang="scss">
.mg-b-50 {
  margin-bottom: 50px;
}
swiper {
  height: 750rpx;

  image {
    width: 100%;
    height: 100%;
  }
}
.goods-info-box {
  padding: 10px;
  padding-right: 0;

  .price {
    display: flex;
    justify-content: space-between;
    color: #c00000;
    font-size: 18px;
    margin: 10px 10px;
  }

  .goods-info-body {
    display: flex;
    justify-content: space-between;

    .goods-name {
      font-size: 15px;
      padding-right: 10px;
    }
    // 收藏区域
    .favi {
      width: 120px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-left: 1px solid #efefef;
      color: gray;
    }
  }
}
.eva-container {
  margin-top: 20px;
  .block-center {
    width: 400rpx;
    margin: 0 auto;
    padding: 5px 0;
    text-align: center;
    font-size: 20px;
    background-color: #F0AD4E;
  }
  .eva-item {
    padding: 10px 20px;
  }
  .top-area{
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #666666;
    image{
      height:50rpx;
      width: 50rpx;
      border-radius: 25rpx;
    }
  }
  .sell-box {
    display: flex;
    align-items: center;
    image {
      margin-right: 5px;
    }
  }
}
.item-container {
  margin: 10px 10px 0;
  border-top: 1px solid;
}
.goods_nav {
  // 为商品导航组件添加固定定位
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
.host-box {
  display: inline;
  color: #3F536E;
  .img-icon {
      height:50rpx;
      width: 50rpx;
      border-radius: 25rpx;
    }
}

</style>
