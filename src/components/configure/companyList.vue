    <template>
        <div>
            <el-row style="margin:10px">
                <el-col :span="4">
                    <el-button size="small" @click="companyAdd" style="padding: 12px 50px;background: white;color: #1f2d3d;">新增</el-button>
                </el-col>
                <el-col :span="7">
                    <el-input  placeholder="请输入关键字" v-model="searchKeyword" style="max-width:256px" size="small" class='fl'></el-input>
                    <el-button type="primary" @click="searchCompy">查询</el-button>
                </el-col>
            </el-row>

           <el-table :data="compyList" border  highlight-current-row  style="width: 100%;" >
                <el-table-column align="center" prop="companyid" label="公司ID" width="80"></el-table-column>
               <!-- <el-table-column inline-template label="公司Logo" align="center" width="100">
                   <div><img :src="row.logoImg" height="40" width="40" v-if="row.logoImg=''"></div>
                </el-table-column>-->
                <el-table-column align="center" prop="companyName" label="公司名称" width="280" ></el-table-column>
                <el-table-column align="center" prop="shortName" label="简称" width="180" > </el-table-column>
               <el-table-column align="center" prop="strengthLabel" label="公司标签" width="180"> </el-table-column>
                <el-table-column align="center" prop="provinceName" label="所在省" width="180" > </el-table-column>
                <el-table-column align="center" prop="cityName" label="城市" width="180" > </el-table-column>
               <!-- <el-table-column align="center" prop="describe" label="公司简介" width="290"> </el-table-column>
                <el-table-column align="center" prop="websiteUrl" label="网址" width="200"></el-table-column>-->
                <el-table-column inline-template :context="_self" label="操作" width='270'>
                <span>
                     <el-button  type="info" size="small" @click="modyCompany(row)" >修改</el-button>
                     <el-button  style="background: #A5A5A5; color: #ffffff" size="small" @click="detailCompany(row)" >详情</el-button>
                     <el-button  type="warning" size="small" @click="removeCompany(row)" >删除</el-button>

                </span>
                </el-table-column>
            </el-table>
            <!--分页-->
            <div>
                <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
                    <pagination
                            :currentpage="pagation.pageIndex"
                            :total="pagation.totalCount"
                            :pagesize="pagation.pageSize"
                            :render="compylist"
                            :options="filters"
                            style="float:right"
                    />
                </el-col>
            </div>

            <!--  增改公司 -->
            <el-dialog :title="compTitle" :close-on-click-modal="false" v-model="companyListVisible">
                <el-form>
                    <el-form-item label="公司名称" label-width="80px" style="margin:20px 0px;">
                        <el-input v-model="compList.name" auto-complete="off" style="width:50%;" placeholder="请输入公司名称"></el-input>
                    </el-form-item>
                    <el-form-item label="公司简称" label-width="80px" style="margin:20px 0px;">
                        <el-input v-model="compList.shortName" auto-complete="off" style="width:50%;" placeholder="请输入公司简称"></el-input>
                    </el-form-item>
                    <div>
                        <span style="margin:0 4px">请选择省市</span>
                        <el-select style="width:25%" v-model="compList.provinceid" name='province'  placeholder="请选择省份" size="normal"  @change="provinceChange">
                            <el-option v-for="item in areaLists" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                        <el-select style="width: 25%" v-model="compList.cityid" name='city'  placeholder="请选择城市" size="normal" >
                            <el-option v-for="item in onCity" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </div>
                    <span style="margin:10px 10px;">公司标签</span>
                    <el-select  style="width:46% ;display: inline-block;margin-top: 20px " class='c-select' v-model="compList.strengthLabelid" placeholder="请输入公司标签">
                        <el-option v-for="item in typeName" :key="item.value"  :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="companyListVisible = false">取消</el-button>
                    <el-button type="primary" @click="compListSubmit" :loading="editLoading">确 定</el-button>
                </div>
            </el-dialog>
            <!--   详情  -->
            <el-dialog :title="compTitle" :close-on-click-modal="false" v-model="companyDetailVisible">
                <h2 style="margin-top:30px">
                    <img :src="companyDetail.logoImg" class="detail-Img" v-if="this.companyDetail.logoImg!=''"/>
                    </h2>
                <ul class="txt-detail" style="width:100%; padding-bottom:40px">
                    <li><span class='detail-name'>公司ID</span><span class='el-detail-content'>{{ companyDetail.companyid }}</span></li>
                    <li><span class='detail-name'>公司名称</span><span class='el-detail-content'>{{ companyDetail.companyName }}</span></li>
                    <li><span class='detail-name'>公司名称</span><span class='el-detail-content'>{{ companyDetail.shortName }}</span></li>
                    <li><span class='detail-name'>所在省</span><span class='el-detail-content'>{{ companyDetail.provinceName  }}</span></li>
                    <li><span class='detail-name'>城市</span><span class='el-detail-content'>{{ companyDetail.cityName }}</span></li>
                    <li><span class='detail-name'>公司标签</span><span class='el-detail-content'>{{ companyDetail.strengthLabel }}</span></li>
                    <li><span class='detail-name'>公司简介</span><span class='el-detail-content' style="margin:-30px 0 0 125px">{{ companyDetail.describe }}</span></li>
                    <li><span class='detail-name'>公司网址</span><span class='el-detail-content'>{{ companyDetail.websiteUrl }}</span></li>
                </ul>
            </el-dialog>
        </div>

    </template>

