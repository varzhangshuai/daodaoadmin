<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm card-box loginform">
    <h3 class="title">系统登录</h3>
    <el-form-item >
      <el-input type="text" v-model="ruleForm2.loginName" auto-complete="off" placeholder="账号" name="loginName"></el-input>
    </el-form-item>
    <el-form-item >
      <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码" name="password"></el-input>
    </el-form-item>
    <el-form-item >
      <el-input type="text"  style="width:68%;vertical-align:middle"  v-model="ruleForm2.verifyCode" auto-complete="off" placeholder="验证码" ></el-input>
      <img :src="imgSrc" @click="refreshImg" alt="" style="width: 28%;height:
      36px; vertical-align:middle;" >
      <!--http://test.admin.daodaoclub.com-->
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="submit" >登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { getCache, setCache,containMenu,containButton }from 'utils/tool'
  import apiConfig from 'utils/apiConfig'
  import md5 from "js-md5"

  export default {
    data() {
      return {
          markEnter: 1, // 防止多次enter
          ruleForm2:{
              loginName: '',
              password:'',
              verifyCode:''
          },
        rules2: {
            loginName: [
            { required: true, message: '请输入账号', trigger: 'blur' },
//            { validator: validaePass } 表单验证后期加
          ],
            password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
//            { validator: validaePass2 }
          ]
        },
          time: 0,
          imgSrc:'/costin/adminapi/verify',
          routes:this.$router.options.routes
      };
    },
      watch:{
          '$route' (to, from) {//监听路由改变
              this.$router.push('/welcome');
          }
      },
      mounted(){
          const realName = getCache({ key: 'realName' })
          if(realName!=false) {
              this.$router.push('/welcome');
          }else if(realName == false){
              this.$router.push('/login');
          }
          document.addEventListener('keyup', this.listenEnter)
      },
      computed:{
          codeTxt() {
              return this.time > 0 ? this.time + 's' : '获取验证码'
          }
      },
    methods: {
        notsendcode(){
            this.$notify({
              title: '成功',
              message: '验证码已发送！',
              type: 'success'
			});
        },
        //验证码倒计时
        timer() {
            if (this.time > 0) {
                this.time = this.time - 1
                setTimeout(this.timer, 1000)
            }
        },

        refreshImg(){
            var time = new Date().getTime();
            this.imgSrc += "?_time="+time;
        },

      submit() {
            this.load = true
            if (!this.ruleForm2.loginName || !this.ruleForm2.verifyCode || !this.ruleForm2.password) {
                this.$message({
                    type: 'error',
                    message: '请输入账号密码或验证码'
                })
                this.load = false
                return false
            }
          var ruleForm = this.ruleForm2;
          ruleForm.password = md5(ruleForm.password)
          this.$ajax.post(apiConfig.login,ruleForm).then((response) => {
              // 响应成功回调
              if(response.data.code==1){
                  setCache({
                      key: 'realName',
                      value: response.data.original.realName
                  })
                  var id = response.data.original.id
                  this.$ajax.get(apiConfig.menu,{empid:id}).then((res) =>{
                      if(res.data.code==1){
                          var menus =res.data.data
                          setCache({
                              key: 'authlist',
                              value: menus
                          })
                          this.getMenu(menus)
                      }
                  }).catch(function(res) {
                      console.log(res)
                  })

                  this.markEnter = 1
              }else if (response.data.code==20007){
                  this.$message({
                      showClose: true,
                      type: 'error',
                      message: '验证码错误',
                  })
                  this.ruleForm2.password='';
                  this.refreshImg();
              }else{
                  this.$message({
                      showClose: true,
                      type: 'error',
                      message: response.data.msg,
                  })
                  this.ruleForm2.password='';
                  this.refreshImg();
              }
          }).catch(function(response) {
                  console.log(response)
              })
        },
        //enter
        listenEnter (e) {
            if (e.keyCode === 13 && this.markEnter === 1 && this.ruleForm2.loginName && this.ruleForm2.password && this.ruleForm2.verifyCode) {
                this.markEnter = 2
                this.submit()
            }
        },

        //新建权限路由
        getMenu:function (menus) {
            this.routes[2].hidden = containMenu('costin_user_info',menus);
            this.routes[3].hidden = containMenu('costin_need_info',menus);
            this.routes[4].hidden = containMenu('costin_business',menus);
            this.routes[5].hidden = containMenu('costin_daily_total',menus);
            this.routes[6].hidden = containMenu('costin_basics_info',menus);

            //用户权限
            for(var i in this.routes[2].children){
                if(this.routes[2].children[i].hidden=='costin_user_info'){
                    this.routes[2].children[i].hidden=containMenu('costin_user_info',menus);
                }
                if(this.routes[2].children[i].hidden=='costin_user_manager'){
                    this.routes[2].children[i].hidden=containMenu('costin_user_manager',menus);
                }
                if(this.routes[2].children[i].hidden=='costin_register_browse'){
                    this.routes[2].children[i].hidden=containMenu('costin_register_browse',menus);
                }
                if(this.routes[2].children[i].hidden=='costin_userinfo_apply'){
                    this.routes[2].children[i].hidden=containMenu('costin_userinfo_apply',menus);
                }
                if(this.routes[2].children[i].hidden=='costin_user_import'){
                    this.routes[2].children[i].hidden=containMenu('costin_user_import',menus);
                }
                if(this.routes[2].children[i].hidden=='costin_user_repeated'){
                    this.routes[2].children[i].hidden=containMenu('costin_user_repeated',menus);
                }

            }

            //需求权限
            for(var i in this.routes[3].children){
                if(this.routes[3].children[i].hidden=='costin_need_info'){
                    this.routes[3].children[i].hidden=containMenu('costin_need_info',menus);
                }
                if(this.routes[3].children[i].hidden=='costin_need_unreg_recommend'){
                    this.routes[3].children[i].hidden=containMenu('costin_need_unreg_recommend',menus);
                }

            }
            //运营权限
            for(var i in this.routes[4].children){
                if(this.routes[4].children[i].hidden=='costin_business'){
                    this.routes[4].children[i].hidden=containMenu('costin_business',menus);
                }
                if(this.routes[4].children[i].hidden=='costin_celebrity_info'){
                    this.routes[4].children[i].hidden=containMenu('costin_celebrity_info',menus);
                }
                if(this.routes[4].children[i].hidden=='costin_business_push'){
                    this.routes[4].children[i].hidden=containMenu('costin_business_push',menus);
                }
                if(this.routes[4].children[i].hidden=='costin_sms_manager'){
                    this.routes[4].children[i].hidden=containMenu('costin_sms_manager',menus);
                }
            }

            //配置权限
            for(var i in this.routes[6].children){

                if(this.routes[6].children[i].hidden=='costin_commercial_manager'){
                    this.routes[6].children[i].hidden=containMenu('costin_commercial_manager',menus);
                }
                if(this.routes[6].children[i].hidden=='costin_company_manager'){
                    this.routes[6].children[i].hidden=containMenu('costin_company_manager',menus);
                }

            }

            var buttons = new Object();
            for (var i in menus){
                var code = menus[i].code
                buttons[code] = true
            }

            this.$store.dispatch('changeMenu', this.routes);
            this.$store.dispatch('changeButton', buttons);

            this.$router.push('/welcome');
            setCache({
                key: 'menu',
                value: this.routes
            })
        },
    },
      destroyed () {
          document.removeEventListener('keyup', this.listenEnter)
      }
  }
</script>

<style scoped>
  .card-box {
    padding: 20px;
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    background-color: #F9FAFC;
    width: 400px;
    height: 310px;
    border: 2px solid #8492A6;
    position: fixed;
    margin: auto;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .title:before{
    background: url(../assets/logo0.png);
  }
  
  .loginform {
    width: 350px;
    padding: 35px 35px 15px 35px;
  }
</style>