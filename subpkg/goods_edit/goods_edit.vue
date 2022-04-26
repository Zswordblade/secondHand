<template>
  <view>
    <van-field
      :value="queryForm.title"
      type="textarea"
      placeholder="请输入信息"
      autosize
      :border="false"
      @change="onChangeTitle"
    />
    <view class="goods-img">
      <van-uploader :file-list="fileList" @after-read="afterRead" :deletable="true" @delete="deleteHandler" max-count="3"/>
    <!--  <view class="up-btn">
        <van-button type="primary" color="red" @click="onCommitPic">
          <van-icon name="arrow-up"></van-icon>
          上传图片
        </van-button>
      </view> -->
    </view>
    <van-field
        type="number"
        label="价格"
        label-class="price-label"
        :value="queryForm.price"
        placeholder="请输入价格"
        @change="onChangePrice"
      />
      <view class="radio-box">
        <text>商品分类:</text>
        <van-radio-group :value="queryForm.sort" @change="onChangeSort">
          <van-radio :name="1" checked-color="#ff0000" custom-class="custom">数码产品</van-radio>
          <van-radio :name="2" checked-color="#ff0000" custom-class="custom">家具</van-radio>
          <van-radio :name="3" checked-color="#ff0000" custom-class="custom">衣服鞋子</van-radio>
          <van-radio :name="4" checked-color="#ff0000" custom-class="custom">二手车</van-radio>
        </van-radio-group>
      </view>
      <view class="btn-box">
        <van-button type="danger" style="width:500rpx" @click="onCommit">发布修改</van-button>
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
        picUrl:'',
        loading: false,
        id: null
      }
    },
    onLoad(options) {
      this.id = Number(options.id)
      this.getGoodsDetail((Number(options.id)))
    },
    computed:{
      ...mapState('user',['token'])
    },
    watch: {
      loading(newValue) {
        if(newValue) {
          uni.showLoading({
            title: '加载中'
          })
        } else {
          uni.hideLoading()
        }
      }
    },
    methods: {
      async getGoodsDetail(id) {
        const res = await uni.$http.get('/api/goodsDetail',{id})
        if(res.statusCode !== 200)
          return uni.$showMsg()
        this.queryForm = res.data[0]
        this.picUrl = res.data[0].pic_url
        res.data[0].pic_url_list = res.data[0].pic_url.split('./').filter(item => {
            return item !== ''
        })
        res.data[0].pic_url_list.forEach((item,index,arr) => {
          this.fileList[index] = {
            url: uni.$http.baseUrl + '/' + item,
            isImage: true
          }
        })
      },
      deleteHandler(e){ // 删除图片
        this.fileList.splice(e.detail.index,1)
        let arr = this.picUrl.split('./')
        arr.splice(e.detail.index + 1, 1)
        // console.log(arr)
        this.picUrl = arr.join('./')
        // console.log(this.picUrl)
      },
      afterRead(e){
        const { file } = e.detail
        const context = this
        file.name = `图片${this.index++}`
        uni.uploadFile({
          url: uni.$http.baseUrl+'/api/uploadPicture',
          filePath: file.url,
          name: 'goods',
          formData: { user: context.token },
          success(res) {
            context.picUrl += res.data
            context.fileList.push(file)
            console.log(context.picUrl)
          },
           fail(res) {
              uni.$showMsg('图片上传失败')
           }
        })
      },
      onChangeTitle(e) {
        this.queryForm.title=e.detail
      },
      onChangePrice(e) {
        this.queryForm.price=e.detail
      },
      onCommitPic(){
        if(this.fileList.length === 0) {
          uni.$showMsg('请先选择图片',1500,'error')
          return 
        }
        this.loading = true
        const context = this
        const url = this.picUrl
        this.picUrl = ''
        if(this.fileList.length > 0) {
          this.fileList.forEach(function(item){
            uni.uploadFile({
              url: uni.$http.baseUrl+'/api/uploadPicture',
              filePath: item.url,
              name: 'goods',
              formData: { user: context.token },
              success(res) {
                context.picUrl=context.picUrl + res.data
                uni.$showMsg('图片上传成功')
                context.loading = false
              },
               fail(res) {
                  uni.$showMsg('图片上传失败')
                  context.loading = false
                  context.picUrl = url
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
          this.loading = true
          const res = await uni.$http.post('/api/updateGoods',{
            title: this.queryForm.title,
            price: this.queryForm.price,
            id: this.id,
            pic_url: this.picUrl,
            sort: this.queryForm.sort
          })
          if(res.data.msg === "true"){
            uni.$showMsg('上传成功')
            setTimeout(() => {
              uni.navigateBack()
            }, 150)
          } else {
            uni.$showMsg('上传失败')
            console.log(res)
          }
          this.loading = false
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