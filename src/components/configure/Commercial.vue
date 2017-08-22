    <template>
        <div>
            <el-col :span="24">
                <el-button size="small" @click="collegeAdd" style="padding: 12px 50px;background: white;color: #1f2d3d;">新增</el-button>
            </el-col>
            <el-table :data="commercialDate" border >
                <el-table-column type="expand">
                    <template scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <span style="margin:10px 10px;">类型选择</span>
                            <el-select  style="width:46% ; display:inline-block;margin-top: 20px" class='c-select' v-model="typeList" placeholder="请选择类型">
                                <el-option v-for="item in typeName" :key="item.value"  :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <el-button size="small" @click="collectMajor(props)" style="padding: 12px 50px;background: white;color: #1f2d3d;">关联方向</el-button>
                            <el-table :data="props.row.majors" highlight-current-row border style="width:90%">
                                <el-table-column type="expand">
                                    <template scope="props">
                                        <el-form label-position="left" inline class="demo-table-expand">
                                            <div class="major-direct" style="font-weight: bold">
                                                <span>年级</span><span style="margin-left: 105px">排序</span>
                                                <span style="margin-left: 115px">状态</span>
                                                <span class="tool-defind">操作</span>
                                                <span class="addGrade" @click="addGrade(props)">新增+</span>
                                            </div>
                                            <div class="major-direct cl" v-for="item in props.row.grades">
                                                <span style="width: 140px;display:inline-block">{{item.name}}</span>
                                                <span style="width: 140px;display:inline-block">{{item.gradeIndex}}</span>
                                                <span style="width: 140px;display:inline-block">{{item.status==1?'已启用':item.status!=1?'未启用':''}}</span>
                                                <b class="tool-direct" @click="changeGrade(item)">修改</b>
                                                <span class="status-direct" v-if="item.status!=1" @click="gradeStatus(item)">启用</span>
                                                <span class="status-direct" v-if="item.status==1" @click="gradeStatus(item)">关闭</span>
                                            </div>
                                        </el-form>
                                    </template>
                                </el-table-column>
                                <el-table-column label="关联ID" prop="id"></el-table-column>
                                <el-table-column label="方向"  prop="name"></el-table-column>
                                <!--<el-table-column label="状态"  prop="status"  :formatter="formatStatus" align="center" width="120" ></el-table-column>-->
                                <el-table-column label="排序"  prop="order" width="100"></el-table-column>
                               <!-- <el-table-column label="操作" inline-template :context="_self" width="210">
                                <span>
                                      <el-button  size="small" style="border: none;color:#20a0ff" >修改</el-button>
                                </span>
                                </el-table-column>-->
                            </el-table>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="学院ID" prop="id" width="100" ></el-table-column>
                <el-table-column label="商学院名称" prop="name"  width="300" ></el-table-column>
                <el-table-column label="简称" prop="shortName"  width="200"></el-table-column>
                <el-table-column label="状态"  prop="status"  :formatter="formatStatus" align="center" width="150" >
                </el-table-column>
                <el-table-column label="排序" prop="order" width="80"  ></el-table-column>
                <el-table-column  label="操作" inline-template :context="_self"  width="210">
                <span>
                   <el-button  size="small"  style="border: none;color:#20a0ff" @click="modyCommercial(row)">修改</el-button>
                     <el-button  size="small" style="border: none;color:#20a0ff" v-if="row.status!=1" @click="changeStatus(row)">启用</el-button>
                    <el-button  size="small" style="border: none;color:#20a0ff"  v-if="row.status==1" @click="changeStatus(row)">关闭</el-button>
                </span>
                </el-table-column>
            </el-table>
            <!--   商学院增改  -->
            <!--  添加公司 -->
            <el-dialog :title="editFormTitle" :close-on-click-modal="false" v-model="editFormVisible" accept-charset="UTF-8">
                <el-form >
                    <el-form-item label="商学院名称" label-width="180px" style="margin:20px 0px;">
                        <el-input v-model="commercial.collegeName" auto-complete="off" style="width:50%;" placeholder="请输入公司名称"></el-input>
                    </el-form-item>
                    <el-form-item label="商学院简称" label-width="180px" style="margin:20px 0px;">
                        <el-input v-model="commercial.shortName" auto-complete="off" style="width:50%;" placeholder="请输入公司简称"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" label-width="180px" style="margin:20px 0px;">
                        <el-input v-model="commercial.order" auto-complete="off" style="width:50%;" placeholder="请输入排序编号"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="editFormVisible = false">取消</el-button>
                    <el-button type="primary" @click=" subAddCommercial" :loading="editLoading">确定</el-button>
                </div>
            </el-dialog>
            <!--  添加年级 -->
            <el-dialog :title="gradeFormTitle" :close-on-click-modal="false" v-model="gradeFormVisible" accept-charset="UTF-8">
                <el-form >
                    <el-form-item label="年级名称" label-width="180px" style="margin:20px 0px;">
                        <el-input v-model="grade.name" auto-complete="off" style="width:50%;" placeholder="请输入年级名称"></el-input>
                    </el-form-item>
                    <el-form-item label="年级排序" label-width="180px" style="margin:20px 0px;">
                        <el-input v-model="grade.gradeIndex" auto-complete="off" style="width:50%;" placeholder="请输入排序编号"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="gradeFormVisible = false">取消</el-button>
                    <el-button type="primary" @click=" submitAddGrade" :loading="editLoading">确 定</el-button>
                </div>
            </el-dialog>
            <!--  关联方向 -->
            <el-dialog title="添加关联方向" :close-on-click-modal="false" v-model="collectFormVisible" accept-charset="UTF-8">
                <el-form>
                    <span style="margin:10px 10px;">方向</span>
                    <el-select  style="width:46% ;display: inline-block;margin-top: 20px " class='c-select' v-model="connect.majorList" placeholder="请输入方向">
                        <el-option v-for="item in typeValue" :key="item.id"  :label="item.itemName" :value="item.id"></el-option>
                    </el-select>
                    <el-form-item label="排序" label-width="180px" style="margin:10px 0 0 -130px">
                        <el-input v-model="connect.order" auto-complete="off"  style="width:50%;"  placeholder="请输入排序编号"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="collectFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitConnect"  :loading="editLoading">确定</el-button>
                </div>
            </el-dialog>
        </div>

    </template>

