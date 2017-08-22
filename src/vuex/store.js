import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import a from './modules/a'
import b from './modules/b'
import menu from './modules/menu'
Vue.use(Vuex)

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    modules: {
        a,
        b,
        menu
    }
})