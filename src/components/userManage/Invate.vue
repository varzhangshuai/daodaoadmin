<template>
	<el-tabs style="width:100%;" type="card" @tab-click="handleClick" @tab-remove="handleRemove">
		<el-tab-pane label="邀请码管理">
			<!--工具条-->
			<div>
				<el-row>
					<el-col :span="7" >
						<span class='el-input-group__prepend'>状态</span>
						<el-select v-model="searchList.status" class='c-select ' size="small" >
							<el-option label="请选择" value=""></el-option>
							<el-option label="待生成验证码" value="1"></el-option>
							<el-option label="已生成验证码" value="2"></el-option>
							<el-option label="已激活" value="3"></el-option>
						</el-select>
					</el-col>
					<el-col :span="7">
						<el-input  placeholder="" v-model="searchList.mobilePhone" style="max-width:256px" size="small" class='fl'>
							<template slot="prepend">手机号</template>
						</el-input>
					</el-col>
					<el-col :span="7"  >
						<el-input placeholder="" v-model="searchList.realName" style="max-width: 256px;" size="small" class='fl'>
							<template slot="prepend">姓名</template>
						</el-input>
					</el-col>
				</el-row>

				<el-row type="flex" justify="center">
					<el-col :span="7">
						<el-button type="primary" @click="search" style="width: 60%;margin-top: 10px;">查询</el-button>
					</el-col>
				</el-row>
			</div>

			<div class="block">
				<span class="wrapper">
					<div style="float:left;margin-bottom: 10px; margin-right: 10px ">
						<el-button size="small" type="success" :disabled="multipleSelection.length > 0 ? false : true"  @click.native="allAakeInvate(index-1)" >批量生成邀请码</el-button>
					</div>
					<div style="float:left;margin-bottom: 10px; margin-right: 10px ">
						<el-button size="small" type="success" :disabled="multipleSelection.length > 0 ? false : true"  @click.native="allAakeRegist(index-1)" >批量直接注册</el-button>
					</div>
					<div style="float:left;margin-bottom: 10px; margin-right: 10px ;width:140px ">
						<el-upload
								action="costin/adminapi/user/import"
								:multiple="false"
								:show-upload-list="false"
								:before-upload="handleBeforeupload"
								:on-progress="upProgress"
								:on-success="upSuccess"
								:on-error="onError">
					 		 <el-button size="small" type="primary">EXCEL导入用户信息</el-button>
						</el-upload>
					</div>
					<div  style="float:left;margin-bottom: 10px; margin-right: 10px">
						<el-button size="small" type="danger">示例模版下载</el-button>
					</div>

					<div  style="float:left;margin-bottom: 10px;">
						<el-button size="small" type="info"  @click="handleAdd">新增</el-button>
					</div>

			  	</span>
			</div>
			<template>
				<el-table  :data="pageList" highlight-current-row  style="width: 100%;" @selection-change="handleSelectionChange">
					<!--selection-change判断勾选框的变化-->
					<el-table-column align="center" type="selection" width="55"></el-table-column>
					<el-table-column align="center" prop="userid" label="用户id" width="120" ></el-table-column>
					<el-table-column align="center" prop="mobilePhone" label="手机号" width="150" > </el-table-column>
					<el-table-column align="center" prop="typeName" label="用户类型" width="120" >
					</el-table-column>
					<el-table-column inline-template label="头像" align="center" width="100">
						<div><img :src="row.headUrl" height="40" width="40"></div>
					</el-table-column>
					<!--<el-table-column align="center" prop="nickName" label="花名" width="120" ></el-table-column>-->
					<el-table-column align="center" prop="realName" label="姓名" width="120" ></el-table-column>
					<el-table-column align="center" prop="gender" label="性别" :formatter="formatSex" width="100"  ></el-table-column>
					<el-table-column align="center" prop="className" label="班级" width="240" ></el-table-column>
					<el-table-column align="center" prop="companyId" label="公司" width="120" > </el-table-column>

					<el-table-column align="center" prop="inviteStatus" label="邀请状态" :formatter="formatInStatus" width="160" ></el-table-column>
					<el-table-column align="center" prop="inviteCode" label="邀请码" width="120" > </el-table-column>

					<el-table-column fixed="right" inline-template :context="_self" label="操作" width="200">
								<span>
								<el-button  type="info" size="small" @click="makeInvate(row)" >生成邀请码</el-button>
								<el-button  type="warning" size="small" @click="handleEdit(row)" >修改</el-button>
							</span>
					</el-table-column>

					</el-table>
			</template>

