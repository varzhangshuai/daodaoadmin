// export const api = 'http://' + (location.href.indexOf('devadmin.daodaoclub.com') > -1 ? 'devapi.daodaoclub.com' : location.href.indexOf('test.admin.daodaoclub.com') > -1 ? 'testapi.daodaoclub.com' : 'api.daodaoclub.com')
export const api ='/costin/adminapi';
export default {
    //登录模块
    logincode: `${api}/login/code`, //登录验证码
    login:`${api}/login`,    //post登录 delete退出
    getyzm:`costin/yzm`,    //get获取验证码

    // 用户模块
    user:`${api}/user`, //get获取用户列表   post增加用户
    status:`${api}/user/status`,//post启用
    detail:`${api}/user/detail`,//get详情    post修改     delete禁用
    invite:`${api}/user/invite`,//post发送邀请码
    registed:`${api}/user/registed`,//post直接注册
    import:`${api}/user/import`,//post导入excel表
    code:`${api}/code`,//get获取短信码
    apply:`${api}/apply`,//get申请内测列表
    applyHistory:`${api}/apply/history`,//get 历史申请
    agreeApply:`${api}/apply`,//delete 审核不通过
    disagreeApply:`${api}/apply`,//post 审核通过
    search:`${api}/user/search`,//get 用具查询
    infoList:`${api}/apply/info`,//get 用户信息审核列表
    infoApply:`${api}/apply/info`,//post 用户信息审核
    userRepeated:`${api}/user/repeated`, //get 用户-重复用户-预警列表
    menu:`api/auth/lists`,//get 获取权限
    ///api/auth/menu?empid=4
    //数据统计
    totalDate: `${api}/total/date`,
    totalGrade: `${api}/total/grade`,
    totalLottery: `${api}/lottery/total`,
    totalSendmsg: `${api}/operating/sendinvitemsg`,//发送手机号未激活
    totalSendmsged: `${api}/operating/sendactivatedmsg`,//发送手机号已激活
    //商学院列表
    commercial:`${api}/commercial/all`,//get 商学院班级列表
    //需求列表
    demandList:`${api}/need`,  //post 代发需求
    demandPre:`${api}/need/prepare`,    //get 需求数据
    needList:`${api}/need/list`,//get 需求列表
    needDetail:`${api}/need/detail`,//get 需求详情
    needDelete:`${api}/need/delete`,//put 需求删除
    match:`${api}/need/match`,//post 人工匹配
    addLabel:`${api}/need/label`,//post 添加标签
    recommend:`${api}/need/recommend`,//post 推荐
    distribute:`${api}/need/distribute`,//post 派发
    needTop:`${api}/need/top`,//post 置顶需求


    //配置
    labelAll:`${api}/label/all`,//get 全部标签
    labelSearch:`${api}/label/search`,//get 标签搜索
    category:`${api}/basics/category`,//get 标签类型
    deleteLabel:`${api}/need/label/del`,//post 删除标签
    area:`${api}/basics/area`,//get 省市区列表
    industry:`${api}/basics/industry`,//get 行业列表
    industrydll:`${api}/basics/industry/ddl`,//get 行业列表
    unregisteredRecommend:`${api}/unregistered/recommend`,//get 未注册用户-匹配
    unregisteredDetail:`${api}/unregistered/detail`,//get 未注册用户-列表
    unregisteredSend:`${api}/unregistered/send`,//post 未注册用户-派发
    unregisteredNeed:`${api}/unregistered/need`,//get 未注册用户-需求列表
    unregisteredUser:`${api}/unregistered/user`,//get 未注册用户-用户列表

    //content 碎片管理
    locationList:`${api}/location`,//get 碎片列表
    locationKeeps:`${api}/location`,//POST 碎片保存
    locationApply:`${api}/location/apply`,//POST 碎片审核
    locationDetail:`${api}/location/detail`,//get 碎片详情
    //chip 管理
    chipList:`${api}/location/chip`,//get 碎片chip列表
    chipKeeps:`${api}/location/chip`,//post 碎片chip列表
    chipApply:`${api}/location/chip/apply`,//POST 碎片chip审核
    chipDetail:`${api}/location/chip/detail`,//get 碎片详情
    //推送
    businessList:`${api}/business`,//get 推送列表
    businessKeeps:`${api}/business`,//POST 推送保存
    businessApply:`${api}/business/apply`,//POST 推送审核
    businessDetail:`${api}/business/detail`,//get 推送详情
    //微信文章
    articleList:`${api}/article/pending`,//post 文章列表
    articleDetail:`${api}/article/detail`,//post 文章详情
    articleAudit:`${api}/article/audit`,//post 文章-审核
    articleSuccess:`${api}/article/success`,//post 文章详情


    //数据缓存
    commonCache:`${api}/common/cache`,    // 缓存数据
    jobRecommend:`${api}/job/recommend`, //   工作推荐
    userUnbind:`${api}/user/unbind`,     //   删除用户微信绑定数据

    //红人管理
    companyList:`${api}/company/list`, //get 获取公司列表
    celebrityList:`${api}/celebrity`,  //get 红人-获取列表
    celebrityAdd:`${api}/celebrity/add`,  //get 红人-添加红人
    celebritymod:`${api}/celebrity/modify` ,//post 红人-添加红人
    celebrityDeta:`${api}/celebrity/detail`,        //红人详情
    celebrityApply:`${api}/celebrity/apply`,       //红人审核
    celebrityOff:`${api}/celebrity/off`,            // get  红人-下线
    celebrityAddneed:`${api}/celebrity/AddCelebrityNeed`,   // post- 红人添加需求

    //红人内容
    sectionEditor:`${api}/sectionDetails/editor`, //post 修改 添加红人内容
    sectionGetDetail:`${api}/sectionDetails/getDetail`, //get 获取红人内容

    //用户信息收集
    industryUserAdd:`${api}/industry/user/add `, //post 增加用户关联行业
    industryUserRemove:`${api}/industry/user/remove`, //post 删除用户关联行业
    usercompanyAdd: `${api}/company/usercompany/add`, //post 公司-添加用户关联表
    usercompanyRemove:`${api}/company/usercompany/remove`, //post 公司- 删除用户关联表
    companyAdd:`${api}/company/add`, //post 公司- 添加公司

    //配置
    commercialCollege:`${api}/commercial/college`, //post  商学院 - 增改
    collegeStatus:`${api}/commercial/college/status`, //post  商学院 - 状态
    gradeStatus:`${api}/commercial/grade/status`, //post  商学院 - 年级状态
    commercialGrade:`${api}/commercial/grade`, //post  商学院 - 年级增改
    basicsItem:`${api}/basics/dictionary/item `, //post  字典选项
    collegeMajor:`${api}/commercial/college/major`, //get 关联方向
    company:`${api}/company`, //get 公司列表
    companyRemove:`${api}/company/remove`, //get  公司列表
    companyModify:`${api}/company/modify`, //post  修改公司信息
    companyDetail:`${api}/company/detail`, //get  获取公司信息
    commonConfig:`${api}/common/config`, // get /post 配置管理



}
