<template>
	<el-tabs style="width:100%;" type="card" @tab-click="handleClick" @tab-remove="handleRemove">
		<el-tab-pane label="用户列表">
			<section>
				<!--工具条-->
				<div>
					<el-row>
						<el-col :span="7" >
							<el-input
									placeholder=""
									v-model="searchList.userid"
									style="max-width:256px"
									size="small" class='fl'
							>
								<template slot="prepend">用户ID</template>
							</el-input>
						</el-col>
						<el-col :span="7">
							<el-input  placeholder="" v-model="searchList.mobilePhone" style="max-width:256px" size="small" class='fl'>
								<template slot="prepend">手机号</template>
							</el-input>
						</el-col>
						<el-col :span="7" class='fl' >
							<span class='el-input-group__prepend'>性别</span>
							<el-select v-model="searchList.gender" class='c-select funtype-select' size="small" >
								<el-option label="全部" value=""></el-option>
								<el-option label="男" value="0"></el-option>
								<el-option label="女" value="1"></el-option>
							</el-select>
						</el-col>
						<el-col :span="7"  >
							<el-input placeholder="" v-model="searchList.realName" style="max-width: 256px;" size="small" class='fl'>
								<template slot="prepend">姓名</template>
							</el-input>
						</el-col>
						<!--<el-col :span="7"  >
							<el-input placeholder="" v-model="searchList.nickName" style="max-width: 256px;" size="small" class='fl'>
								<template slot="prepend">花名</template>
							</el-input>
						</el-col>-->
						<el-col :span="7" class='fl' >
							<span class='el-input-group__prepend'>状态</span>
							<el-select v-model="searchList.status" class='c-select funtype-select' size="small" >
								<el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-col>
						<!--typelist删掉-->
						<el-col :span="12" class='fl'>
							<span class='el-input-group__prepend'>学院届别</span>
							<el-select v-model="searchList.collegeid"
									   name='college' class='c-select'
									   placeholder="请选择商学院" size="small"
									   @change="collegeChange">
								<el-option v-for="item in commercialLists" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
							<el-select v-model="searchList.majorItemid"
									   name='major' class='c-select' placeholder="请选择攻读方向" size="small" @change="majorChange">
								<el-option v-for="item in onMajors" :key="item.id"  :label="item.name" :value="item.id"></el-option>
							</el-select>
							<el-select v-model="searchList.gradeid" name='grade' class='c-select' placeholder="请选择年级" size="small" >
								<el-option v-for="item in onGrades" :key="item.id"  :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-col>

					</el-row>
					<el-row type="flex" justify="center">
						<el-col :span="7">
							<el-button type="primary" @click="search" style="width: 60%;margin-top: 10px;">查询</el-button>
						</el-col>
					</el-row>
				</div>
				<!--列表-->
				<template>
					<el-table  :data="pageList" border highlight-current-row  style="width: 100%;">
						<el-table-column prop="userid" label="用户id" align="center" width="80" ></el-table-column>
						<el-table-column prop="mobilePhone" label="手机号" align="center" width="120" ></el-table-column>
						<el-table-column inline-template label="头像" align="center" width="100">
							<div><img :src="row.headUrl" height="40" width="40"></div>
						</el-table-column>
						<el-table-column  prop="realName" label="姓名" align="center" width="120" ></el-table-column>
						<el-table-column  prop="gender" label="性别" :formatter="formatSex" align="center" width="80"  ></el-table-column>
						<el-table-column  prop="className" label="班级" width="160" align="center" ></el-table-column>
						<el-table-column align="center" prop="statusName" label="状态" width="80" ></el-table-column>

						<el-table-column fixed="right" inline-template :context="_self" label="操作" width="210">
							<span>
								<el-button  type="info" size="small" @click="getDetail(row)">详情</el-button>
								<el-button v-if="row.status == '1'|| row.status =='2'||row.status == '3'" type="danger" size="small" @click="userBan(row)">封禁</el-button>
								<el-button v-if="row.status == '-1'" type="warning" size="small" @click="userBan(row)">解禁</el-button>
								<el-button  type="warning" size="small" @click="reviseEditForm(row)" >修改</el-button>
							</span>
						</el-table-column>
					</el-table>
				</template>
				<!--分页-->
				<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
					<pagination
							:currentpage="pagation.pageIndex"
							:total="pagation.totalCount"
							:pagesize="pagation.pageSize"
							:render="userlist"
							:options="filters"
							style="float:right"
					/>
				</el-col>
			</section>
		</el-tab-pane>

		<!--修改页面-->
		<el-dialog :title="editFormTitle" v-model="editFormVisible" :close-on-click-modal="false" accept-charset="UTF-8">
			<el-form :model="editForm" label-width="80px" ref="editFormRevise" >
				<el-form-item v-if="false" label="用户id" prop="userid" >
					<el-input v-model="editFormRevise.userid" auto-complete="off" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item v-if="false" label="手机号" prop="mobilePhone">
					<el-input v-model="editFormRevise.mobilePhone"  auto-complete="off" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="realName" >
					<el-input v-model="editFormRevise.realName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="花名" prop="nickName">
					<el-input v-model="editFormRevise.nickName" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="性别" prop="gender">
					<el-radio-group v-model="editFormRevise.gender">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="2">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<!--班级四级联动-->

				<el-form-item label="班级" prop="className">
					<el-select v-model="editFormRevise.collegeid"
							   name='college' class='c-select'
							   placeholder="请选择商学院" size="small"
							   @change="collegeChange">
						<el-option v-for="item in commercialLists" :key="item.id"  :label="item.name" :value="item.id"></el-option>
					</el-select>
					<el-select v-model="editFormRevise.majorItemid"
							   name='major' class='c-select' placeholder="请选择攻读方向" size="small" @change="majorChange">
						<el-option v-for="item in onMajors" :key="item.id"  :label="item.name" :value="item.id"></el-option>
					</el-select>
					<el-select v-model="editFormRevise.gradeid" name='grade' class='c-select' placeholder="请选择年级" size="small" >
						<el-option v-for="item in onGrades" :key="item.id"  :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取 消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
			</div>
		</el-dialog>


	</el-tabs>
