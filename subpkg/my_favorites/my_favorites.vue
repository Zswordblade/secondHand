<template>
  <view>
    <view>
      <view v-for="item in goodsList" :key="item.id" @click="toDetail(item)">
          <my-goods :goods="item"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  import myGoods from '../../components/my-goods/my-goods.vue'
  import { mapState, mapMutations } from 'vuex'
  
  export default {
    data() {
      return {
        goodsList:[]
      };
    },
    components:{
      myGoods
    },
    computed:{
      ...mapState('user',['token'])
    },
    onLoad(){
      this.getList()
    },
    onShow() {
      this.getList()
    },
    onReady() {
      uni.setNavigationBarTitle({
        title: '我的收藏'
      })
    },
    methods:{
      ...mapMutations('favor',['addTocart']),
      async getList(){
        const res  = await uni.$http.get('/api/my/favoriGoods',{token:this.token})
        if (res.statusCode !== 200) return uni.$showMsg()
        this.goodsList = res.data
        this.goodsList.forEach(item => {
          item.picUrl = uni.$http.baseUrl+'/'+item.pic_url.split('./')[1]
        })
      },
      toDetail(item){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?id='+item.id,
        })
      }
    }
  }
</script>

<style lang="scss">
</style>
