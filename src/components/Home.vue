<template>
	<el-row class="panel">
		<el-col :span="24" class="panel-top">
			<router-link to="/welcome">
				<el-col :span="10" style="font-size:26px;">
					<img src="../assets/logo0.png" class="logo"> <span>AD<i style="color:#20a0ff">MIN</i></span>
				</el-col>
			</router-link>

			<el-col :span="14" class="panel-top">
				<el-tooltip class="item tip-logout" effect="dark" content="退出" placement="bottom" style="padding:0px;">
					<i class="fa fa-sign-out" aria-hidden="true" @click="logout"></i>
				</el-tooltip>
				<el-tooltip class="item tip-logout" effect="dark" content="后退" placement="bottom" style="padding:0px;">
					<i class="el-icon-caret-top" aria-hidden="true" @click="backed"></i>
				</el-tooltip>
				<el-tooltip class="item tip-logout" effect="dark" content="刷新" placement="bottom" style="padding:0px;">
					<i class="el-icon-check" aria-hidden="true" @click="winReload"></i>
				</el-tooltip>
			</el-col>
		</el-col>
		<el-col :span="24" class="panel-center">
			<!--<el-col :span="4">-->
			<aside style="width:200px; ">
				<h5 class="admin"><i class="fa fa-user" aria-hidden="true" style="margin-right:5px;"></i>欢迎系统管理员：{{ realName }}</h5>
				<el-menu style="border-top: 1px solid #475669; " :default-active="currentPath" class="el-menu-vertical-demo" theme="dark" unique-opened router>
					<template v-for="(item,index) in routes.menu" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf" >
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :key="child.path" :index="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
			</aside>
			<!--</el-col>-->
			<!--<el-col :span="20" class="panel-c-c">-->
			<section class="panel-c-c">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" style="margin-bottom:15px;">
						<strong style="width:200px;float:left;color: #475669;">{{currentPathName}}</strong>
						<el-breadcrumb separator="/" style="float:right;">
							<el-breadcrumb-item :to="{ path: '/user' }">daodao</el-breadcrumb-item>
							<el-breadcrumb-item v-if="currentPathNameParent!=''">{{currentPathNameParent}}</el-breadcrumb-item>
							<el-breadcrumb-item v-if="currentPathName!=''">{{currentPathName}}</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" style="background-color:#fff;box-sizing: border-box;">
						<!--<transition name="fade">-->
							<router-view></router-view>
						<!--</transition>-->
					</el-col>
				</div>
			</section>
			<!--</el-col>-->
		</el-col>
	</el-row>
</template>

<script>
   import { getCache,containMenu }from 'utils/tool'
   import apiConfig from 'utils/apiConfig'

  export default {
    data() {
      return {
          routes:this.$store.state.menu,
          realName:'',
		  currentPath: this.$route.fullPath,
          currentPathName:this.$route.name,
          currentPathNameParent:this.$route.matched[0].name,
      }
    },
	watch: {
		'$route' (to, from) {//监听路由改变
			//console.log(this.$route)
			this.currentPath=to.path;
			this.currentPathName=to.name;
			this.currentPathNameParent=to.matched[0].name;
		}
	},
    mounted() {
          this.realName = getCache({ key: 'realName' })
			this.goLogin();
      },
    methods: {
			//返回认证
			goLogin(){
			  if(!this.routes.menu||this.routes.menu.length===0){
			      var menus = getCache({key:'menu'})
				  if(!menus){
                      this.$router.push('/login');
				  }
                  this.$store.dispatch('changeMenu', menus);
			  }
			},
			//退出登录
			logout:function(){
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
                    this.$ajax.delete(apiConfig.login).then((response) => {
                            if (response.data.code==1){
                                sessionStorage.removeItem('realName')
                                this.$router.push('/login');
                            }
                        }).catch((response) => {
                        console.log(response)
                    });
                })
			},
        //刷新页面
        backed:function () {
          	window.history.pushState(null, document.title, 'http://dev.daodaoclub.com/#/date')
        },
        winReload:function(cond){
            window.location.reload();
        }
    }
  }
</script>

<style scoped>
	.panel {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
	}
	
	.panel-top {
		height: 60px;
		line-height: 60px;
		vertical-align: middle;
		background: #1F2D3D;
		color: #c0ccda;
	}
	
	.panel-center {
		background: #324057;
		position: absolute;
		top: 60px;
		bottom: 0px;
		/*overflow: hidden;*/
	}
	
	.panel-c-c {
		background: #f1f2f7;
		position: absolute;
		right: 0px;
		top: 0px;
		bottom: 0px;
		left: 200px;
		overflow-y: scroll;
		padding: 20px;
	}
	
	.logout {
		background: url(../assets/logout_36.png);
		background-size: contain;
		width: 20px;
		height: 20px;
		float: left;
	}
	
	.logo {
		width: 40px;
		float: left;
		margin: 10px 10px 10px 18px;
	}
	
	.tip-logout {
		float: right;
		margin: 20px;
	}
	
	.tip-logout i {
		cursor: pointer;
	}
	
	.admin {
		color: #c0ccda;
		text-align: center;
	}
</style>