<script>
    import NProgress from 'nprogress'
    import {setCache, getCache, formatTimeString } from 'utils/tool'
    import util from '../../common/util'
    import apiConfig from 'utils/apiConfig'
    import ElButton from "../../../node_modules/element-ui/packages/button/src/button";

    export default{

        components: {ElButton},
        data(){
            return {
                majorsArr:[],
                commercialDate:[],
                commercial:{
                    collegeid:0,
                    collegeName:'',
                    shortName:'',
                    order:'',
                },
                majorList:'',
                collegeid:'',
                majorItemid:'',
                gradeid:'',
                editFormVisible:false,    //学院增改不显示
                editFormTitle:'新增商学院',
                gradeFormVisible:false,   //年级增改不显示
                gradeFormTitle:'新增年级',
                collectFormVisible:false,
                grade:{
                    name:'',
                    gradeIndex:'',
                },
                itemValue:'',
                typeList:'',
                typeValue:[],
                //公司标签
                typeName:[{
                    value: '',
                    label: '请选择'
                },{
                    value: 'major',
                    label: "major  "
                },{
                    value:'gender_attr',
                    label: "gender_attr "
                },{
                    value:'report_user',
                    label: "report_user "
                },{
                    value: 'report_need',
                    label: "report_need "
                }],
                connect:{
                    majorList:'',
                    order:'',
                },
                editLoading:false
            }

        },
        computed(){

        },
        mounted(){
            this.commercialList();
        },
        methods: {
            //状态值转换
           formatStatus:function(row,column){
                return row.status==1?'已启用':row.status!=1?'未启用':'';
            },
            commercialList(){
                this.$ajax.get(apiConfig.commercial).then((response)=>{
                        if(response.data.code == 1){
                            this.commercialDate = response.data.original;
                        }else if(response.data.code == "11001"){
                            sessionStorage.removeItem('realName')
                            this.$router.push('/login');
                        }
                })
            },
            //新增商学院
            collegeAdd:function () {
                this.editFormVisible = true;
                this.editFormTitle = '新增商学院';
                this.commercial={
                    collegeid:0,
                    collegeName:'',
                    shortName:'',
                    order:'',
                }
            },
            //修改商学院
            modyCommercial:function (row){
                this.editFormVisible = true;
                this.editFormTitle = '修改商学院 ';
                this.commercial = {
                    collegeid:row.id,
                    collegeName:row.name,
                    shortName:row.shortName,
                    order:row.order
                };
            },
            //提交新增商学院
            subAddCommercial:function (){
                let _this = this;
                _this.$ajax.post(apiConfig.commercialCollege, _this.commercial).then((response)=>{
                    if(response.data.code==1){
                        _this.$notify({
                            title: '成功',
                            message: '提交成功',
                            type: 'success'
                        });
                        this.editFormVisible = false;
                        this.commercialList();
                    } else {
                        _this.$message({
                            type: 'error',
                            message: response.data.msg
                        })
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },
            //改变状态
            changeStatus:function (row) {
                let _this = this;
                var collegeid =row.id
                this.$ajax.post(apiConfig.collegeStatus+'?'+ 'collegeid'+'='+ collegeid ).then((response)=>{
                    if (response.data.code == 1){
                        _this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success'
                        });
                        this.commercialList()
                    }else{
                        _this.$message({
                            type: 'error',
                            message: response.data.msg
                        })
                    }
                }).catch(function(response) {
                    console.log(response)
                })
            },
            //年级状态
            gradeStatus:function (item) {
                let _this = this;
                var gradeid = item.id;
                this.majorItemid = item.majorItemid;
                this.$ajax.post(apiConfig.gradeStatus+'?'+ 'gradeid'+'='+ gradeid ).then((response)=>{
                    if (response.data.code == 1){
                        _this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success'
                        });
                        this.commercialList();
                    }else{
                        _this.$message({
                            type: 'error',
                            message: response.data.msg
                        })
                    }
                }).catch(function(response) {
                    console.log(response)
                })
            },
            //年级增加
            addGrade:function (props){
                console.log(props)
                this.gradeFormVisible = true;
                this.gradeFormTitle =' 增加',
                this.collegeid  =  props.row.collegeid;
                this.majorItemid = props.row.id;
                this.majorsArr.push(this.collegeid);
            },
            //修改年级
            changeGrade:function (item){
                this.gradeFormVisible = true;
                this.gradeFormTitle = '修改',
                this.grade={
                    name:item.name,
                    gradeIndex:item.gradeIndex,
                };
               this.gradeid = item.id;
               this.majorItemid= item.majorItemid;
               var collegeid;
               for(var i =0; i<this.commercialDate.length; i++){
                   var majorArr = this.commercialDate[i].majors;
                   for(var j =0; j<majorArr.length;j++){
                       var collegeid = majorArr[j].collegeid;
                       var gradeId = majorArr[j].id;
                       if(this.majorItemid == gradeId ){
                           this.collegeid = collegeid;
                           return collegeid;
                       }
                   }
               }

            },
            //年级增改提交
            submitAddGrade:function () {
                let _this = this;
                var collegeid = _this.collegeid;
                if(!this.grade.name){
                    var gradesList = {
                        gradeid:0,
                        collegeid:this.collegeid
                    }
                    gradesList.append('', 0 );
                    gradesList.append('collegeid', );
                    gradesList.append('majorItemid', _this.majorItemid);
                    gradesList.append('name',  _this.grade.name);
                    gradesList.append('gradeIndex',  _this.grade.gradeIndex);
                    _this.$ajax.post(apiConfig.commercialGrade,gradesList).then((response)=>{
                        if(response.data.code==1){
                            _this.$notify({
                                title: '成功',
                                message: '提交成功',
                                type: 'success'
                            });
                            this.gradeFormVisible = false;
                            this.commercialList();
                        }else{
                            _this.$message({
                                type: 'error',
                                message:response.data.msg,
                            })
                        }
                    })
                        .catch(function(response){
                            console.log(response)
                        })

                }else{
                    var gradesList = {
                        gradeid:_this.gradeid,
                        collegeid:_this.collegeid,
                        majorItemid:_this.majorItemid,
                        name:_this.grade.name,
                        gradeIndex:_this.grade.gradeIndex
                    }
                    _this.$ajax.post(apiConfig.commercialGrade,gradesList).then((response)=>{
                        if(response.data.code==1){
                            _this.$notify({
                                title: '成功',
                                message: '提交成功',
                                type: 'success'
                            });
                            this.gradeFormVisible = false;
                            this.commercialList();
                        } else {
                            _this.$message({
                                type: 'error',
                                message: response.data.msg
                            })

                        }
                    })
                        .catch(function(response){
                            console.log(response)
                        })

                }

            },
            //方向关联
            collectMajor:function (props) {
                this.collectFormVisible=true;
                this.$ajax.get(apiConfig.basicsItem,{itemType:this.typeList}).then((response)=>{
                    if(response.data.code==1){
                        this.typeValue = response.data.original;
                    }
                })
                this.collegeid = props.row.id;
            },
            //提交关联
            submitConnect:function (){
                let _this = this;
                var connect = {
                    collegeid:this.collegeid,
                    majorItemid:this.connect.majorList,
                    order:this.connect.order,
                }
                this.$ajax.post(apiConfig.collegeMajor,connect).then((response)=>{
                    if(response.data.code==1){
                        _this.$notify({
                            title: '成功',
                            message: '提交成功',
                            type: 'success'
                        });
                        this.collectFormVisible = false;
                        this.commercialList();
                    }else{
                        _this.$message({
                            type: 'error',
                            message: response.data.msg
                        })
                    }
                }) .catch(function(response){
                    console.log(response)
                })

            },
        }


    }
</script>

<style>
    .fl{
        float: left;
        margin-right: 40px;
        margin-bottom: 10px;
    }
    .addGrade{border: 1px solid #cccccc; margin-left:30px;padding: 4px 6px;background: #ffffff; border-radius: 5px;cursor: pointer;}
    .tool-defind{margin-left:220px;}
    .fr{ float: right;}
    .cl{clear:both;}
    .tool-direct{font-weight: normal; color: #1d90e6;margin-left:80px;  cursor: pointer;}
    .status-direct:hover{color: #4db3ff;}
    .tool-direct:hover{color: #4db3ff;}
    .status-direct{color: #1d90e6; cursor: pointer; margin-left: 20px;}
    .major-direct{font-size: 16px; color:#1f2d3d; padding:4px 0;border-bottom: 1px dashed #cccccc;}
    .class-derect span{margin:0 5px;}
    .txt-detail li{
        float: left;
        font-size:16px;
        width: 450px;
    }
    .detaile-chesses li{
        border: 1px solid gainsboro;
        padding: 3px 10px ;
        float: left;
        color: black;
    }
    ul{
        list-style: none;
    }
</style>