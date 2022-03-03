export default {
  // 为当前模块开启命名空间
  namespaced: true,

  // 模块的 state 数据
  state: () => ({
    default_add: null,
  }),
  actions: {
  },
  // 模块的 mutations 方法
  mutations: {
    addToDefault(state,address){
      state.default_add = address
    }
  },

  // 模块的 getters 属性
  getters: {},
}