</template>
<script>
    import NProgress from 'nprogress'
    import Pagination from 'components/common/Pagination.vue'
    import { setCache, getCache,formatTimeString,containMenu } from 'utils/tool'
    import util from '../../common/util'
	import apiConfig from 'utils/apiConfig'

    export default {
        components: {
            Pagination
        },
        data() {
            return {
                userid:{},
                pageList:[],
                pagation: {
                    pageIndex: 1,
                    pageSize: 20,
                    totalCount: 128,
                },
                filters: {
                    pageSize: 20,
                    pageIndex: 1,
                },
                //编辑界面数据
                editForm: {
                    userid:'',
                    mobilePhone: '',
                    nickName: -1,
                    realName:'',
                    gender: '',
                    className:'',
                    year: '',
                    companyId:''
                },

                //查询区
                searchList:{
                    userid:'',
                    gender:'',
                    realName:'',
                    mobilePhone:'',
                    nickName:'',
                    collegeid:'',
                    majorItemid:'',
                    gradeid:'',
                    status:''
                },
				//学院列表
                commercialLists: [],
                //用户类型
                statusList:[
                    {
                        value: '',
                        label: '选择项'
                    },{
                        value: '-2',
                        label: '已删除'
                    }, {
                        value: '-1',
                        label: '已禁封'
                    }, {
                        value: '1',
                        label: '新导入'
                    }, {
                        value: '2',
                        label: '已生成邀请码'
                    }, {
                        value: '3',
                        label: '已激活'
                    }],
                //修改页面数据
                editFormVisible:false,//编辑界面显是否显示
                editFormTitle:'编辑',//编辑界面标题

                //编辑界面数据
                editFormRevise: {
                    userid:'',
                    mobilePhone: '',
                    nickName: '',
                    realName:'',
                    gender: '',
                    collegeid:'',
                    majorItemid:'',
                    gradeid:'',
                    className:''
                },
                editLoading:false,
                btnEditText:'提 交',
            };
        },
        computed: {
            onMajors(){
                if(!this.commercialLists )
                    return
                for (const item of this.commercialLists) {
                    if (this.searchList.collegeid == item.id) {
                        return item.majors
                    }
                    if (this.editFormRevise.collegeid == item.id) {
                        return item.majors
                    }
                }
			},
            onGrades(){
                if( !this.onMajors)
				return
                for (const item of this.onMajors) {
                    if (this.searchList.majorItemid == item.id) {
                        return item.grades
                    }
                    if (this.editFormRevise.majorItemid == item.id) {
                        return item.grades
                    }
                }
            },
           /* onClasses(){
                if(!this.onMajors || !this.onGrades)
                    return
                for (const item of this.onGrades) {
                    if (this.searchList.gradeid == item.id) {
                        return item.classes
                    }
                    if (this.editFormRevise.gradeid == item.id) {
                        return item.classes
                    }
                }
            }*/

        },
        mounted () {
            this.$store.dispatch('changeload', true)
            this.userlist()
            this.getList()
            const realName = getCache({ key: 'realName' })
        },
        methods: {
            //导航切换
            handleRemove(tab) {
                console.log('remove');
            },
            handleClick(tab) {

            },
            convertData (original) {
                this.pagation.totalCount = original.totalCount
                this.pagation.pageIndex = original.pageIndex
                this.pagation.pageSize = original.pageSize
                this.filters.pageSize = original.pageSize
                this.pageList = original.pageList.map((item) => {
                    return item
                })
            },
            //请求列表
            userlist(){
                let _this = this
				//分页
                const req = {}
                for (const key of Object.keys(this.filters)) {
                    if (this.filters[key]) {
                        req[key] = this.filters[key]
                    }
                }
                this.$ajax.get(apiConfig.user,req).then((response) => {
                    // 响应成功回调
                    if (response.data.code == 1) {
                        _this .convertData (response.data.original)
                    }else {
                        sessionStorage.removeItem('realName')
                        this.$router.push('/login');
					}
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },
            //性别显示转换
            formatSex:function(row,column){
                return row.gender==1?'男':row.gender==2?'女':'未知';
            },

            //封禁
            userBan:function (row) {
                const  userid=row.userid
                console.log(userid)
                if(row.status == '1'|| row.status =='2'|| row.status == '3'){
                    //封禁
                    this.$ajax.delete(apiConfig.detail+'?'+ 'userid'+'='+userid ).then((response) => {
                        // 响应成功回调
                        if (response.data.code == 1) {
                            this.userlist()
                        }
                    })
                        .catch(function(response) {
                            console.log(response)
                        })
				}else if (row.status == '-1'){
                    //解禁
                    this.$ajax.post(apiConfig.status+'?'+ 'userid'+'='+ userid   ).then((response) => {
                        // 响应成功回调
                        console.log(response.data)
                        if (response.data.code == 1) {
                            this.userlist()
                        }
                    })
                        .catch(function(response) {
                            console.log(response)
                        })
				}


            },



            getDetail:function (row) {
                /*this.userDetailVisible=true;*/
                const userid = row.userid;
                setCache({
                    key: 'userid',
                    value: userid
                })
                this.$router.push('/UserDetail');

            },



            //search查询
            search: function () {
                // 用户筛选的条件
                let _this = this

				//console.log( this.searchList )
                this.$ajax.get(apiConfig.user,Object.assign(this.filters, this.searchList)).then((response) => {
                    // 响应成功回调
                    console.log(response.data)
                    //要换成未生成邀请码的status
                    if (response.data.code == 1) {
                        _this .convertData (response.data.original)
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },

            //商学院列表
            getList:function () {
                let _this = this
                this.$ajax.get(apiConfig.commercial).then((response) => {
                    // 响应成功回调
                    if (response.data.code == 1) {
						this.commercialData (response.data.original);
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },
            commercialData :function (data) {
                this.commercialLists = data
            },
			//重置商学院
       //selectchange
			collegeChange:function (item) {
				this.searchList.majorItemid='';
				this.searchList.gradeid='';
                this.editFormRevise.majorItemid='';
                this.editFormRevise.gradeid='';
			},
			majorChange:function (item) {
				this.searchList.gradeid='';
                this.editFormRevise.gradeid='';
			},

			//用户修改
            reviseEditForm(row){
                this.editFormVisible=true;
                this.editFormTitle='修改';
                this.editFormRevise = {
                    userid: row.userid,
                    realName: row.realName,
                    gender: row.gender,
                    nickName: row.nickName,
                    collegeid:row.collegeid,
                    majorItemid:row.majorItemid,
                    gradeid:row.gradeid
                }
			},
			//编辑修改
            //编辑
            editSubmit:function(){
                var _this=this;
                _this.$refs.editFormRevise.validate((valid)=>{
                    if(valid){
                        _this.$confirm('确认提交吗？','提示',{}).then(()=>{
                            _this.editLoading=true;
                            NProgress.start();
                            _this.btnEditText='提交中';
                            setTimeout(function(){
                                _this.editLoading=false;
                                NProgress.done();
                                _this.btnEditText='提 交';
                                _this.editFormVisible = false;
								_this.$ajax.post(apiConfig.detail, _this.editFormRevise).then((response) => {
                                        // 响应成功回调
                                        console.log(response.data)
                                        if (response.data.code == 1) {
                                            _this.$notify({
                                                title: '成功',
                                                message: '提交成功',
                                                type: 'success'
                                            });
                                            _this.userlist()
                                        }else{
                                            _this.$notify({
                                                title: '错误',
                                                message: response.data.msg,
                                                type: 'warning'
                                            });
										}
                                    })
                                        .catch(function(response) {
                                            console.log(response)
                                        })

                            },1000);
                        });

                    }
                });

            },

        }
    };
</script>
<style>
	.toolbar {
		background: #fff;
		padding: 10px 10px 0px 10px;
	}
	.fl{
		float: left;
		margin-right: 40px;
		margin-bottom: 10px;
	}
	.el-input-group__prepend {
		width: 80px;
		font-size: 14px;
		text-align: center;
		padding: 0;
	}
	.c-select {
		display: table-cell;
	}

	.funtype-select {
		max-width: 175px;
	}

	.clearfix:after {
		display: table;
		clear: both;
		content: '';
	}
	.txt-detail{
		float: left;
		list-style:none;
		margin:0;
	}
	.txt-detail li{
		float: left;
		font-size:16px;
		width: 450px;
	}
	.el-table .info-row {
		color: grey;
		background: gainsboro;
	}
	.detaile-chesses{
		float: left;
		list-style: none;
		display: inline-block;
	}
	.detaile-chesses li{
		border: 1px solid gainsboro;
		padding: 3px 10px ;
		float: left;
		color: black;
	}
	.detaile-chesses .detaile-chesses-name {
		background: gainsboro;
		padding: 3px 10px ;
		color: #000000;
		line-height: 24px;
	}



</style>