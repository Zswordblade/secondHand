<template>
  <view class="container-box">
    <view 
      v-for="item in dataList"
      :key="item.goodsID"
      class="order-item">
      <view class="top-area">
        <view class="sell-box">
          <image :src="item.avr_url"></image><text>{{item.name}}</text>
        </view>
        <view>{{item.order_status?'交易成功':'交易失败'}}</view>
      </view>
      <view style="width: 100%;">
        <my-goods :goods="item"></my-goods>
      </view>
      <view class="bottom-area">
        <van-button v-show="Number(item.estimate_status)" plain round hairline>已评价</van-button>
        <van-button v-show="!Number(item.estimate_status)" plain round hairline @tap="ShowPop(item)">评价</van-button>
      </view>
    </view>
    <van-popup :show="showpop" @close="showpop=false">
      <view class="eva-box">
        <van-rate :value="evaluateForm.rate" @change="onRate"></van-rate>
        <van-field
          type="textarea"
          placeholder="请填写评价"
          :maxlength="30"
          show-word-limit
          autosize
          @change="onTextIn"
        />
        <view class="btn-box">
          <van-button custom-class="btn" color="linear-gradient(to right, #4bb0ff, #6149f6)" @click="onSubmit">
            提交
          </van-button>
        </view>
      </view>
    </van-popup>
  </view>
</template>

<script>
  import myGoods from '../../components/my-goods/my-goods.vue'
  export default {
    components:{
      myGoods
    },
    data() {
      return {
        token: null,
        theItem: {},
        dataList: [],
        showpop: false,
        evaluateForm: {}
      };
    },
    onLoad(option){
      this.token = option.token
      this.getList()
    },
    methods:{
      ShowPop(item) {
        console.log(item)
        this.evaluateForm = {}
        this.showpop = true
        this.theItem = item
        this.evaluateForm.orderID = item.id
        this.evaluateForm.seller = item.userID
        this.evaluateForm.customer = item.customer
        this.evaluateForm.datetime = this.getNowFormatDay()
      },
      async getList(){
        const res = await uni.$http.get('/api/home/getOrder',{token:this.token})
        console.log(res)
        if(res.statusCode !== 200)
          return uni.$showMsg()
         this.dataList = res.data
         this.dataList.forEach(item=>{
           item.picUrl = uni.$http.baseUrl+'/'+item.pic_url.split('./')[1]
         })
      },
      async onSubmit() {
        const res = await uni.$http.post('/api/estimate',this.evaluateForm)
        console.log(res)
        if(res.statusCode !== 200)
          return uni.$showMsg()
        if (res.data.msg === 'true') {
          uni.$showMsg('评价成功')
          this.showpop = false
          await this.getList()
        } else {
          uni.$showMsg('出问题啦')
          console.log(res.data.err)
        }
      },
      onTextIn(e) {
        this.evaluateForm.estimate = e.detail
      },
      onRate(e) {
        this.evaluateForm.rate = e.detail
        console.log(this.evaluateForm.rate)
      },
      getNowFormatDay() {
        var char = "-";
        let nowDate = new Date();
        var day = nowDate.getDate();
        var month = nowDate.getMonth() + 1;//注意月份需要+1
        var year = nowDate.getFullYear();
        //补全0，并拼接
        return year + char + this.completeDate(month) + char + this.completeDate(day);
      },
      completeDate(value) {
        return value < 10 ? "0"+value:value;
      }
    }
  }
</script>

<style lang="scss" scoped>
.bg-white {
  background-color: #F1F1F1 !important;
}
// .float-r {
//   float:right;
// }
.container-box{
  height: 100vh;
  padding: 10px;
  background-color: #e3e3e3;
}
.order-item {
  background-color: #fff;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 14px;
  margin-bottom: 10px;
}
.top-area{
  display: flex;
  justify-content: space-between;
  align-items: center;
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
.bottom-area {
  display: flex;
  justify-content: flex-end;
  padding: 10px 30px 0 0;
  /deep/ .van-button {
    background-color: #F0AD4E;
    padding: 0 25px;
  }
}
.pd {
  padding: 0 25px;
}
.bg-gray {
  background-color: gray;
}
.eva-box {
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  width: 400rpx;
  // height: 300rpx;
  border-radius: 20px;
  padding: 10px 5px;
}
.btn-box {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

</style>
