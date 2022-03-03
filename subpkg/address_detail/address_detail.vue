<template>
  <view>
    <view class="add-list" v-for="(item,index) in address_list" :key="item.id" @click="chooseDefault(item,index)">
      <text :class="default_add&&default_add.id===item.id?'select-label':'hide'">默认</text>
      <my-address :address="item"></my-address>
    </view>
    <view class="btn-box">
      <van-button color="#ff0000" round icon="plus" custom-class="add-btn" @click="chooseAddress">添加收货地址</van-button>
    </view>
  </view>
</template>

<script>
  import {mapState,mapMutations} from "vuex"
  import myAddress from '../../components/my-address/my-address.vue'
  export default {
    components:{
      myAddress
    },
    data() {
      return {
        address_list:[],
        address:{},
        theIndex:null
      };
    },
    computed:{
      ...mapState('user',['token']),
      ...mapState('address',['default_add']),
      addstr() {
          if (!this.address.provinceName) return ''
          // 拼接 省，市，区，详细地址 的字符串并返回给用户
          return this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo
      },
    },
    onLoad(){
      this.getAddress()
    },
    methods:{
      ...mapMutations('address',['addToDefault']),
      async chooseAddress() {
          // 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
          //    返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
          const [err, succ] = await uni.chooseAddress().catch(err => err)
      
          // 2. 用户成功的选择了收货地址 
          if (err === null && succ.errMsg === 'chooseAddress:ok') {
            // 为 data 里面的收货地址对象赋值
            this.address = succ
          }
          // console.log(this.address)
          this.addAddress()
      },
      async addAddress(){
        const res = await uni.$http.post('/api/my/myAddress',{
            name:this.address.userName,
            id: this.token,
            phone: this.address.telNumber,
            address: this.addstr
        })
        if (res.statusCode !== 200) return uni.$showMsg()
        if(res.data.msg === "true"){
          uni.$showMsg('添加成功')
          this.getAddress()
        } else {
          uni.$showMsg('添加失败')
          console.log(res)
        }
      },
      async getAddress(){
        const res = await uni.$http.get('/api/getAddress',{token:this.token})
        if (res.statusCode !== 200) return uni.$showMsg()
        this.address_list = res.data
        console.log(this.address_list)
      },
      chooseDefault(item,index){
        this.addToDefault(item)
        this.theIndex = index
        uni.navigateBack({
          delta: 1
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .hide {
    visibility: hidden;
  }
.select-label{
  position: relative;
  left: 5px;
  top: 18px;
  background-color: #FF0000;
  font-size: 14px;
  color:#FFFFFF
}
.add-list{
  margin: 10px 0;
  // background-color: #faffe5;
}
.btn-box{
  position:absolute;
  bottom:20px;
  left:50%;
  transform: translateX(-50%);
  .add-btn{
    padding: 0 10px;
  }
}

</style>
