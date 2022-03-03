export default {
  // 为当前模块开启命名空间
  namespaced: true,

  // 模块的 state 数据
  state: () => ({
    cart: []
  }),
  actions: {
    async collect(state,goods){
      const res = await uni.$http.get('/api/collectGoods',goods)
      // console.log(res)
      if(res.statusCode !== 200)
        return uni.$showMsg()
      if(res.data.msg === 'true')
        this.commit('favor/addTocart',goods)
      else return uni.$showMsg('收藏失败')
    }
  },
  // 模块的 mutations 方法
  mutations: {
    addTocart(state,goods){
       // for(let i=0;i<state.cart.length;i++){
       //   if(goods.id===state.cart[i].id)
       //    return
       //  }
       //  state.cart.push(goods)
       if(!state.cart.includes(goods.goodsid))
        state.cart.push(goods.goodsid)
    }
  },

  // 模块的 getters 属性
  getters: {},
}