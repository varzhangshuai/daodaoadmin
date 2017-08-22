//菜单
import {containButton} from 'utils/tool'

const state = {
    menu: [],
    costin_register_apply:containButton('costin_register_apply'),
    costin_need_manager:containButton('costin_need_manager'),
    costin_need_recommend:containButton('costin_need_recommend'),
    costin_position_manager:containButton('costin_position_manager'),
    costin_position_apply:containButton('costin_position_apply'),
    costin_celebrity_apply:containButton('costin_celebrity_apply'),
    costin_sms_manager:containButton('costin_sms_manager'),
    costin_business_push:containButton('costin_business_push')
}
const mutations = {
    cMenu(state,Array){
        state.menu = Array
    },
    cButton(state,Object){
        state.costin_register_apply = Object.costin_register_apply,
        state.costin_need_manager = Object.costin_need_manager,
        state.costin_need_recommend = Object.costin_need_recommend,
        state.costin_position_manager = Object.costin_position_manager,
        state.costin_position_apply = Object.costin_position_apply,
        state.costin_celebrity_apply = Object.costin_celebrity_apply,
        state.costin_sms_manager = Object.costin_sms_manager,
        state.costin_business_push = Object.costin_business_push
    }
}
export default {
    state,
    mutations
}
