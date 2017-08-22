//test
export const getName = state => state.a.name
export const getLoad = state => state.b.loading
export const getMenu = state => state.menu.menu

//权限 costin_need_recommend
export const costin_need_manager = state => state.menu.costin_need_manager
export const costin_need_recommend = state => state.menu.costin_need_recommend
export const costin_register_apply = state => state.menu.costin_register_apply
//运营位权限
export const costin_position_manager = state => state.menu.costin_position_manager  //位置-增加
export const costin_position_apply = state => state.menu.costin_position_apply //位置-修改、审核
export const costin_celebrity_apply = state => state.menu.costin_celebrity_apply //红人管理与审核
export const costin_business_push = state => state.menu.costin_business_push //道道活动菜单下操作的功能权限
export const costin_sms_manager = state => state.menu.costin_sms_manager //短信运营

//获取文章状态
export const getArticleStatus = state => state.a.articleStatus


