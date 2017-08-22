<template>
    <div class="mt40">
        <el-row style="margin:10px">

            <el-col :span="6" >
                <el-input placeholder="" v-model="searchList.userid" style="max-width:256px" size="small" class='fl'>
                    <template slot="prepend">用户ID</template>
                </el-input>
            </el-col>
            <el-col :span="5" >
                <el-radio-group v-model="searchList.status" @change="clearsearch" >
                    <el-radio-button label="1"  >待审核</el-radio-button>
                    <el-radio-button label="20" >审核通过</el-radio-button>
                </el-radio-group>
            </el-col>
            <el-col :span="5">
                <el-button type="primary" @click="search" style="width: 30%;">查询</el-button>
            </el-col>
        </el-row>
        <el-row type="flex" justify="left" style="margin-left:10px;">
            <el-col :span="4">
                <el-button size="small" @click="starAdd" style="padding: 12px 50px;background: white;color: #1f2d3d;">新增</el-button>
            </el-col>
        </el-row>
        <!--   红人列表   -->
        <!--  表格  -->
        <el-table :data="starList" stripe border style="width: 100%; margin-top:30px" >
            <el-table-column prop="userid" label="用户id" width="80"></el-table-column>
            <el-table-column prop="userName" label="用户名称" width="130"></el-table-column>
            <el-table-column prop="userPhone" label="用户手机号" width="130"></el-table-column>
            <el-table-column prop="code" label="代码" width="180"></el-table-column>
            <el-table-column prop="companyName" label="公司名称" width="260"></el-table-column>
            <el-table-column prop="url" label="活动地址" width="220"></el-table-column>
            <el-table-column prop="ctime" label="申请时间" width="180" :formatter="formatendTime"></el-table-column>
            <el-table-column prop="status" label="状态" width="100" :formatter="formatInStatus"></el-table-column>
            <el-table-column fixed="right" prop="status"  v-model="status" inline-template :context="_self" label="操作" width="400">
                  <span>
                      <el-button type="info" size="small"  @click="starModify(row)" >修改</el-button>
                      <el-button type="info" size="small"  @click="starDetail(row)" >详情</el-button>
                      <el-button type="info" size="small"  @click="addDemand(row)" >添加需求</el-button>
                      <el-button style="background: #13ce66;color: white;border:none" size="small"  @click="examInfo(row)" v-if="row.status==1">审核</el-button>
                     <!-- <el-button style="background: #ff4949;color: white" size="small"  @click="Offline(row)" v-if="searchList.status==21">下线</el-button>-->
                      <el-button style="background: #20a0ff;color: #fff; border:none" size="small"  @click="addRedsinfor(row)" v-if="row.status==20 || row.status==1 ">红人内容</el-button>
                  </span>
            </el-table-column>

        </el-table>
        <!--    表格  End-->
        <!--分页-->
        <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
            <pagination
                    :currentpage="pagation.pageIndex"
                    :total="pagation.totalCount"
                    :pagesize="pagation.pageSize"
                    :render="search"
                    :options="filters"
                    style="float:right"
            />
        </el-col>
        <!--  新增红人弹框 -->
        <el-dialog title="添加红人" :close-on-click-modal="false" v-model="editFormVisible">
            <el-form :model="editForm">
                <el-form-item label="用户id" prop="userid" label-width="180px">
                    <el-input v-model="editForm.userid" auto-complete="off" style="width:60%"></el-input>
                    <el-button  type="info" size="small"  @click="choseComp" >选择公司</el-button>
                    <el-form-item  label="请选择公司" label-width="100px">
                        <el-radio-group v-model="editForm.companyid">
                            <el-radio class="radio" v-for="item in companyValue" :key="item.id" :value="item.id" :label="item.id">{{item.name}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="活动链接" prop="url"  label-width="180px">
                    <el-input v-model="editForm.url" auto-complete="off"  style="width:60%"></el-input>
                </el-form-item>
                <el-form-item label="活动代码" prop="code"  label-width="180px">
                    <el-input v-model="editForm.code" auto-complete="off"  style="width:60%"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" >确 定</el-button>
            </div>
        </el-dialog>
        <!--   修改页面   -->
        <el-dialog title="修改红人信息" :close-on-click-modal="false" v-model="modifyFormVisible" >
            <el-form :model="modForm">
                <el-form-item label="用户id" prop="userid" label-width="180px">
                    <el-input v-model="modForm.userid" auto-complete="off" :disabled="true" style="width:60%"></el-input>
                </el-form-item>
                <el-form-item label="活动链接" prop="url"  label-width="180px">
                    <el-input v-model="modForm.url" auto-complete="off" style="width:60%"></el-input>
                </el-form-item>
                <el-form-item label="活动代码" prop="code"  label-width="180px">
                    <el-input v-model="modForm.code" auto-complete="off" style="width:60%"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="modifyFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="modySubmit" :loading="editLoading">确 定</el-button>
            </div>
        </el-dialog>
        <!--   审核页面   -->
        <el-dialog title="审核红人信息" :close-on-click-modal="false" v-model="applyFormVisible" >
            <el-form :model="applyForm">
                <el-form-item label="活动链接" prop="url" label-width="180px" >
                    <el-input v-model="applyForm.url" auto-complete="off"  :disabled="true" style="width:60%"></el-input>
                </el-form-item>
                <el-form-item label="活动代码" prop="code" label-width="180px" >
                    <el-input v-model="applyForm.code" auto-complete="off"  :disabled="true" style="width:60%"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="agreeInfro" >审核通过</el-button>
                <el-button type="primary" @click.native="disagreeInfro" >不通过</el-button>
            </div>
        </el-dialog>
        <!--   详情页面 弹框  -->
        <el-dialog title="详情信息" :close-on-click-modal="false" v-model="detaFormVisible" >
            <ul class="txt-detail" style="margin-bottom:30px;">
                <li><span class='data-el-form'>用户ID</span><span class='el-detail-content'>{{ userDetail.userid }}</span></li>
                <li><span class='data-el-form'>姓名</span><span class='el-detail-content'>{{ userDetail.userName }}</span></li>
                <li><span class='data-el-form'>手机号</span><span class='el-detail-content'>{{ userDetail.userPhone }}</span></li>
                <li><span class='data-el-form'>公司</span><span class='el-detail-content'>{{ userDetail.companyName  }}</span></li>
                <li><span class='data-el-form'>状态名</span><span class='el-detail-content' >{{ userDetail.status }}</span></li>
                <li><span class='data-el-form'>活动地址</span ><span class='el-detail-content'>{{ userDetail.url }}</span></li>
                <li><span class='data-el-form'>活动代码</span><span class='el-detail-content'>{{ userDetail.code }}</span></li>
            </ul>
        </el-dialog>

        <!--   添加需求   -->
        <el-dialog title="添加红人需求" :close-on-click-modal="false" v-model="demandFormVisible"  size="large" >
            <el-table  :data="needList" border style="width: 100%;" max-height="550" @selection-change="handleSelectionChange" >
                <el-table-column align="center" type="selection" width="55"></el-table-column>
                <el-table-column align="center" prop="realName" label="姓名" width="150" ></el-table-column>
                <el-table-column align="center" prop="className" label="年级" width="150" ></el-table-column>
                <el-table-column align="center" prop="permitName" label="权限类型名称" width="150"></el-table-column>
                <el-table-column align="center" prop="description" label="描述" width="520"> </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="demandFormVisible = false">取 消</el-button>
                <el-button type="primary" @click.native="submitNeed" >确 定</el-button>
            </div>
        </el-dialog>
    </div>

</template>
<script>
    import Pagination from 'components/common/Pagination.vue'
    import { formatTimeString,getCache,setCache,objToArr,changeSelect } from 'utils/tool'
    import util from '../../common/util'
    import apiConfig from 'utils/apiConfig'
    export default{
        components: {
            Pagination
        },
        data(){
            return{
                id:'',
                pagation:{
                    pageIndex: 1,
                    pageSize: 20,
                    totalCount: 128,
                },
                filters:{
                    pageSize: 20,
                    pageIndex: 1,
                },
                searchList:{
                    userid:'',
                    status:''
                },
                typeList:[
                    {
                        value: '1',
                        label: '待审核'
                    },{
                        value: '20',
                        label: '审核通过'
                    }],
                userDetail:{ },  //详情页
                starList:[],
                needList:[],
                editLoading:false,    //加载
                editFormVisible:false ,   //编辑页面是否显示
                modifyFormVisible:false,    //修改页面是否显示
                detaFormVisible:false,       //详情页面是否显示
                applyFormVisible:false,     //审核页面是否显示
                demandFormVisible:false,    //需求页面是否显示
                starFormVisible:false,    //紅人内容页面是否显示
                editForm:{              //增加的信息
                    userid:'',
                    url:'',
                    code:'',
                    companyid:'',
                },
                modForm:{
                    userid:'',
                    code:'',
                    url:'',

                },
                applyForm:{
                    userid:'',
                    code:'',
                    url:'',
                    status:'',
                },
                companyValue:[],
                demandList:{
                    userid:'',
                    needid:'',
                    channelid:'',
                    labelid:'',
                    type:'',
                    permit:'',
                    status:'',
                },
                //勾选框
                multipleSelection: [],

                celebrityid:'', //红人id

            }
        },
        mounted(){
            //console.log('0',this.filters)
        },
        methods:{
            convertData(original) {
                this.pagation.totalCount = original.totalCount
                this.pagation.pageIndex = original.pageIndex
                this.pagation.pageSize = original.pageSize
                this.filters.pageSize = original.pageSize
                this.starList = original.pageList.map((item) =>{
                    return item;
                })

            },
            //时间戳转换
            formatendTime:function (row,colum) {
                return  row.regTime?formatTimeString(row.regTime):''
            },
            //状态转换
            formatInStatus:function (row,colum) {
                return row.status==1?'待审核':row.status==20?'审核通过':"";
            },
            //清空状态
            clearsearch:function(){
                this.starList=[];
            },
            //清空组件缓存
            deactivated(){
                this.$destroy(true)
            },
            //详情跳转
            addRedsinfor:function (row) {
                const objectid =row.id;
                const companyid =row.companyid;
                const personalMain = row.personalMain;
                setCache({
                    key: 'objectid',
                    value: objectid
                })
                setCache({
                    key: 'companyid',
                    value: companyid
                })
                setCache({
                    key: 'filters',
                    value: this.filters
                })
                this.$router.push('/starContent');
            },
            //用户查询
            search:function(){
                let _this = this;
                var searchList = this.searchList;
                var filters  = this.filters;
                var postForm = Object.assign(searchList,filters)
                this.$ajax.get(apiConfig.celebrityList,postForm).then((response) => {
                    //console.log('获取列表',response.data);
                    if (response.data.code == 1){
                        if(response.data.original.itemCount==0){
                            this.$message('暂无数据');
                        }
                        _this.convertData (response.data.original)

                    }else{
                        this.$message(response.data.msg);
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },

            //新增
            starAdd:function () {
                this.editFormVisible =true;
                var _this=this;
                this.companyValue=[];
                _this.editForm={
                    userid:'',
                    url:'',
                    code:'',
                    companyid:'',
                };

            },
            //选择公司
            choseComp:function(){
                let _this = this;
                const  userid = this.editForm.userid;
                if(userid==''){
                    this.$message('请输入用户id');
                    return
                }
                this.$ajax.get(apiConfig.companyList,{userid:userid}).then((response) => {
                    if(response.data.code ==1){
                        if(response.data.original.length==0){
                            this.$message(response.data.msg);
                        }
                        this.companyValue = response.data.original;
                    }else{
                        this.$message(response.data.msg);
                    }
                })
            },
            //提交新增红人
            editSubmit:function(){
                var _this = this;
                if(!this.editForm.userid){
                    this.$message.error('请输入用户id！');
                    return
                }
                if(!this.editForm.url){
                    this.$message.error('请输入活动链接！');
                    return
                }
                if(!this.editForm.companyid){
                    this.$message.error('请选择公司！');
                    return
                }
                if(!this.editForm.code){
                    this.$message.error('请输入活动代码！');
                    return
                }
                this.$ajax.get(apiConfig.celebrityAdd,this.editForm).then((response)=>{
                    if(response.data.code == 1){
                        _this.editFormVisible = false;
                        _this.$notify({
                            title: '成功',
                            message: '提交成功',
                            type: 'success'
                        });
                        this.search();
                    }else if(response.data.code == 10008){
                        _this.editFormVisible = false;
                        this.$message({
                            title: '失败',
                            type: 'error',
                            message: '该用户已申请',
                        })
                    }else if(response.data.code == 10005){
                        this.$message({
                            title: '失败',
                            type: 'error',
                            message: '该用户不存在',
                        })
                    }else{
                        _this.editFormVisible = false;
                        this.$message({
                            title: '失败',
                            type: 'error',
                            message: response.data.msg,
                        })
                    }
                }).catch(function(response){
                    console.log(response)
                })
            },
            //修改
            starModify:function (row) {
                this.modifyFormVisible =true;
                var _this=this;
                this.modForm = {
                    celebrityid:row.id,
                    userid:row.userid,
                    url:row.url,
                    code:row.code,
                    companyid:row.companyid,
                }
            },
            //提交修改
            modySubmit:function(row){
                var _this = this;
                if(!this.modForm.url){
                    this.$message.error('请输入活动链接！');
                    return
                }
                if(!this.modForm.code){
                    this.$message.error('请输入活动代码！');
                    return
                }
                this.$ajax.post(apiConfig.celebritymod,this.modForm).then((response)=>{
                    console.log(response.data);
                    if(response.data.code == 1){
                        console.log(response.data);
                        _this.modifyFormVisible = false;
                        _this.$notify({
                            title: '成功',
                            message: '提交成功',
                            type: 'success'
                        });
                        this.search();
                    }
                }).catch(function(response){
                    console.log(response)
                })
            },
            //详情
            starDetail:function (row) {
                let _this = this
                this.detaFormVisible = true;
                const  celebrityid = row.id
                this.$ajax.get(apiConfig.celebrityDeta,{ celebrityid:celebrityid }).then((response)=>{
                    console.log(response.data);
                    if(response.data.code == 1){
                        console.log(response.data);
                        this.userDetail = response.data.original;
                         this.celebrityid  = this.userDetail.id
                        this.userDetail.status = this.userDetail.status==1?'待审核':this.userDetail.status==20?'审核通过':"";
                    }
                })
            },
            //审核
            examInfo:function(row){
                this.applyFormVisible = true;
                this.applyForm = {
                    celebrityid: row.id,
                    url: row.url,
                    code: row.code,
                    companyid:row.companyid,
                }
            },
            //审核通过
            agreeInfro:function(row){
                let _this = this;
                this.applyForm['status']=20
                this.$ajax.get(apiConfig.celebrityApply,this.applyForm).then((response)=>{
                    console.log(response.data);
                    if(response.data.code == 1){
                        console.log(response.data);
                        _this.applyFormVisible = false;
                        _this.$notify({
                            title: '成功',
                            message: '提交成功',
                            type: 'success'
                        });
                        this.search();
                    }
                }).catch(function(response){
                    console.log(response)
                })

            },
            //审核不通过
            disagreeInfro:function(){
                let _this = this
                this.applyForm['status'] = -20
                this.$prompt('不通过原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showInput:true
                }).then(({ value }) => {
                    this.applyForm['auditReason'] = value;
                        this.$ajax.get(apiConfig.celebrityApply,this.applyForm).then((response) => {
                            if(response.data.code==1){
                                _this.applyFormVisible = false;
                                _this.$notify({
                                    title: '成功',
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.search();
                            }else if(value==null || value==''){
                                this.$message({
                                    type: 'error',
                                    message: '原因不能为空'
                                })
                            }
                        }).catch(function(response) {
                            console.log(response)
                        })

                }).catch((res) => {
                    console.log(res)
                });
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //添加需求
            addDemand:function(row){
                this.demandFormVisible=true;
                console.log(this.filters)
                var userid = row.userid;
                var postForm = {userid:userid,permit:1}
                postForm= Object.assign(this.filters, postForm);
                this.$ajax.get(apiConfig.needList,postForm).then((response)=>{
                    if (response.data.code==1){
                        this.needList = response.data.original.pageList.map((item) =>{
                            item.celebrityid = row.id;
                            return item;
                        })
                    }else{
                        _this.$message({
                            type: 'error',
                            message: response.data.msg
                        })
                    }
                })

            },
            //提交需求
            submitNeed:function () {
                let _this = this;
                var needidArr = []
                var celebrityid = 0;
                this.multipleSelection.map((item) => {
                    needidArr.push(item.needid);
                    celebrityid = item.celebrityid;
                })
                this.addNeed={
                    celebrityid:celebrityid,
                    celebrityNeeds:needidArr.join(',')
                }
                this.$ajax.post(apiConfig.celebrityAddneed,this.addNeed).then((response)=>{
                    if (response.data.code==1){
                        _this.demandFormVisible=false;
                        _this.$notify({
                            title: '成功',
                            message: '提交成功',
                            type: 'success'
                        });
                        this.search();
                    }else{
                        _this.demandFormVisible=false;
                        _this.$message({
                            type: 'error',
                            message: response.data.msg
                        })
                    }
                }).catch((response) => {
                    console.log(response)
                });
            },


            //时间问题
            GetDateStr:function (AddDayCount) {
                var dd = new Date();
                dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
                console.log(dd)
                var y = dd.getFullYear();
                var m = dd.getMonth()+1;//获取当前月份的日期
                var d = dd.getDate();

                return y+"-"+m+"-"+d ;
            }
        }

    }
</script>
<style>
    class-a{
        width: 60px;
        height: 40px;
    }
    class-b{
        width: 480px;
        height: 320px;
    }
    .pic-detail{
        width:100px;
        height:80px;
    }
    .head-cont{padding:10px 0; clear: both}
    .starData{ display:block; margin-top:20px; color:#20a0ff; cursor: pointer; width:160px; margin-right:50px;}
    .data-el-form{
        display: inline-block;
        width: 150px;
        line-height: 24px;
        color: #333333;
        padding:6px 10px;
    }
</style>