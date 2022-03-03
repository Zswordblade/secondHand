<template>
	<view>
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">￥{{goods_info.price}}</view>
      <!-- 信息主体区域 -->
      <view class="goods-info-body">
        <!-- 商品名称 -->
        <view class="goods-name">{{goods_info.title}}</view>
        <!-- 收藏 -->
        <!-- <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view> -->
      </view>
    </view>
		<swiper :indicator-dots="true" :circular="true" style="height:600rpx">
		  <swiper-item v-for="(item, i) in goods_info.pic_url_list" :key="i">
		    <image :src="item" @click="preview(i)"></image>
		  </swiper-item>
		</swiper>
    <view class="goods_nav">
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClickForCol" @buttonClick="buttonClickBuy" />
    </view>
	</view>
</template>

<script>
  import { mapActions,mapState } from 'vuex'
	export default {
		data() {
			return {
        goodsID:null,
				goods_info: {
          pic_url:''
        },
        options: [{
              icon: 'star',
              text: '收藏'
        }],
            // 右侧按钮组的配置对象
        buttonGroup: [
          {
            text: '立即购买',
            backgroundColor: '#c00000',
            color: '#fff'
          }
        ],
        isStar:false
			};
		},
    computed:{
      ...mapState('user',['token']),
      ...mapState('favor',['cart'])
    },
    onLoad(options) {
      const goods_id = options.id 
      this.goodsID = options.id
      this.getGoodsDetail(goods_id)
      if(this.cart.includes(Number(this.goodsID))){
          this.options[0].icon = 'star-filled'
          this.isStar=true
        }
    },
    methods: {
      ...mapActions('favor',['collect']),
      async getGoodsDetail(id) {
        const res = await uni.$http.get('/api/goodsDetail',{id})
        // console.log(res)
        if(res.statusCode !== 200)
          return uni.$showMsg()
        this.goods_info = res.data[0]
        this.goods_info.pic_url_list = this.goods_info.pic_url.split('./').filter(item=>{
            return item !== ''
        })
        this.goods_info.pic_url_list.forEach((item,index,arr)=>{
          arr[index] = uni.$http.baseUrl + '/' + item
          // console.log(item)
        })
        // console.log(this.goods_info)
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
      async onClickForCol(){
        if(!this.isStar){
          this.collect({goodsid:this.goodsID,token:this.token})
          this.options[0].icon = 'star-filled'
          this.isStar = true
          // console.log(this.cart)
        } else {
          uni.$showMsg('您已收藏')
        }
      },
      buttonClickBuy(){
        uni.navigateTo({
          url:'/subpkg/checkout/checkout?id='+this.goodsID
        })
      }
    }
	}
</script>

<style lang="scss">
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
    color: #c00000;
    font-size: 18px;
    margin: 10px 0;
  }

  .goods-info-body {
    display: flex;
    justify-content: space-between;

    .goods-name {
      font-size: 13px;
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
.goods_nav {
  // 为商品导航组件添加固定定位
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>
