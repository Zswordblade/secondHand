<template>
	<view class="container">
    
    <view>
      <view class="address-choose-box" v-if="!default_add">
        <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
      </view>
      <my-address v-else :address="default_add"></my-address>
      <image src="/static/cart_border@2x.png" class="address-border"></image>
    </view>
  
    <view>
      <my-goods :goods="goods_info"></my-goods>
    </view>

		<view class="order-box">
			<view class="order-item">
				<view class="l">
					<text class="name">商品价格</text>
				</view>
				<view class="r">
					<text class="txt">￥{{goods_info.price||''}}</text>
				</view>
			</view>
			<view class="order-item">
				<view class="l">
					<text class="name">运费</text>
				</view>
				<view class="r">
					<text class="txt">￥{{freightPrice||''}}</text>
				</view>
			</view>
		</view>

		<view class="order-total">
			<view class="l">实付：￥{{freightPrice+goods_info.price}}</view>
      <view class="r" @click="submitOrder(0)">取消付款</view>
			<view class="r" @click="submitOrder(1)">去付款</view>
		</view>
	</view>
</template>

<script>
  import {mapState} from "vuex"
  import myGoods from '../../components/my-goods/my-goods.vue'
  import myAddress from '../../components/my-address/my-address.vue'
	export default {
    components:{
      myGoods,
      myAddress
    },
		data() {
			return {
				checkedGoodsList: [],
				checkedAddress: {},
				checkedCoupon: [],
				couponList: [],
				goodsTotalPrice: 0.00, //商品总价
				freightPrice: 8.00, //快递费
				couponPrice: 0.00, //优惠券的价格
				orderTotalPrice: 0.00, //订单总价
				actualPrice: 0.00, //实际需要支付的总价
				addressId: 0,
				couponId: 0,
				isBuy: false,
				couponDesc: '',
				couponCode: '',
				buyType: '',
        goods_info:{},
        goodsID: null
			}
		},
    computed:{
      ...mapState('address',['default_add']),
      ...mapState( 'user', ['token'])
    },
    onLoad(options) {
      const goods_id = options.id 
      this.goodsID = options.id
      this.getGoodsDetail(goods_id)
    },
    onShow(){
      console.log(this.default_add)
    },
		methods: {
      async getGoodsDetail(id) {
        const res = await uni.$http.get('/api/goodsDetail',{id})
        // console.log(res)
        if(res.statusCode !== 200)
          return uni.$showMsg()
        this.goods_info = res.data[0]
        this.goods_info.picUrl = uni.$http.baseUrl+'/'+this.goods_info.pic_url.split('./')[1]
        // console.log(this.goods_info)
      },
      chooseAddress(){
        uni.navigateTo({
          url:'../address_detail/address_detail'
        })
      },
      async submitOrder(type) {
        if(!this.default_add) {
          return uni.$showMsg('请先选择地址')
        }
        const res = await uni.$http.post('/api/makeOrder',{
          customer:this.token,
          order_status:type,
          goodsID:this.goodsID
        })
        // console.log(res)
        if(res.data.msg === 'true') {
          uni.switchTab({
            url:'/pages/home/home'
          })
        }
      },
		}
	}
</script>

<style lang="scss" scoped>
  .address-choose-box {
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .address-border {
    display: block;
    width: 100%;
    height: 5px;
  }
	page {
		height: 100%;
		background: #f4f4f4;
	}

	.order-box {
		margin-top: 20rpx;
		width: 100%;
		height: auto;
		overflow: hidden;
		background: #fff;
	}

	.order-box .order-item {
		height: 104.3rpx;
		overflow: hidden;
		background: #fff;
		display: flex;
		margin-left: 31.25rpx;
		padding-right: 31.25rpx;
		padding-top: 40rpx;
		border-bottom: 1px solid #d9d9d9;
	}

	.order-box .order-item .l {
		float: left;
		height: 52rpx;
		width: 50%;
		line-height: 52rpx;
		overflow: hidden;
	}

	.order-box .order-item .r {
		float: right;
		text-align: right;
		width: 50%;
		height: 52rpx;
		line-height: 52rpx;
		overflow: hidden;
	}

	.order-box .order-item.no-border {
		border-bottom: none;
	}

	.order-total {
		position: fixed;
		left: 0;
		bottom: 0;
		height: 100rpx;
		width: 100%;
		display: flex;
	}

	.order-total .l {
		flex: 1;
		height: 100rpx;
		line-height: 100rpx;
		color: #b4282d;
		background: #fff;
		font-size: 33rpx;
		padding-left: 31.25rpx;
		border-top: 1rpx solid rgba(0, 0, 0, 0.2);
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.2);
	}

	.order-total .r {
    margin: 0 5px; 
		width: 233rpx;
		height: 100rpx;
		background: #ff3842;
		border: 1px solid #ff3842;
    border-radius: 30px;
		line-height: 100rpx;
		text-align: center;
		color: #fff;
		font-size: 30rpx;
	}
</style>

