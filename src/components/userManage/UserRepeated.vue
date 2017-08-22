<template>
    <div>
        <!--列表-->
        <template>
            <el-table  :data="userList" border highlight-current-row  style="width: 100%;">
                <el-table-column prop="userid" label="用户id" align="center" width="80" ></el-table-column>
                <el-table-column prop="mobilePhone" label="注册手机号" align="center" width="120" ></el-table-column>
                <el-table-column inline-template label="头像" align="center" width="100">
                    <div><img :src="row.headUrl" height="40" width="40" v-if="row.headUrl !=''"></div>
                </el-table-column>
                <!--<el-table-column  prop="nickName" label="花名" align="center" width="120" ></el-table-column>-->
                <el-table-column  prop="realName" label="姓名" align="center" width="120" ></el-table-column>
                <el-table-column  prop="gender" label="性别" :formatter="formatSex" align="center" width="80"  ></el-table-column>
                <el-table-column  prop="className" label="班级" width="160" align="center" ></el-table-column>
                <el-table-column  prop="statusName" label="状态名称" width="160" align="center" ></el-table-column>
                <el-table-column align="center" prop="regTime" label="激活时间" width="180" :formatter="formatendTime"></el-table-column>
                <el-table-column inline-template :context="_self" label="操作" width="210">
                    <span>
                        <el-button  type="info" size="small" @click="repeatDetail(row)">详情</el-button>
                        <el-button  type="warning" size="small" v-if="row.showDelete==1 " @click="deleteRepeat(row)">删除</el-button>
                    </span>
                </el-table-column>
            </el-table>
        </template>
    </div>


</template>
<script>
    import NProgress from 'nprogress'
    import { setCache, getCache,formatTimeString } from 'utils/tool'
    import util from '../../common/util'
    import apiConfig from 'utils/apiConfig'
    export default{

        data(){
            return{
                userList:[],
                pagation: {
                    pageIndex: 1,
                    pageSize: 20,
                    totalCount: 128,
                },
                filters: {
                    pageSize: 20,
                    pageIndex: 1,
                },
            }
        },
        mounted(){
            this.userlist();
        },
        methods:{
            //性别显示转换
            formatSex:function(row,column){
                return row.gender==1?'男':row.gender==2?'女':'未知';
            },
            //时间显示转换
            formatendTime:function (row,colum) {
                return  row.regTime?formatTimeString(row.regTime):''
            },
            //列表
            userlist(){
                let _this = this;
                this.$ajax.get(apiConfig.userRepeated).then((response) => {
                    if (response.data.code == 1) {
                       this.userList=response.data.original;
                    }else{
                        this.$message(response.data.msg);
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },
            //删除
            deleteRepeat:function (row) {
                let _this = this;
                this.$confirm('确认删除该用户吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    this.$ajax.post(apiConfig.userRepeated,{userid:row.userid}).then((response) => {
                        if (response.data.code == 1) {
                            _this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            this.userlist();
                        }else{
                            this.$message(response.data.msg);
                        }
                    })
                })

            },
            //详情
            repeatDetail:function (row) {
                const userid = row.userid;
                setCache({
                    key: 'userid',
                    value: userid
                })
                this.$router.push('/UserDetail');
            },

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
</style>