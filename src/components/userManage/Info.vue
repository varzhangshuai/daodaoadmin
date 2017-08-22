<template>
    <!--审核列表-->
    <div>
        <template>
            <el-table :data="infoList" highlight-current-row  style="width: 100%;">
                <el-table-column prop="userid" label="用户id" width="80" align="center" >
                </el-table-column>
                <el-table-column prop="id" label="数据id" width="80"
                                 align="center">
                </el-table-column>
                <el-table-column prop="fieldName" label="姓名" width="120"  >
                </el-table-column>
                <el-table-column prop="oldData" label="旧数据" width="140" align="center" >
                </el-table-column>
                <el-table-column prop="newData" label="新数据" width="140"
                                 align="center" >
                </el-table-column>
                <el-table-column prop="status" label="状态" width="140" align="center" >
                </el-table-column>
                <el-table-column prop="utime" label="申请时间" width="180" align="center" >
                </el-table-column>
                <el-table-column fixed="right" inline-template :context="_self" label="操作" width="160" align="center">
					<span>
						<el-button style="background: #4db3ff;color: white"
                                   size="small"
                                   @click="agreeInfo(row)" >通过</el-button>
						<el-button   style="background: #A5A5A5" size="small"
                                     @click="disagreeInfo(row)">不通过</el-button>
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
                    :render="infolist"
                    :options="filters"
                    style="float:right"
            />
        </el-col>

    </div>
</template>
<script>
    import NProgress from 'nprogress'
    import Pagination from 'components/common/Pagination.vue'
    import { getCache,setCache,formatTimeString } from 'utils/tool'
    import apiConfig from 'utils/apiConfig'

    export default{
        components: {
            Pagination
        },
        data(){
            return{
                infoList:[],
                pagation: {
                    pageIndex: 1,
                    pageSize: 20,
                    totalCount: 128,
                },
                filters: {
                    pageSize: 20,
                    pageIndex:1 ,
                },
            }
        },
        mounted () {
            this.infolist()
        },
        methods:{
            convertData (original) {
                this.pagation.totalCount = original.totalCount
                this.pagation.pageIndex = original.pageIndex
                this.pagation.pageSize = original.pageSize
                this.filters.pageSize = original.pageSize
                this.infoList = original.pageList.map((item) => {
                    item.utime = item.utime != 0 ? formatTimeString(item.utime) : '--'
                    return item
                })
            },

            infolist(){
                let _this = this
                const localfilters = getCache({ key: 'filters' })
                //console.log(localfilters)
                if(localfilters){
                    this.filters=localfilters
                }

                this.$ajax.get(apiConfig.infoList,this.filters).then((response) => {
                    // 响应成功回调
                    if (response.data.code == 1) {
                        _this .convertData (response.data.original)
                    }  else{
                        var data= JSON.stringify(response.data)
                        if(data.code == '11001'){
                            sessionStorage.removeItem('realName')
                            this.$router.push('/login');
                        }
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },


            //同意审核
            agreeInfo:function (row) {
                var infoForm = {
                    id:row?row.id:'',
                    status:20
                }
                this.$ajax.post(apiConfig.infoApply,infoForm).then((res)=>{
                    if(res.data.code==1){
                        this.$notify({
                            title: '成功',
                            message: '审核成功',
                            type: 'success'
                        });
                        this.infolist();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.data.msg
                        })
                    }
                })
            },
            disagreeInfo:function (row) {

                var disinfoForm = {
                    id:row?row.id:'',
                    status:-20
                }
                this.$prompt('不通过原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showInput:true
                }).then(({ value }) => {
                    disinfoForm.remark= value;
                    this.$ajax.post(apiConfig.infoApply,disinfoForm).then((response) => {
                        if(response.data.code==1){
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            this.infolist();
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
        }
    }
</script>