<template>
    <div>
        <el-table  :data="reviewList" highlight-current-row  style="width: 100%;" >
            <!--selection-change判断勾选框的变化-->
            <!--<el-table-column align="center" type="selection" width="55"></el-table-column>-->
            <el-table-column align="center" prop="userid" label="用户id" width="120" ></el-table-column>
            <el-table-column align="center" prop="mobilePhone" label="手机号" width="150" > </el-table-column>
            <el-table-column align="center" prop="typeName" label="用户类型" width="120" >
            </el-table-column>
            <el-table-column align="center" prop="statusName" label="状态类型" width="120" >
            </el-table-column>
            <el-table-column inline-template label="头像" align="center" width="100">
                <div><img :src="row.headUrl" height="40" width="40"></div>
            </el-table-column>
           <!-- <el-table-column align="center" prop="nickName" label="花名" width="120" ></el-table-column>-->
            <el-table-column align="center" prop="realName" label="姓名" width="120" ></el-table-column>
            <el-table-column align="center" prop="gender" label="性别" :formatter="formatSex" width="100"  ></el-table-column>
            <el-table-column align="center" prop="className" label="班级" width="240" ></el-table-column>
            <el-table-column align="center" prop="companyId" label="公司" width="120" > </el-table-column>

            <el-table-column align="center" prop="inviteStatus" label="邀请状态" :formatter="formatInStatus" width="160" ></el-table-column>
            <el-table-column align="center" prop="inviteCode" label="邀请码" width="120" > </el-table-column>

            <el-table-column fixed="right" inline-template :context="_self" label="操作" width="200">
            <span>
                <el-button  type="info" size="small" @click="makeInvate(row)" >生成邀请码</el-button>
                <el-button v-if="row.status == '1'|| row.status =='2'||row.status == '3'" type="danger" size="small" @click="userBan(row)">封禁</el-button>
                <el-button v-if="row.status == '-1'" type="warning" size="small" @click="userBan(row)">解禁</el-button>
            </span>
            </el-table-column>

        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
            <pagination
                    :currentpage="pagation.pageIndex"
                    :total="pagation.totalCount"
                    :pagesize="pagation.pageSize"
                    :render="userlist"
                    :options="filters"
                    style="float:right"
            />
        </el-col>

    </div>
</template>
<script>
    import NProgress from 'nprogress'
    import Pagination from 'components/common/Pagination.vue'
    import { getCache,formatTimeString } from 'utils/tool'
    import util from '../../common/util'
    import apiConfig from 'utils/apiConfig'

    export default{
        components: {
            Pagination
        },
        data(){
            return{
                reviewList:[],
                pagation: {
                    pageIndex: 1,
                    pageSize: 20,
                    totalCount: 120,
                },
                filters: {
                    pageSize: 20,
                    pageIndex: 1,
                },
            }
        },
        mounted(){
          this.userlist();
          const realName = getCache({ key: 'realName' })
        },
        methods:{
            convertData (original) {
                this.pagation.totalCount = original.totalCount
                this.pagation.pageIndex = original.pageIndex
                this.pagation.pageSize = original.pageSize
                this.filters.pageSize = original.pageSize
                this.reviewList = original.pageList.map((item) => {
                    return item
                })
            },
            userlist:function () {
                var req =Object.assign(this.filters,{type:4})
                this.$ajax.get(apiConfig.user,{params:req}).then((response) => {
                    // 响应成功回调
                    if (response.data.code == 1) {
                        this .convertData (response.data.original)
                    }else {
                        sessionStorage.removeItem('realName')
                        //this.$router.push('/login');
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },
            //生成邀请码
            makeInvate:function (row) {
                this.userid ={ userid : row.userid}
                this.$ajax.post(apiConfig.invite, this.userid ).then((response) => {
                    // 响应成功回调
                    if (response.data.code == 1) {
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
            //封禁
            userBan:function (row) {
                const  userid=row.userid
                console.log(userid)
                if(row.status == '1'|| row.status =='2'|| row.status == '3'){
                    //封禁
                    this.$ajax.delete(apiConfig.detail+'?'+ 'userid'+'='+userid   ).then((response) => {
                        // 响应成功回调
                        console.log(response.data)
                        if (response.data.code == 1) {
                            this.userlist()
                        }
                    })
                        .catch(function(response) {
                            console.log(response)
                        })
                }else if (row.status == '-1'){
                    //解禁
                    this.$ajax.post(apiConfig.status+'?'+ 'userid'+'='+ userid   ).then((response) => {
                        // 响应成功回调
                        console.log(response.data)
                        if (response.data.code == 1) {
                            this.userlist()
                        }
                    })
                        .catch(function(response) {
                            console.log(response)
                        })
                }


            },
            formatSex:function(row,column){
                return row.gender==1?'男':row.gender==2?'女':'未知';
            },
        }
    }
</script>