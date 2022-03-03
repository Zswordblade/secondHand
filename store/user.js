export default {
  // 为当前模块开启命名空间
  namespaced: true,

  // 模块的 state 数据
  state: () => ({
     address: JSON.parse(uni.getStorageSync('address') || '{}'),
     // 登录成功之后的 token 字符串
     token: uni.getStorageSync('token') || '',
     // 用户的基本信息
     userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}')
  }),

  // 模块的 mutations 方法
  mutations: {
    updateUserInfo(state,userinfo) {
      state.userinfo = userinfo
      this.commit('user/saveInfoStorage')
    },
    saveInfoStorage(state) {
      uni.setStorageSync('userinfo',JSON.stringify(state.userinfo))
    },
    updateToken(state,token) {
      state.token = token
      this.commit('user/saveTokenStorage')
    },
    saveTokenStorage(state) {
      uni.setStorageSync('token',JSON.stringify(state.token))
    }
  },

  // 模块的 getters 属性
  getters: {},
}