<!--分页-->
<el-col :span="24" class="toolbar" style="         padding-bottom:10px;">
	<pagination
			:currentpage="pagation.pageIndex"
			:total="pagation.totalCount"
			:pagesize="pagation.pageSize"
			:render="userlist"
			:options="filters"
			style="float:right"
	/>
</el-col>

</el-tab-pane>

		<!--修改页面-->
		<el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false" accept-charset="UTF-8">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm" >
				<el-form-item label="用户id" prop="userid" >
					<el-input v-model="editForm.userid" auto-complete="off" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="注册手机号" prop="mobilePhone">
					<el-input v-model="editForm.mobilePhone"  auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="花名" prop="nickName">
					<el-input v-model="editForm.nickName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="realName" >
					<el-input v-model="editForm.realName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="gender">
					<el-radio-group v-model="editForm.gender">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="2">女</el-radio>
					</el-radio-group>
				</el-form-item>

				<!-- 班级四级联动 -->
				<el-form-item label="班级" prop="className">
					<el-select v-model="editForm.collegeid" name='college' class='c-select' placeholder="请选择商学院" size="small" >
						<el-option v-for="item in commercialLists" :key="item.id"  :label="item.name" :value="item.id"></el-option>
					</el-select>
					<el-select v-model="editForm.majorItemid" name='major' class='c-select' placeholder="请选择攻读方向" size="small" >
						<el-option v-for="item in onMajors" :key="item.id"  :label="item.name" :value="item.id"></el-option>
					</el-select>
					<el-select v-model="editForm.gradeid" name='grade' class='c-select' placeholder="请选择年级" size="small" >
						<el-option v-for="item in onGrades" :key="item.id"  :label="item.name" :value="item.id"></el-option>
					</el-select>
					<el-select v-model="editForm.classesid" name='class' class='c-select' placeholder="请选择班级" size="small" >
						<el-option v-for="item in onClasses" :key="item.id"  :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="类型" prop="type" >
					<el-select v-model="editForm.type" class='c-select funtype-select' size="small" >
						<el-option v-for="item in typeList" :key="item.value"  :label="item.label" :value="item.value"></el-option>
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
    import { formatTimeString} from 'utils/tool'
    import util from '../../common/util'
    import apiConfig from 'utils/apiConfig'
  	export default {
        components: {
          Pagination
      },
    data() {
        return {
           btnEditText:'提交',
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
			//修改页面数据
            editFormVisible:false,//编辑界面显是否显示
            editFormTtile:'编辑',//编辑界面标题
            editLoading:false,
            //编辑界面数据
            editForm: {
                userid:'',
                mobilePhone: '',
                nickName: '',
                realName:'',
                gender: '',
                classesid: '',
                collegeid:'',
                majorItemid:'',
                gradeid:'',
				type:'',
                className:''
            },
			//班级列表
            commercialLists:[],
			//用户类型
            typeList:[
                {
                    value: '',
                    label: '选择项'
                },{
                    value: '1',
                    label: '邀请类型'
                }, {
                    value: '2',
                    label: '推荐用户'
                }, {
                    value: '3',
                    label: '注册用户'
                }, {
                    value: '200',
                    label: '测试'
                }, {
                    value: '300',
                    label: '管理员'
                }],

            editFormRules:{
                name:[
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ]
            },
			//查询区
            searchList:{
                status:'1',
                mobilePhone:'',
                realName:''
            },
			//勾选框
            multipleSelection: [],

			//alert提示
			alertTxt:{}
        };
    },
        computed: {
            onMajors(){
                if(!this.commercialLists )
                    return
                for (const item of this.commercialLists) {
                    if (this.editForm.collegeid == item.id) {
                        return item.majors
                    }
                }
            },
            onGrades(){
                if( !this.onMajors)
                    return
                for (const item of this.onMajors) {
                    if (this.editForm.majorItemid == item.id) {
                        return item.grades
                    }
                }
            },
            onClasses(){
                if(!this.onMajors || !this.onGrades)
                    return
                for (const item of this.onGrades) {
                    if (this.editForm.gradeid == item.id) {
                        return item.classes
                    }
                }
            },
			//alertTxt

        },
      mounted () {
          this.$store.dispatch('changeload', true)
          this.userlist()

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
                item.registerTime = item.registerTime != 0 ? formatTimeString(item.registerTime) : '--'
                item.loginTime = item.loginTime != 0 ? formatTimeString(item.loginTime) : '--'
                return item
            })
        },
        //请求列表
        userlist(){
            let _this = this
            const req = {}
            for (const key of Object.keys(this.filters)) {
                if (this.filters[key]) {
                    req[key] = this.filters[key]
                }
            }
            const obj = Object.assign(req,this.searchList );

            this.$ajax.get(apiConfig.user,obj).then((response) => {
                // 响应成功回调
                console.log('邀请码列表',response.data)
				//要换成未生成邀请码的status
                if (response.data.code == 1){
                    _this .convertData (response.data.original)
                }else if(response.data.code == "11001"){
                    sessionStorage.removeItem('realName')
                    this.$router.push('/login');
                }
            })
                .catch(function(response){
                    console.log(response)
                })
        },
        //性别显示转换
        formatSex:function(row,column){
            return row.gender==1?'男':row.gender==2?'女':'未知';
        },
        formatInStatus:function (row,colum) {
            return row.inviteStatus==1?'新数据':row.inviteStatus==2?'已分配':row.inviteStatus==3?'已发送':row.inviteStatus==4?'已使用':"";
        },
		//图片转换

		// 上传excel
        handleBeforeupload (file) {
          const fileName = file.name
          const fileType = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length)
          if (fileType != 'xls') {
              this.$message({
                  type: 'error',
                  message: '只能上传.xls格式文件',
                  duration: 1500
              })
              return false
          }
          else {
              this.$store.dispatch('changeload', true)
              return true
          }
        },
        upProgress(file,fileList){
            this.$message({
                showClose: true,
                message: '上传中，请稍后',
                duration: 1500,
            })
		},
        upSuccess (file, fileList) {
            if(file.code=='1'){
                this.alertTxt  = file.original.replace('<br/>','\n')
                this.$message({
                    showClose: true,
					type:'success',
                    message: this.alertTxt,
                    duration: 5000,
                })
                this. userlist();
			}else{
                this.$message({
                    showClose: true,
                    type:'error',
                    message: file,
                    duration: 5000,
                })
			}

        },
        onError (err, file, fileList) {
            console.log(err, file, fileList);
            this.$store.dispatch('changeload', true)
            this.initInput = true
            this.$message({
                type: 'error',
                message: '上传失败,请重新上传',
                duration: 1500
            })
        },
		//生成邀请码
        makeInvate:function (row){
            this.userid = {userid : row.userid}
            this.$ajax.post(apiConfig.invite, this.userid ).then((response) => {
                // 响应成功回调
                if (response.data.code == 1){
                    console.log('发送验证码成功',response.data)
                    this.$notify({
                        title: '成功',
                        message: '发送邀请码成功',
                        type: 'success'
                    });
                    this.userlist()
                }
            })
                .catch(function(response) {
                    console.log(response)
                })
        },
        //直接注册

        //勾选框
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //批量生成邀请码
        allAakeInvate (code) {
            var idArr = []
            this.multipleSelection.map((item) => {
                idArr.push(item.userid)
            })
            console.log('批量生成', idArr,{ useridid: idArr.join(',') })
            this.makeInvate({ userid: idArr.join(',') })
            this.multipleSelection = []
        },
		//批量注册
        allAakeRegist(code){
            var idArr = []
            this.multipleSelection.map((item) => {
                idArr.push(item.userid)
            })

			var userid = { userids: idArr.join(',') }
            this.$ajax.post(apiConfig.registed, userid ).then((response) => {
                // 响应成功回调
                if (response.data.code == 1) {
                    console.log('直接注册成功',response.data)
                    this.$notify({
                        title: '成功',
                        message: '直接注册成功',
                        type: 'success'
                    });
                    this.userlist();
                }
            })
                .catch(function(response) {
                    console.log(response)
                })
            this.multipleSelection = []
		},

        //显示修改界面
        handleEdit:function(row){
            this.editFormVisible=true;
            this.editFormTtile='修改';
            this.editForm = {
                userid: row.userid,
                mobilePhone: row.mobilePhone,
                realName: row.realName,
                gender: row.gender == 1 ? '男' : '女',
                nickName: row.nickName,
                classesid: row.classesid,
                collegeid:row.collegeid,
                majorItemid:row.majorItemid,
                gradeid:row.gradeid,
				type:'',
            }
            this.getList();
        },
        //编辑
        editSubmit:function(){
            var _this=this;
            _this.$refs.editForm.validate((valid)=>{
                if(valid){
                    _this.$confirm('确认提交吗？','提示',{}).then(()=>{
                        _this.editLoading=true;
                        NProgress.start();
                        _this.btnEditText='提交中';
                        setTimeout(function(){
                            _this.editLoading=false;
                            NProgress.done();
                            _this.btnEditText='提 交';
                            _this.$notify({
                                title: '成功',
                                message: '提交成功',
                                type: 'success'
                            });
                             _this.editFormVisible = false;
                            if(_this.editForm.userid ==''){
                                _this.$ajax.post(apiConfig.user, _this.editForm).then((response) => {
                                    // 响应成功回调
                                    console.log(response.data)
                                    if (response.data.code == 1){
                                        console.log('新增')
                                     }
                                })
                                    .catch(function(response) {
                                        console.log(response)
                                    })
                                //新增
                            }else{
                                //编辑
                                _this.$ajax.post(apiConfig.detail, _this.editForm).then((response) => {
                                    // 响应成功回调
                                    console.log(response.data)
                                    if (response.data.code == 1) {
                                        console.log('修改')
                                        this.userlist()
                                    }
                                })
                                    .catch(function(response) {
                                        console.log(response)
                                    })
							}
						},1000);
					});

                }
            });

        },
        //显示新增界面
        handleAdd:function(){
            var _this=this;
            this.editFormVisible=true;
            this.editFormTtile='新增';
            this.editForm = {
                mobilePhone:'',
                realName: '',
                gender: '',
                nickName: '',
                classesid:'',
                type:'',
                classesid:'',
                collegeid:'',
                majorItemid:'',
                gradeid:'',
            }
            this.getList();
        },
		//search查询
        search: function () {
            // 用户筛选的条件
            let _this = this
            this.$ajax.get(apiConfig.user,this.searchList).then((response) => {
                //要换成未生成邀请码的status
                if (response.data.code == 1) {
                    console.log('查询',response.data)
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
                    console.log('商学院列表',this.commercialLists)
                }
            })
                .catch(function(response) {
                    console.log(response)
                })
        },
        commercialData :function (data) {
            this.commercialLists = data
        }


    }
  }
</script>
<style>
	.block {
		margin-bottom: 10px;
	}
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
	.el-input__inner{
		border-radius:  0 4px 4px 0 !important;
	}

</style>