<script>
    import NProgress from 'nprogress'
    import Pagination from 'components/common/Pagination.vue'
    import { getCache,formatTimeString } from 'utils/tool'
    import util from '../../common/util'
    import apiConfig from 'utils/apiConfig'
    import area from 'utils/area'

    export default{
        components: {
            Pagination
        },
        data(){
            return {
                pagation: {
                    pageIndex: 1,
                    pageSize: 20,
                    totalCount: 128,
                },
                filters: {
                    pageSize: 20,
                    pageIndex: 1,
                },
                compyList:[],
                comanyDate:[],
                companyListVisible:false,
               /* companyModyVisible:false,*/
                companyDetailVisible:false,
                compTitle:'增加公司信息',
                companyid:'',
                companyDetail:{},  //公司详情对象
                //公司
                compList:{
                    id:'',
                    name:'',
                    shortName:'',
                    provinceid:'',
                    cityid:'',
                    strengthLabelid:'',
                    paperType:'',
                    paperNum:'',
                    websiteUrl:'',
                    logoImg:'',
                    describe:'',
                },
                searchKeyword:'',   //关键字查询
                labelList:[],
                areaLists: [],  //省数组
                //公司标签
                typeName:[{
                    value: '',
                    label: '请选择'
                },{
                    value: 7,
                    label: "世界500强"
                },{
                    value:8,
                    label: "中国500强"
                },{
                    value: 9,
                    label: "上市公司"
                },{
                    value: 10,
                    label: "行业龙头"
                },{
                    value: 11,
                    label: "普通企业"
                }],
            }

        },
        computed:{
            //省市
            onCity(){
                if(!this.areaLists)
                    return
                for (var item of this.areaLists) {
                    if (this.compList.provinceid == item.id) {
                        return item.children
                    }
                }
            },
        },
        mounted(){
            this.compylist();
            this.getAreaList();
        },
        methods: {
            convertData(original){
                this.pagation.totalCount = original.totalCount
                this.pagation.pageIndex = original.pageIndex
                this.pagation.pageSize = original.pageSize
                this.filters.pageSize = original.pageSize
                this.compyList = original.pageList.map((item) =>{
                    return item;
                })
            },
            //省市列表
            getAreaList:function (){
                this.areaLists = area.allArea
            },
            provinceChange:function(){
                this.compList.cityid='';
            },

            //公司列表
            compylist:function(){
                 var filters  = this.filters;
                this.$ajax.get(apiConfig.company,filters).then((response)=>{
                    let _this = this
                    if(response.data.code == 1){
                        if(response.data.original.itemCount==0){
                            this.$message('暂无数据');
                        }
                        _this .convertData (response.data.original)
                    }else if(response.data.code == 10005){
                        this.$message({
                            title: '失败',
                            type: 'error',
                            message: response.data.msg,
                        });
                    }
                })
            },
            //新增公司
            companyAdd:function () {
                this.compTitle='新增公司信息'
                this.companyListVisible = true;
                this.compList = {
                    id:'',
                    name:'',
                    shortName:'',
                    provinceid:'',
                    cityid:'',
                    strengthLabelid:'',
                };
            },
            //修改公司
            modyCompany:function (row) {
                this.companyListVisible = true;
                this.compTitle = '修改公司信息';
                /* this.compList.name = row.companyName;*/
                this.compList = {
                    id:row.companyid,
                    name:row.companyName,
                    shortName:row.shortName,
                    provinceid:row.provinceName,
                    cityid:row.cityName,
                    strengthLabelid:row.strengthLabel,
                    /*paperType:row.paperType,
                     paperNum:row.paperNum,
                     websiteUrl:row.websiteUrl,
                     logoImg:row.logoImg,
                     describe:row.describe,*/
                };
                this.companyid = row.companyid
            },

            //提交公司
            compListSubmit:function () {
                if(this.companyid==''){
                    if(!this.compList.name){
                        this.$message.error('公司名称不能为空！');
                        return
                    }
                    if(!this.compList.shortName){
                        this.$message.error('公司简称不能为空！');
                        return
                    }
                    if(!this.compList.provinceid){
                        this.$message.error('省市不能为空！');
                        return
                    }
                    if(!this.compList.strengthLabelid){
                        this.$message.error('公司标签不能为空！');
                        return
                    }
                    this.$ajax.post(apiConfig.companyAdd,this.compList).then((response)=>{
                        let _this = this
                        if(response.data.code == 1){
                            _this.companyListVisible = false;
                            _this.$notify({
                                title: '成功',
                                message: '提交成功',
                                type: 'success'
                            });
                            this.compylist();
                        }else if(response.data.code == 10005){
                            this.$message({
                                title: '失败',
                                type: 'error',
                                message: response.data.msg,
                            });
                        }
                    })
                }else {
                    let _this = this;
                    var compantList = {
                        id:this.companyid
                    };
                    compantList =Object.assign(compantList,this.compList)
                    this.$ajax.post(apiConfig.companyModify,compantList).then((response)=>{
                        if(response.data.code == 1){
                            _this.companyListVisible = false;
                            _this.$notify({
                                title: '成功',
                                message: '提交成功',
                                type: 'success'
                            });
                            this.companyListVisible = false;
                            this.compylist();
                        }else if(response.data.code == 10005){
                            this.$message({
                                title: '失败',
                                type: 'error',
                                message: response.data.msg,
                            });
                        }
                    })

                }

            },

            //公司详情
            detailCompany:function (row) {
                this.companyDetailVisible = true;
                this.compTitle = '公司详情';
                this.$ajax.get(apiConfig.companyDetail,{companyid:row.companyid}).then((response)=>{
                    if(response.data.code == 1){

                        this.companyDetail = response.data.original
                    }
                }) .catch(function(response){
                    console.log(response)
                })
            },

            //搜索公司
            searchCompy:function () {
                let _this = this;
                this.$ajax.get(apiConfig.company,{name:this.searchKeyword}).then((response)=>{
                    if(response.data.code == 1){
                        _this .convertData(response.data.original)
                    }
                }) .catch(function(response){
                    console.log(response)
                })
            },
            //删除公司
            removeCompany:function (row) {
                var companyid = row.companyid;
                this.$ajax.post(apiConfig.companyRemove+'?'+ 'companyid'+'='+ companyid).then((response)=>{
                    let _this = this
                    if(response.data.code == 1){
                        _this.companyListVisible = false;
                        _this.$notify({
                            title: '成功',
                            message: '提交成功',
                            type: 'success'
                        });
                        this.compylist();
                    }else if(response.data.code == 10005){
                        this.$message({
                            title: '失败',
                            type: 'error',
                            message: response.data.msg,
                        });
                    }
                })
            },

        },


    }
</script>

<style>
    .detail-Img{
        position: absolute;
        right:6%;
        top: 5%;
        width: 150px;
        height: 150px;
        margin: 30px;
        border-radius: 50%;
        overflow:hidden;
        cursor: pointer;
    }
    .fl{
        float: left;
        margin-right: 40px;
        margin-bottom: 10px;
    }
    .detail-name{
        display: inline-block;
        width: 100px;
        line-height:26px;
        color: #000000;
        padding: 3px 10px ;
    }
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