import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import NProgress from 'nprogress'//页面顶部进度条
import 'nprogress/nprogress.css'
import Ajax from './utils/http'

Vue.prototype.$ajax = Ajax
const VueResource = require('vue-resource');
Vue.prototype.$http = VueResource


import Login from './components/Login.vue'
import Home from './components/Home.vue'
//userManage  用户管理
import Welcome from './components/userManage/Welcome.vue'
import User from './components/userManage/User.vue'
import UserDetail from './components/userManage/UserDetail.vue'
import Invate from './components/userManage/Invate.vue'
import Apply from './components/userManage/Apply.vue'
import Search from './components/userManage/Search.vue'
import Info from './components/userManage/Info.vue'
import UserRepeated from './components/userManage/UserRepeated.vue'
import Total from './components/total/Total.vue'


//dateManage约局管理
import Date from './components/dateManage/Date.vue'
import DateDetail from './components/dateManage/DateDetail.vue'

//location碎片管理
import LocationList from './components/content/LocationList.vue'
import  LocationDetail from './components/content/LocationDetail.vue'
import  Business from './components/content/Business.vue'
import StarManage from './components/content/starManage.vue'
import StarContent from './components/content/starContent.vue'
import MsgManage from './components/content/MsgManage.vue'
//微信文章
import UEditor from './components/content/UEditor.vue'
import ArtcleList from './components/content/ArticleList.vue'


//tool工具类
import Cache from './components/adminTool/Cache.vue'
import Code from './components/adminTool/Code.vue'
//配置
import Commercial from './components/configure/Commercial.vue'
import CompanyList from './components/configure/CompanyList.vue'
import ConfigManage from './components/configure/configManage.vue'


Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueResource);

function requireAuth (to, from, next) {
    if (auth.loggedIn()) {
        next()
    } else {
        next({
            path: '/login'
        })
    }
}


const routes = [
    {
        path: '/login',
        component: Login,
        hidden: true//不显示在导航中
    },
    {
        path: '/',
        component: Home,
        name: '操作台',
        iconCls: 'el-icon-message',//图标样式class
        //  beforeEnter: requireAuth,
        children: [{ path: '/welcome', component: Welcome, name: '操作台'  }]
    },

    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'el-icon-message',//图标样式class
      //  beforeEnter: requireAuth,
        children: [
            { path: '/user', component: User, name: '用户管理',hidden:'costin_user_manager'},
            { path: '/search', component: Search, name: '用户查询' ,hidden:'costin_user_info'},
            { path: '/apply', component: Apply, name: '注册审核',hidden:'costin_register_browse' },
            { path: '/info', component: Info, name: '用户信息变更' ,hidden:'costin_userinfo_apply'},
            { path: '/invate', component: Invate, name: '用户导入' ,hidden:'costin_user_import'},
            { path: '/userRepeated', component: UserRepeated, name: '重复用户管理' ,hidden:'costin_user_repeated'},
            { path: '/userDetail', component: UserDetail, name: '用户详情',hidden:true}
        ]
    },
  {
    path: '/',
    component: Home,
    name: '需求管理',
    iconCls: 'fa fa-id-card-o',
    //beforeEnter: requireAuth,
    children: [
        { path: '/date', component: Date, name: '需求列表',hidden:'costin_need_info'},
        { path: '/dateDetail', component: DateDetail, name: '约局详情',hidden:true}
        ]
  },
    {
        path: '/',
        component: Home,
        name: '运营管理',
        iconCls: 'el-icon-date',
        //beforeEnter: requireAuth,
        children: [
            { path: '/location', component: LocationList, name: '运营位管理',hidden:'costin_business'},
            { path: '/locationDetail', component: LocationDetail, name: '碎片列表',hidden:true},
            { path: '/starManage', component: StarManage, name: '红人管理',hidden:'costin_celebrity_info'},
            { path: '/starContent', component: StarContent, name: '红人内容',hidden:true},
            { path: '/business', component: Business, name: '道道活动',hidden:'costin_business_push'},
            { path: '/msgmanage', component: MsgManage, name: '短信运营',hidden:'costin_sms_manager'},
            { path: '/artcleList', component: ArtcleList, name: '微信文章',hidden:'costin_sms_manager'},
            { path: '/ueditor', component: UEditor, name: '富文本编辑',hidden:true},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '统计',
        iconCls: 'fa fa-id-card-o',
        //beforeEnter: requireAuth,
        children: [
            { path: '/total', component: Total, name: '注册用户统计' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '配置',
        iconCls: 'el-icon-date',
        //beforeEnter: requireAuth,
        children: [
            { path: '/commercial', component:   Commercial, name: '商学院管理' ,hidden:'costin_commercial_manager'},
            { path: '/companyList', component:   CompanyList, name: '公司管理' ,hidden:'costin_company_manager'},
            { path: '/configManage', component:   ConfigManage, name: '配置管理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '工具',
        iconCls: 'fa fa-id-card-o',
        //beforeEnter: requireAuth,
        children: [
            { path: '/cache', component: Cache, name: '缓存数据' },
            { path: '/code', component: Code, name: '短信码查询' },
        ]
    },


]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start();
  next()
})

router.afterEach(transition =>{
  NProgress.done();
});


new Vue({
  el: '#app',
  template: '<App/>',
  router,
  store,
  components: { App }
  //render: h => h(Login)
}).$mount('#app')

//router.replace('/login')

