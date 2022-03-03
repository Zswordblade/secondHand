<template>
  <view>
      <van-field
        :value="value"
        type="textarea"
        placeholder="请输入信息"
        autosize
        :border="false"
        @change="onChangeTitle"
      />
      <view class="goods-img">
        <van-uploader :file-list="fileList" @after-read="afterRead" :deletable="true" @delete="deleteHandler" max-count="3"/>
        <view class="up-btn">
          <van-button type="primary" color="red" @click="onCommitPic">
            <van-icon name="arrow-up"></van-icon>
            上传图片
          </van-button>
        </view>
      </view>
      <van-field
          type="digit"
          label="价格"
          label-class="price-label"
          :value="queryForm.price"
          placeholder="请输入价格"
          @change="onChangePrice"
        />
        <view class="radio-box">
          <text>商品分类:</text>
          <van-radio-group :value="queryForm.sort" @change="onChangeSort">
            <van-radio name="1" checked-color="#ff0000" custom-class="custom">数码产品</van-radio>
            <van-radio name="2" checked-color="#ff0000" custom-class="custom">家具</van-radio>
            <van-radio name="3" checked-color="#ff0000" custom-class="custom">衣服鞋子</van-radio>
            <van-radio name="4" checked-color="#ff0000" custom-class="custom">化妆品</van-radio>
          </van-radio-group>
        </view>
        <view class="btn-box">
          <van-button type="danger" style="width:500rpx" @click="onCommit">发布文字</van-button>
        </view>
  </view>
</template>

<script>
  import { mapState } from "vuex" 
  export default {
    data() {
      return {
        queryForm:{
          title:'',
          price:''
        },
        value:'',
        price:'',
        fileList:[],
        index:0,
        picUrl:''
      }
    },
    onLoad(){
      if(!this.token){
        uni.switchTab({
          url:'/pages/my/my'
        })
      }
    },
    computed:{
      ...mapState('user',['token'])
    },
    methods: {
      deleteHandler(e){
        this.fileList.splice(e.detail.index,1)
      },
      afterRead(e){
        const { file } = e.detail
        file.name = `图片${this.index++}`
        this.fileList.push(file)
      },
      onChangeTitle(e) {
        this.queryForm.title=e.detail
      },
      onChangePrice(e) {
        this.queryForm.price=e.detail
      },
      onCommitPic(){
        const context = this
        if(this.fileList.length>0){
          this.fileList.forEach(function(item){
            uni.uploadFile({
              url: uni.$http.baseUrl+'/api/uploadPicture', // 仅为示例，非真实的接口地址
              filePath: item.url,
              name: 'goods',
              formData: { user: context.token },
              success(res) {
                context.picUrl=context.picUrl+res.data
                console.log(context.picUrl)
                uni.$showMsg('图片上传成功')
              },
               fail(res) {
                  uni.$showMsg('图片上传失败')
               }
            })
          })
        }
      },
      onChangeSort(event) {
          this.queryForm.sort = event.detail
      },
      async onCommit(){
        if(!this.queryForm.title)
          uni.$showMsg("请输入商品信息")
        else if(!this.queryForm.price)
          uni.$showMsg("请输入商品价格")
        else if(!this.picUrl)
          uni.$showMsg("请先选中图片并上传")
        else if(!this.queryForm.sort)
          uni.$showMsg("请选中商品分类")
        else{
          const res = await uni.$http.post('/api/addGood',{
            title: this.queryForm.title,
            price: this.queryForm.price,
            token: this.token,
            pic_url: this.picUrl,
            sort: this.queryForm.sort
          })
          if(res.data.msg === "true"){
            uni.$showMsg('上传成功')
          } else {
            uni.$showMsg('上传失败')
            console.log(res)
          }
        }
      }
    }
  }
</script>

<style lang="scss">
.goods-img{
    margin:50rpx 0;
    padding-left: 20rpx;
    border-bottom-style:solid;
    border-width:1rpx;
    border-color:gray;
}
.btn-box {
  margin-top:100rpx;
  text-align: center;
}
.up-btn{
  margin: 10px 0;
}
.radio-box{
  margin:15px 12px;
  text{
    font-weight: 700;
  }
}
.custom{
  margin:7px 7px;
  font-size:15px
}
// .price-label{
//   font-weight: 700;
// }
</style>
