export default {
  // 为当前模块开启命名空间
  namespaced: true,

  // 模块的 state 数据
  state: () => ({
    cart: []
  }),
  actions: {
  },
  // 模块的 mutations 方法
  mutations: {
    addTocart(state,goods) {
       if(!state.cart.includes(goods.goodsid))
        state.cart.push(Number(goods.goodsid))
    },
    subFromCart(state, data) {
      state.cart = state.cart.filter(item => {
        return item !== Number(data.goodsid)
      })
    }
  },

  // 模块的 getters 属性
  getters: {},
}