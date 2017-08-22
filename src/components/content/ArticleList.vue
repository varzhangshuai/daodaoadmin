<template>
    <div>
        <!--工具条-->
        <el-row style="margin:10px">
            <el-col :span="6" >
                <el-radio-group v-model="status" name="status" @change="clearList">
                    <el-radio-button label="1"  >待审核</el-radio-button>
                    <el-radio-button label="2" >审核通过</el-radio-button>
                </el-radio-group>
            </el-col>
            <el-col :span="6" >
                <el-input placeholder="输入userid" v-model="userid" style="max-width:256px" size="small" class='fl'>
                    <template slot="prepend">用户ID</template>
                </el-input>
            </el-col>
            <el-col :span="6">
                <el-button type="primary" @click="search" style="width: 30%;">查询</el-button>
            </el-col>
        </el-row>
        <!--  表格  -->
        <el-table :data="artcleList" stripe border style="width: 100%; margin-top:30px" >
            <el-table-column prop="companyName" label="公司" width="180"></el-table-column>
            <el-table-column prop="title" label="标题" width="180"></el-table-column>
            <el-table-column prop="time" label="时间" width="130"></el-table-column>
            <el-table-column prop="description" label="描述" width="180"></el-table-column>
            <el-table-column fixed="right"  inline-template :context="_self" label="操作" width="100" v-if="this.status==='1'">
                  <span>
                      <el-button type="info" size="small"  @click="toUeditor(row)" >详情</el-button>
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
                pagation:{
                    pageIndex: 1,
                    pageSize: 20,
                    totalCount: 0,
                },
                filters:{
                    pageSize: 20,
                    pageIndex: 1,
                },
                artcleList:[],
                userid:'',
                status:'1'
            }
        },
        created(){
            this.status=this.$store.state.a.articleStatus;

            if(this.status==2){
                this.search()
            }

        },
        mounted(){

        },
        methods:{
            convertData(original) {
                this.pagation.totalCount = original.totalCount;
                this.pagation.pageIndex = original.pageIndex;
                this.pagation.pageSize = original.pageSize;
                this.filters.pageSize = original.pageSize;
                this.artcleList = original.pageList.map((item) =>{
                    return item;
                })

            },
            toUeditor:function (row) {
                const wechatArticleid =row.wechatArticleid;
                setCache({
                    key: 'wechatArticleid',
                    value: wechatArticleid
                })
                this.$router.push('/ueditor');
            },
            //用户查询
            search:function(){
                var api='';
                if(this.status==='1'){
                    api = apiConfig.articleList;
                }else if(this.status==='2'){
                    api = apiConfig.articleSuccess;
                }else{
                    return
                }
                var userid = {userid:this.userid};
                var filters  = this.filters;
                var postForm=Object.assign(userid,filters);
                this.$ajax.post(api, postForm).then((response) => {
                    //console.log('获取列表',response.data);
                    if (response.data.code == 1){
                        if(response.data.original.itemCount==0){
                            this.$message('暂无数据');
                        }
                        this.convertData (response.data.original)

                    }else{
                        this.$message(response.data.msg);
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },

            //status 改变
            clearList(){
                this.artcleList=[]
            }
        }
    }
</script>