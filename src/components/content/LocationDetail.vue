<template>
    <div>
        <!--工具条-->
        <div>
            <el-row style="margin: 10px ">
                <el-col :span="12" >
                    <el-radio-group v-model="chipSearch.status" name="status" @change="chiplist" >
                        <el-radio-button label="1" >待审核</el-radio-button>
                        <el-radio-button label="20" >审核通过</el-radio-button>
                        <el-radio-button label="-10" >已取消</el-radio-button>
                        <el-radio-button label="-20" >审核未通过</el-radio-button>
                    </el-radio-group>
                </el-col>

                <el-col :span="6" v-if="$store.getters.costin_position_manager">
                    <el-button size="small" @click="chipRevise" style="padding: 12px 20px;background: white;color: #1f2d3d">新增
                    </el-button>
                </el-col>
            </el-row>
        </div>
        <ul  class="location-detail clearfix">
            <li><span>位置:</span>{{ locationDetail.name }}</li>
            <li><span>扩展字段:</span>{{ locationDetail.extendFields }}</li>
            <li><span>备注:</span>{{ locationDetail.remark }}</li>
            <li><span>理由:</span>{{ locationDetail.reason }}</li>
            <li><span>状态:</span>{{ locationDetail.status | statusFiler }}</li>
            <li><span>数量:</span>{{ locationDetail.count }}</li>
        </ul>

        <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc" style="position: fixed;z-index:10"></big-img>
        <el-table :data="chipList" highlight-current-row  style="width: 100%;" >
            <el-table-column align="center" prop="title" label="标题" width="120" ></el-table-column>
            <el-table-column align="center" prop="subTitle" label="二级标题" width="180" > </el-table-column>
            <el-table-column align="center" inline-template label="图片地址" width="160" >
                <div>
                    <img :src="row.imageUrl" @click="clickImg($event)"
                         height="80">
                    <!-- 放大图片 -->
                </div>
            </el-table-column>
            <el-table-column align="center" prop="description" label="详情描述" width="120" > </el-table-column>
            <el-table-column align="center" prop="targetUrl" label="目标url" width="120" ></el-table-column>
            <el-table-column align="center" prop="actionName" label="事件类型" width="120" > </el-table-column>
            <el-table-column align="center" prop="reason" label="原因" width="120" ></el-table-column>
            <el-table-column align="center" prop="userid" label="目标用户id" width="120" > </el-table-column>
            <el-table-column align="center" prop="order" label="排序" width="120" ></el-table-column>
            <el-table-column align="center" prop="beginTime" label="开始时间" width="170" :formatter="formatbeginTime" ></el-table-column>
            <el-table-column align="center" prop="endTime" label="结束时间" width="170" :formatter="formatendTime"></el-table-column>
            <el-table-column align="center" prop="extendData" label="扩展字段" width="125" ></el-table-column>
            <el-table-column fixed="right" inline-template :context="_self" label="操作" :width="this.chipSearch.status=='1' && $store.getters.costin_position_apply?300:110">
                <span>
                    <el-button v-if="$store.getters.costin_position_manager" type="info" size="small" @click="chipRevise(row)" >修改</el-button>
                    <span v-if="chipSearch.status==1 && $store.getters.costin_position_manager">
                        <el-button  type="success" size="small" @click="agreeChip(row)">审核通过</el-button>
                        <el-button  type="danger" size="small" @click="disagreeChip(row)">审核不通过</el-button>
                    </span>
                </span>
            </el-table-column>
        </el-table>

        <!--分页-->
        <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
            <pagination
                    :currentpage="pagation.pageIndex"
                    :total="pagation.totalCount"
                    :pagesize="pagation.pageSize"
                    :render="chiplist"
                    :options="filters"
                    style="float:right"
            />
        </el-col>

        <!--增改界面-->
        <el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false" accept-charset="UTF-8">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm" >
                <el-form-item label="标题" prop="title" >
                    <el-input v-model="editForm.title" auto-complete="off" ></el-input>
                </el-form-item>
                <el-form-item label="二级标题" prop="subTitle">
                    <el-input v-model="editForm.subTitle"  auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片地址" prop="imageUrl">
                    <el-input v-model="editForm.imageUrl"  auto-complete="off"></el-input>
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
                <el-form-item label="详情描述" prop="description" >
                    <el-input v-model="editForm.description" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="目标" prop="targetUrl">
                    <el-input v-model="editForm.targetUrl" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="事件类型" prop="actionName">
                   <el-select v-model="editForm.actionName"
                              style="width:288px" placeholder=""
                              @change="actionChange">
                       <el-option v-for="item in actionList"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"></el-option>
                   </el-select>
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
                <el-form-item label="排序" prop="order" >
                    <el-input  style="width: 200px" v-model="editForm.order"
                               auto-complete="off"></el-input>
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
                <el-button type="primary" @click.native="editSubmit"
                           :loading="editLoading">{{ btnEditText }}</el-button>
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
                locationDetail:{},
                chipDetailobj:{},
                chipList:[],
                pagation: {
                    pageIndex: 1,
                    pageSize: 20,
                    totalCount: 128,
                },
                filters: {
                    pageSize: 20,
                    pageIndex: 1,
                },
                chipSearch:{
                    status:'20'
                },
                locationid:'',

                //修改页面数据
                editFormVisible:false,//编辑界面显是否显示
                editFormTtile:'新增',//编辑界面标题
                //编辑界面数据
                editForm: {
                    id:'',
                    locationid:'',
                    subTitle:'',
                    title:'',
                    imageUrl:'',
                    description:'',
                    targetUrl:'',
                    actionName:'',
                    userid:'',
                    order:'',
                    beginTime:'',
                    endTime:''
                },
                editLoading:false,
                btnEditText:'提 交',
                editFormRules:{
                    title:[
                        { required: true, message: '请输入标题', trigger: 'blur' }
                    ]
                },
                showImg:false,
                imgSrc: '',
                //上传
                uploadUrl:[],
                uploadId:'file',
                uploadCode:0,

                //actionName，extendData联动
                actionList:[
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
            }
        },
        watch:{
            uploadCode(val){

            },
            uploadId(val){

            },
            uploadUrl(val){
                var len = val.length
                this.editForm.imageUrl=val[len-1]
            },
            'editForm.imageUrl':{
                handler:function(val,oldVal){
                    if(val){
                        this.uploadUrl.push(val)
                    }
                },
                deep:true
            }
        },
        filters:{
          statusFiler:function (value) {
              return value==-20?'审核未通过':value==-10?'取消':value==1?'待审核':value==20?'审核通过':"";
          }
        },

        mounted () {
            this.locationid = getCache({ key: 'locationid' });
            this.getDetail();
            this.chiplist()
        },

        methods:{
            getDetail:function(){
                this.$ajax.get(apiConfig.locationDetail,{locationid:this.locationid}).then((response) => {
                    // 响应成功回调
                    if (response.data.code == 1) {
                        this.locationDetail=response.data.original
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },
            convertData (original) {
                this.pagation.totalCount = original.totalCount
                this.pagation.pageIndex = original.pageIndex
                this.pagation.pageSize = original.pageSize
                this.filters.pageSize = original.pageSize
                this.chipList = original.pageList.map((item) => {
                    return item
                })
            },
            //请求列表
            chiplist(){
                let _this = this
                const req = {}
                for (const key of Object.keys(this.filters)) {
                    if (this.filters[key]) {
                        req[key] = this.filters[key]
                    }
                }
                var obj = Object.assign(req,this.searchList );
                obj.locationid=this.locationid
                obj.status = this.chipSearch.status
                this.$ajax.get(apiConfig.chipList,req).then((response) => {
                    // 响应成功回调

                    //要换成未生成邀请码的status
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


            //修改、增加
            chipRevise:function (row) {
                this.editFormVisible=true;
                if(row.id){
                    this.editFormTtile='修改';
                    this.editForm= {
                        chipid:row.id,
                        locationid:row.locationid,
                        subTitle:row.subTitle,
                        title:row.title,
                        imageUrl:row.imageUrl,
                        description:row.description,
                        targetUrl:row.targetUrl,
                        actionName:row.actionName,
                        userid:row.userid,
                        order:row.order,
                        beginTime:row.beginTime,
                        endTime:row.endTime
                    }
                    this.uploadUrl[this.uploadUrl.length-1] = row.imageUrl

                    var actionName = row.extendData
                    console.log(actionName)
                    if(actionName && actionName!='' && actionName!='{}'){
                        this.extendList = objToArr(actionName)
                        if(this.extendList.length>1){
                            this.isExtend=true
                        }
                        this.extendFiles = this.extendList[0]
//                        console.log(actionName,this.extendList,this.isExtend)
                    }
                }else{
                    this.editFormTtile='新增';
                    this.editForm= {
                        chipid:'',
                        locationid:this.locationid,
                        subTitle:'',
                        title:'',
                        imageUrl:'',
                        description:'',
                        targetUrl:'',
                        actionName:'',
                        userid:'',
                        order:'',
                        beginTime:this.GetDateStr(1),
                        endTime:this.GetDateStr(2)
                    };
                    this.uploadUrl=[]
                }
            },
            editSubmit:function(){

                this.editForm.beginTime = new Date(this.editForm.beginTime).getTime()
                this.editForm.endTime = new Date(this.editForm.endTime).getTime()

                if(this.isExtend && this.extendFiles.name !='' ){
                    this.editForm[this.extendFiles.name]=this.extendFiles.value;
                }

                this.$ajax.post(apiConfig.chipKeeps, this.editForm).then((response)=>{
                    if(response.data.code == 1){
                        this.$notify({
                            title: '成功',
                            message: this.editFormTtile+'成功',
                            type: 'success'
                        });
                        this.editFormVisible=false;
                        this.chiplist();
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
            agreeChip:function (row) {
                var chipForm = {
                    chipid:row?row.id:'',
                    status:20
                }
                this.$ajax.post(apiConfig.chipApply,chipForm).then((res)=>{
                    if(res.data.code==1){
                        this.$notify({
                            title: '成功',
                            message: '审核成功',
                            type: 'success'
                        });
                        this.chiplist();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.data.msg
                        })
                    }
                })
            },
            disagreeChip:function (row) {
                var dischipForm = {
                    chipid:row?row.id:'',
                    status:-20
                }

                this.$prompt('不通过原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showInput:true
                }).then(({ value }) => {
                    dischipForm.reason=value;
                    this.$ajax.post(apiConfig.chipApply,dischipForm).then((response) => {
                        if(response.data.code==1){
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            this.chiplist();
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

            chipDetail:function (row) {
                this.$ajax.get(apiConfig.chipDetail,{chipid:row.id}).then((response) => {
                    // 响应成功回调
                    if (response.data.code == 1) {
                        this.chipDetailobj = response.data.original
                        console.log(this.chipDetailobj)
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },

            //isExtend 联动
            actionChange:function (item) {
                if(item == 'app_appoint_detail'){
                    this.extendList=[{name:'appointid',value:''}]
                    this.isExtend=true
                    console.log(1,this.isExtend,this.extendList)
                } else if(item =='app_need_detail'){
                    this.extendList=[{name:'needid',value:''}]
                    this.isExtend=true
                    console.log(2,this.isExtend,this.extendList)
                }else if(item == 'app_chat'){
                    this.extendList=[{name:'conversionid',value:''}]
                    this.isExtend=true
                    console.log(3,this.isExtend,this.extendList)
                }else if(item == 'app_label'){
                    this.extendList=[{name:'labelid',value:''}]
                    this.isExtend=true
                    console.log(4,this.isExtend,this.extendList)
                } else {
                    this.isExtend=false
                    this.extendList=[]
                    console.log(5,this.isExtend,this.extendList)
                }
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
<style>
    .location-detail{
        list-style: none;
        background: #F2F2F2;
    }
    .location-detail li{
        display:  inline-block;
        float: left;
        padding: 5px 10px;
        background: #5e7382;
        color: white;

    }
    .location-detail li span{
        color: #f2f2f2;
        padding: 5px;
    }

</style>