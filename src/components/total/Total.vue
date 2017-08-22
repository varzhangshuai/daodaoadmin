<template>
    <div>
        <template>
            <el-table  :data="totalList" border highlight-current-row  >
                <el-table-column prop="className" label="届别" align="center" width="140" ></el-table-column>
                <el-table-column prop="count" label="用户数量" align="center" width="120" ></el-table-column>
                <el-table-column  prop="activatedCount" label="已激活" align="center" width="120" ></el-table-column>
                <el-table-column  prop="inactiveCount" label="未激活" align="center" width="120" ></el-table-column>
            </el-table>
        </template>
    </div>
</template>
<script>
    import apiConfig from 'utils/apiConfig'
    export default{
        data(){
          return{
              totalList:[],
          }
        },
        mounted (){
            this.totallist()
        },
        methods:{
            totallist(){
                this.$ajax.post(apiConfig.totalGrade).then((res)=>{
                    if(res.data.code==1){
                        if(res.data.original==null){
                            this.$message({
                                message: '暂无数据',
                                type: 'success'
                            });
                            return
                        }

                        this.totalList=res.data.original
                    }else{
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                    }
                })
            }
        }
    }
</script>