
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state, /* 亦可写成 state: state, key-name相同的话，则直接写一个即可 */
  mutations,
  actions: {
    /**
     action名（ctx, 数据）{
      自定义方法...
     }
    */
  },
  /**
   * vuex中，其作用类似computed，当需要使用state数据计算出新的数据时，
   * 便可借助getters工具来提供新的数据，以避免数据的冗余
   */
  getters: {
    doubleData (state) {
      return state.data + '1号'
    }
  }
})
