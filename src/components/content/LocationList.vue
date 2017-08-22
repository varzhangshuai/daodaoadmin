<template>
    <div>
        <!--工具条-->
        <div>
            <el-row style="margin: 10px ">
                <el-col :span="12" >
                    <el-radio-group v-model="searchList.status" name="status" @change="getlocationlist" >
                        <el-radio-button label="1" >待审核</el-radio-button>
                        <el-radio-button label="20" >审核通过</el-radio-button>
                        <el-radio-button label="-10" >已取消</el-radio-button>
                        <el-radio-button label="-20" >审核未通过</el-radio-button>
                    </el-radio-group>
                </el-col>

                <el-col :span="6">
                    <el-button  size="small" @click="locationRevise" style="padding: 12px 20px;background: white;color: #1f2d3d">新增
                    </el-button>
                </el-col>
            </el-row>
        </div>

        <el-table :data="locationList" highlight-current-row  style="width: 100%;" >
            <el-table-column align="center" prop="id" label="ID" width="70"></el-table-column>
            <el-table-column align="center" prop="name" label="位置"
                             width="180"  ></el-table-column>
            <el-table-column align="center" prop="remark" label="备注"
                             width="180" > </el-table-column>

            <el-table-column align="center" prop="count" label="数量"
                             width="160" ></el-table-column>
            <el-table-column align="center" prop="status" label="状态"
                             width="120" :formatter="formatInStatus"> </el-table-column>
            <el-table-column align="center" prop="reason" label="原因"
                             width="120" ></el-table-column>

            <el-table-column  fixed="right" inline-template :context="_self" label="操作" :width='this.searchList.status==1?($store.getters.costin_position_apply ?330:120):180'>
                <span>
                    <el-button v-if="$store.getters.costin_position_apply" type="info" size="small" @click="locationRevise(row)" >修改</el-button>
                    <el-button  type="info" size="small" @click="locationDetail(row)" >碎片列表</el-button>
                    <span v-if="searchList.status==1 && $store.getters.costin_position_apply">
                        <el-button  type="success" size="small" @click="agreeLocation(row)">审核通过</el-button>
                        <el-button  type="danger" size="small" @click="disagreeLocation(row)">审核不通过</el-button>
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
                    :render="getlocationlist"
                    :options="filters"
                    style="float:right"
            />
        </el-col>

        <!--增改界面-->
        <el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false" accept-charset="UTF-8">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm" >
                <el-form-item label="碎片id" prop="locationid" >
                    <el-input v-model="editForm.locationid" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="显示数量" prop="count">
                    <el-input v-model="editForm.count"  auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="remark" >
                    <el-input v-model="editForm.remark" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="扩展字段">
                    <div v-for="item in extendFields" style="margin-bottom: 10px">
                        <el-select v-model="item.name" placeholder=""
                                   style="width: 288px"  @change="extendChange">
                            <el-option label="选择扩展字段"
                                       value=""></el-option>
                            <el-option label="labelid" value="labelid"></el-option>
                            <el-option label="appointid" value="appointid"></el-option>
                            <el-option label="needid" value="needid"></el-option>
                            <el-option label="conversion_id" value="conversion_id"></el-option>
                        </el-select>
                        <el-input v-model="item.value" auto-complete="off" style="width: 300px" placeholder="若有多个数值请用逗号隔开"></el-input>
                    </div>
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
    import NProgress from 'nprogress'
    import Pagination from 'components/common/Pagination.vue'
    import { formatTimeString,setCache,objToArr,changeSelect,containMenu } from 'utils/tool'
    import util from '../../common/util'
    import apiConfig from 'utils/apiConfig'

    export default{
        components: {
            Pagination
        },

        data(){
            return{
                locationList:[],
                pagation: {
                    pageIndex: 1,
                    pageSize: 20,
                    totalCount: 128,
                },
                filters: {
                    pageSize: 20,
                    pageIndex: 1,
                },
                searchList:{
                    status:'20'
                },

                //修改
                //修改页面数据
                editFormVisible:false,//编辑界面显是否显示
                editFormTtile:'新增',//编辑界面标题
                //编辑界面数据
                editForm: {
                    locationid:'',
                    count:'',
                    name:'',
                    remark:'',
                },
                extendFields:[{
                    name:'',
                    value:''
                }],

                editLoading:false,
                btnEditText:'提 交',
                editFormRules:{
                    name:[
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                }
            }
        },
        computed:{

        },
        mounted(){
            this.getlocationlist()
        },
        methods:{
            convertData (original) {
                this.pagation.totalCount = original.totalCount
                this.pagation.pageIndex = original.pageIndex
                this.pagation.pageSize = original.pageSize
                this.filters.pageSize = original.pageSize
                this.locationList = original.pageList.map((item) => {
                    return item
                })
            },
            //请求列表
            getlocationlist(){
                let _this = this
                const req = {}
                for (const key of Object.keys(this.filters)) {
                    if (this.filters[key]) {
                        req[key] = this.filters[key]
                    }
                }
                var obj = Object.assign(req,this.searchList );
                this.$ajax.get(apiConfig.locationList,req).then((response) => {
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
            //状态转换

            formatInStatus:function (row,colum) {
                return row.status==-20?'审核未通过':row.status==-10?'取消':row.status==1?'待审核':row.status==20?'审核通过':"";
            },

            //location详情
            locationDetail:function (row) {
                var locationid = row.id
                setCache({
                    key: 'locationid',
                    value: locationid
                })
                this.$router.push('/locationDetail');
            },
            //修改、增加
            locationRevise:function (row) {
                if(row.id){
                    this.editFormVisible=true;
                    this.editFormTtile='修改 ';
                    this.editForm= {
                        'locationid':row.id,
                        'count':row.count,
                        'name':row.name,
                        'remark':row.remark,
                    }

                    var extendStr = row.extendFields;
                    if(extendStr && extendStr!= '{}'){
                        this.extendFields = objToArr(extendStr)
                    }else {
                        this.extendFields = [{ name: '', value: ''}];
                    }

                }else{
                    this.editFormTtile='新增';
                    this.extendFields = [{ name: '', value: ''}];
                    this.editFormVisible=true;
                }
            },
            editSubmit:function(){
                if (this.extendFields.length>1){
                    this.extendFields.pop();
                    for (var i in this.extendFields){
                        this.editForm[this.extendFields[i].name]=this.extendFields[i].value
                    }
                }
                this.$ajax.post(apiConfig.locationKeeps,this.editForm).then((response)=>{
                    if(response.data.code == 1){
                        this.$notify({
                            title: '成功',
                            message: this.editFormTtile+'成功',
                            type: 'success'
                        });
                        this.editFormVisible = false;
                        this.getlocationlist();
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
            agreeLocation:function (row) {
                var agreeForm = {
                    locationid:row?row.id:'',
                    status:20
                }
                this.$ajax.post(apiConfig.locationApply,agreeForm).then((res)=>{
                    if(res.data.code==1){
                        this.$notify({
                            title: '成功',
                            message: '审核成功',
                            type: 'success'
                        });
                        this.getlocationlist();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.data.msg
                        })
                    }
                })
            },
            disagreeLocation:function (row) {

                var disagreeForm = {
                    locationid:row?row.id:'',
                    status:-20
                };
                this.$prompt('不通过原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showInput:true
                }).then(({ value }) => {
                    disagreeForm.reason=value;
                    this.$ajax.post(apiConfig.locationApply,disagreeForm).then((response) => {
                        if(response.data.code==1){
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            this.getlocationlist();
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

            //拓展字段动态添加
            extendChange:function (item) {
                var add = true;
                var len = this.extendFields.length;
                if(len==1 && this.extendFields[len-1].name==''){
                    add = false;
                }
                if(len!=1 && this.extendFields[len-1].name==''){
                    add = false;
                }
                var extendItem = {
                    name:'',
                    value:''
                }
                if(len>1){
                    for(var i=0;i<len-1;i++){

                        var name = this.extendFields[i].name

                        var n = 0;
                        if(name==''|| !name){
                            n++
                        }
                        for(var j=i+1; j<len;j++){
                            if(this.extendFields[j].name == name){
                                this.$message({
                                    type: 'error',
                                    message: '选择扩展项重复'
                                })
                                if(n==0){
                                    this.extendFields[j].name = ''
                                }else if(n==1)(
                                    this.extendFields.splice(j,1)
                                )


                                add = false;
                                return
                            }
                        }
                    }
                }
//                console.log(this.extendFields)
                if(add){
                    this.extendFields.push(extendItem)
                }

            }
        }
    }
</script>