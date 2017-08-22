<template>
    <!--内容推送-->
    <div>
        <!--工具条-->
        <div>
            <el-row style="margin: 10px ">
                <el-col :span="12" >
                    <el-radio-group v-model="businessSearch.status" name="status" @change="getbusinesslist" >
                        <el-radio-button label="1" >新数据</el-radio-button>
                        <el-radio-button label="20" >审核通过</el-radio-button>
                        <el-radio-button label="-10" >已取消</el-radio-button>
                        <el-radio-button label="-20" >审核未通过</el-radio-button>
                    </el-radio-group>
                </el-col>

                <el-col v-if="$store.getters.costin_celebrity_apply" :span="6">
                    <el-button size="small" @click="businessRevise" style="padding: 12px 20px;background: white;color: #1f2d3d">新增
                    </el-button>
                </el-col>
            </el-row>
        </div>


        <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc" style="position: fixed;z-index:10"></big-img>

        <el-table :data="BusinessList" highlight-current-row  style="width: 100%;" >
            <!--<el-table-column align="center" prop="id" label="ID" width="70"></el-table-column>-->
            <el-table-column align="center" prop="title" label="标题"
                             width="180"  ></el-table-column>
            <el-table-column align="center" prop="subTitle" label="二级标题"
                             width="180" > </el-table-column>
            <el-table-column align="center" inline-template label="图片地址" width="160" >
                <div>
                    <img :src="row.imageUrl" @click="clickImg($event)" height="80">
                    <!-- 放大图片 -->
                </div>
            </el-table-column>
           <!-- <el-table-column align="center" prop="description" label="详情描述"
                             width="120" >
            </el-table-column>-->
            <el-table-column align="center" prop="targetUrl" label="目标url"
                             width="120" ></el-table-column>

            <el-table-column align="center" prop="actionName" label="事件类型"
                             width="120" ></el-table-column>
            <el-table-column align="center" prop="status" label="状态"
                             width="120" :formatter="formatBuStatus">
            </el-table-column>
            <el-table-column align="center" prop="type" label="推送类型"
                             width="120"
                             :formatter="formatBuType"></el-table-column>
            <el-table-column align="center" prop="reason" label="审核原因"
                             width="120" ></el-table-column>
            <el-table-column align="center" prop="tags" label="指定推送标签"
                             width="120" ></el-table-column>
            <el-table-column align="center" prop="userids" label="指定推送用户"
                             width="120" ></el-table-column>
            <el-table-column align="center" prop="beginTime" label="开始时间"
                             width="170" :formatter="formatbeginTime" >
            </el-table-column>
            <el-table-column align="center" prop="endTime" label="结束时间"
                             width="170" :formatter="formatendTime"></el-table-column>



            <el-table-column  v-if="businessSearch.status==1 && $store.getters.costin_celebrity_apply"  fixed="right" inline-template :context="_self"
                              label="操作" width='350'>
                <span>
                    <el-button  type="info" size="small" @click="businessRevise(row)" >修改</el-button>
                    <el-button  type="info" size="small" @click="businessDetail(row)" >详情</el-button>
                    <el-button  type="success" size="small" @click="agreeBusiness(row)">审核通过</el-button>
                    <el-button  type="danger" size="small"  @click="disagreeBusiness(row)">审核不通过</el-button>
                </span>
            </el-table-column>
            <el-table-column
                    v-if="businessSearch.status!=1&&businessSearch.status!=20"  fixed="right"
                              inline-template :context="_self"
                              label="操作" width='200'>
                <span>
                    <el-button  type="info" size="small" @click="businessRevise(row)" >修改</el-button>
                    <el-button  type="info" size="small"
                                @click="businessDetail(row)" :disable="true">详情
                    </el-button>
                </span>
            </el-table-column>
        </el-table>

        <!--分页-->
        <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
            <pagination
                    :currentpage="pagation.pageIndex"
                    :total="pagation.totalCount"
                    :pagesize="pagation.pageSize"
                    :render="getbusinesslist"
                    :options="filters"
                    style="float:right"
            />
        </el-col>

        <!--增改界面-->
        <el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false" accept-charset="UTF-8">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm"  >
                <el-form-item label="标题" prop="title" >
                    <el-input v-model="editForm.title" auto-complete="off" ></el-input>
                </el-form-item>
                <el-form-item label="二级标题" prop="subTitle">
                    <el-input v-model="editForm.subTitle"  auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片地址" prop="imageUrl">
                    <div style="display: flex">
                        <div style="display:  inline-block">
                            <ali-upload :url.sync="uploadUrl" :multiple="true" :id="uploadId" @aliimgurl=""></ali-upload>
                        </div>
                        <div style="display:inline-block;max-width: 400px;padding-left: 30px;">
                            <img :src="uploadUrl[uploadUrl.length-1]" alt=""
                                 style="width: 100%">
                        </div>

                    </div>
                </el-form-item>
                <el-form-item label="详情描述" prop="description">
                    <el-input type="textarea" v-model="editForm.description" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="事件类型" prop="actionName">
                    <el-select v-model="editForm.actionName"
                               style="width:288px"
                               @change="actionChange">
                        <el-option v-for="item in actionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="editForm.actionName=='h5'" label="目标url" prop="targetUrl" >
                    <el-input v-model="editForm.targetUrl" auto-complete="off" placeholder="请输入h5链接"></el-input>
                </el-form-item>
                <el-form-item label="扩展字段" v-if="this.isExtend">

                    <el-select v-model="extendFiles.name" placeholder=""
                               style="width: 288px" >
                        <el-option v-for="item in extendList"
                                   :key="item.name"
                                   :label="item.name"
                                   :value="item.name"></el-option>
                    </el-select>
                    <el-input v-model="extendFiles.value" auto-complete="off" style="width: 300px" placeholder="若有多个数值请用逗号隔开"></el-input>

                </el-form-item>

                <el-form-item label="推送类型" prop="type">
                    <el-select v-model="editForm.type"
                               style="width:288px" placeholder=""
                               @change="typeChange">
                        <el-option v-for="item in typeList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                    <el-input v-if="editForm.type==2"
                              v-model="editForm.userids"
                              auto-complete="off" placeholder="若有多个数值请用逗号隔开"
                              style="width: 300px"
                    ></el-input>
                    <el-input v-if="editForm.type==3" v-model="editForm.tags"
                               auto-complete="off" placeholder="若有多个数值请用逗号隔开"
                              style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="开始时间" prop="beginTime">
                    <el-date-picker
                            v-model="editForm.beginTime"
                            type="datetime"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="endTime" >
                    <el-date-picker
                            v-model="editForm.endTime"
                            type="datetime"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取 消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import util from '../../common/util'
    import NProgress from 'nprogress'
    import Pagination from 'components/common/Pagination.vue'
    import BigImg from 'components/common/BigImg.vue'
    import aliUpload from 'components/common/aliossupload.vue'
    import { getCache, setCache, formatTimeString,objToArr,containMenu } from 'utils/tool'
    import apiConfig from 'utils/apiConfig'

    export default{
        components: {
            Pagination,
            'big-img':BigImg,
            aliUpload
        },
        data(){
            return{
                BusinessList:[],
                pagation: {
                    pageIndex: 1,
                    pageSize: 20,
                    totalCount: 128,
                },
                filters: {
                    pageSize: 20,
                    pageIndex: 1,
                },
                businessSearch:{
                    status:'1'
                },
                businessDetailobj:{

                },
                //修改页面数据
                editFormVisible:false,//编辑界面显是否显示
                editFormTtile:'新增',//编辑界面标题
                editForm: {
                    id:'',
                    subTitle:'',
                    title:'',
                    imageUrl:'',
                    description:'',
                    targetUrl:'',
                    actionName:'',
                    type:'',
                    userids:'',
                    tags:'',
                    beginTime:'',
                    endTime:''
                },
                editLoading:false,
                btnEditText:'提 交',
                showImg:false,
                imgSrc: '',
                //上传
                uploadUrl:[],
                uploadId:'file',
                uploadCode:0,
                //actionName，extendData联动
                actionList:[
                    {label:'空事件',value:''},
                    {label:'分享',value:'label_share'},
                    {label:' 打开h5页面',value:'h5'},
                    {label:'app功能--完善行业资料',value:'app_user_industry'},
                    {label:'app功能--完善公司资料',value:'app_user_company'},
                    {label:'app功能--完善标签资料',value:'app_user_label '},
                    {label:'app功能--完善专长资料',value:'app_user_expert'},
                    {label:'app功能--绑定微信',value:'app_user_bind_wechat'},
                    {label:'app功能--引导打标签功能',value:'app_label'},
                    {label:'app功能--打开聊天页',value:'app_chat'},
                    {label:'app功能--打开应局详情',value:'app_appoint_detail'},
                    {label:'app功能--打开约局详情',value:'app_need_detail'},
                    {label:'app功能–-进入他的主页',value:'app_home_ta'},
                    {label:'app功能--进入我的主页',value:'app_home_mine'},
                    {label:'app功能--进入个人信息页',value:'app_user_info'}

                ],
                extendList:[],
                extendFiles:{
                    name:'',
                    value:''
                },
                isExtend:false,

                //typeList
                typeList:[
                    {label:'全部用户',value:1},
                    {label:'指定用户',value:2},
                    {label:'按标签',value:3},
                ],
                //验证
                editFormRules: {
                    title: [
                        {required: true, message: '请输入一级标题', trigger: 'blur'},
                        {min:0, max: 50, message: '长度在 0 到 50 个字符', trigger: 'blur'}
                    ],
                    subTitle: [
                        {required: true, message: '请输入二级标题', trigger: 'blur'},
                        {min: 0, max: 50, message: '长度在 0 到 50 个字符', trigger: 'blur'}
                    ],

                }


            }
        },
        watch:{
            uploadCode(val){
                console.log(val)
                console.info(val)
            },
            uploadId(val){
                console.log(val)
            }
        },
        mounted () {
            this.getbusinesslist()
        },
        methods:{
            convertData (original) {
                this.pagation.totalCount = original.totalCount
                this.pagation.pageIndex = original.pageIndex
                this.pagation.pageSize = original.pageSize
                this.filters.pageSize = original.pageSize
                this.BusinessList = original.pageList.map((item) => {
                    return item
                })
            },
            //请求列表
            getbusinesslist(){
                let _this = this
                const req = {}
                for (const key of Object.keys(this.filters)) {
                    if (this.filters[key]) {
                        req[key] = this.filters[key]
                    }
                }
                req.status = this.businessSearch.status
                this.$ajax.get(apiConfig.businessList,req).then((response) => {
                    if (response.data.code == 1) {
                        _this .convertData (response.data.original)
                    }else{
                        var data = JSON.parse(response.data)
                        if(data.code == "11001"){
                            sessionStorage.removeItem('realName')
                            this.$router.push('/login');
                        }
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },
            formatbeginTime:function (row,colum) {
                return  row.beginTime?formatTimeString(row.beginTime):''
            },
            formatendTime:function (row,colum) {
                return  row.endTime?formatTimeString(row.endTime):''
            },
            formatBuStatus:function (row,colum) {
                return row.status==-20?'审核未通过':row.status==-10?'取消':row.status==1?'新数据':row.status==20?'审核通过':"";
            },
            formatBuType:function (row,colum) {
                return row.type==1?'全部用户':row.type==2?'指定用户':row.type==3?'按标签':"";
             },

            //修改、增加
            businessRevise:function (row) {
                this.editFormVisible=true;
                if(row.id){
                    this.editFormTtile='修改';
                    console.log(row)
                    this.editForm= {
                        businessid:row.id,
                        subTitle:row.subTitle,
                        title:row.title,
                        imageUrl:row.imageUrl,
                        description:row.description,
                        targetUrl:row.targetUrl,
                        actionName:row.actionName,
                        type:row.type,
                        userids:row.userids,
                        tags:row.tags,
                        beginTime:row.beginTime,
                        endTime:row.endTime
                    }
                    this.uploadUrl = [row.imageUrl];
                    var actionName = row.extendData
                    if(actionName && actionName!=''&& actionName!='{}'){

                        this.extendList = objToArr(actionName)
                        if(this.extendList.length>1){
                            this.isExtend=true
                        }
                        console.log(this.extendList)
                        this.extendFiles = this.extendList[0]
//                        console.log(actionName,this.extendList,this.isExtend)
                    }
                }else{
                    this.editFormTtile='新增';
                    this.uploadUrl=[];
                    this.editForm= {
                        businessid:'',
                        subTitle:'',
                        title:'',
                        imageUrl:'',
                        description:'',
                        targetUrl:'',
                        actionName:'',
                        type:'',
                        userids:'',
                        tags:'',
                        beginTime:this.GetDateStr(1),
                        endTime:this.GetDateStr(2)
                    }
                }
            },
            editSubmit:function(){

                this.editForm.beginTime = new Date(this.editForm.beginTime).getTime()
                this.editForm.endTime = new Date(this.editForm.endTime).getTime()
                if(this.uploadUrl.length==0){
                    this.editForm.imageUrl='';
                }else{
                    this.editForm.imageUrl = this.uploadUrl[0];
                }



                var type =this.editForm.type;

                if(type&&type==2){
                    var userids = this.editForm.userids
                    if(userids==''){
                        this.$notify({
                            title: '失败',
                            message:'请输入用户ID',
                            type: 'warning'
                        });
                        return
                    }
                }else if(type&&type==3){
                    var tags = this.editForm.tags
                    if(tags==''){
                        this.$notify({
                            title: '失败',
                            message:'请输入标签类型',
                            type: 'warning'
                        });
                        return
                    }
                }
                if(this.isExtend && this.extendFiles.name !='' ){
                    this.editForm[this.extendFiles.name]=this.extendFiles.value;
                }
                var obj= {
                    a:'zhang',
                    b:'shuai'
                }
                var ob={
                    ze:'this.editFor'
                }
                ob[obj.a]=obj.b;
                console.log(ob)

                this.$ajax.post(apiConfig.businessKeeps, this.editFor).then((response)=>{
                    if(response.data.code == 1){
                        this.$notify({
                            title: '成功',
                            message: this.editFormTtile+'成功',
                            type: 'success'
                        });
                        this.editFormVisible=false;
                        this.getbusinesslist();
                    }else {
                        this.$notify({
                            title: '失败',
                            message: response.data.msg,
                            type: 'warning'
                        });
                    }
                }).catch(function(response) {
                    console.log(response)
                })

            },

            //同意审核
            agreeBusiness:function (row) {
                console.log('row',row)
                var businessForm = {
                    businessid:row.id?row.id:'',
                    status:20
                }
                this.$ajax.post(apiConfig.businessApply,businessForm).then((res)=>{
                    if(res.data.code==1){
                        this.$notify({
                            title: '成功',
                            message: '审核成功',
                            type: 'success'
                        });
                        this.getbusinesslist();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.data.msg
                        })
                    }
                })
            },
            disagreeBusiness:function (row) {

                var disBusinessForm ={
                    businessid:row.id?row.id:'',
                    status:-20,
                };
                this.$prompt('不通过原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showInput:true
                }).then(({ value }) => {
                    disBusinessForm.reason=value;

                    this.$ajax.post(apiConfig.businessApply,disBusinessForm).then((response) => {
                        if(response.data.code==1){
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            this.getbusinesslist();
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.data.msg
                            })
                        }
                    }).catch(function(response) {
                        console.log(response)
                    })
                }).catch((res) => {
                    console.log(res)
                });
            },

            businessDetail:function (row) {
                this.$ajax.get(apiConfig.businessDetail,{businessid:row.id}).then((response) => {
                    // 响应成功回调
                    if (response.data.code == 1) {
                        this.businessDetailobj = response.data.original

                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },

            actionChange:function (item) {
                this.extendFiles={name:'', value:''};

                if(item == 'app_appoint_detail'){
                    this.extendList=[{name:'appointid',value:''}]
                    this.isExtend=true
//                    console.log(1,this.isExtend,this.extendList)
                } else if(item =='app_need_detail'){
                    this.extendList=[{name:'needid',value:''}]
                    this.isExtend=true
//                    console.log(2,this.isExtend,this.extendList)
                }else if(item == 'app_chat'){
                    this.extendList=[{name:'conversionid',value:''}]
                    this.isExtend=true
//                    console.log(3,this.isExtend,this.extendList)
                }else if(item == 'app_label'){
                    this.extendList=[{name:'labelid',value:''}]
                    this.isExtend=true
//                    console.log(4,this.isExtend,this.extendList)
                } else {
                    this.isExtend=false
                    this.extendList=[]
//                    console.log(5,this.isExtend,this.extendList)
                }
            },
            typeChange:function (item) {
                console.toLocaleString(item)
            },


            //图片放大
            clickImg(e) {
                this.showImg = true;
                // 获取当前图片地址
                this.imgSrc = e.currentTarget.src;
            },
            viewImg(){
                this.showImg = false;
            },
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