<template>
    <!--分页-->
    <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentpage"
            :page-sizes="[20, 50, 100]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next"
            :total="total">
    </el-pagination>
</template>
<style>
</style>
<script>
    import { getCache, setCache, formatTimeString } from 'utils/tool'
    export default{
        props: ['currentpage', 'total', 'render', 'options', 'pagesize'],
        data(){
            return{
            }
        },
        methods: {
            handleSizeChange (val) {
                this.options.pageSize = val
                this.options.pageIndex = 1
                this.render()
            },
            handleCurrentChange (val) {
                this.options.pageIndex = val
                setCache({
                    key: 'pageIndex',
                    value:val
                })
                this.render()
            }
        }
    }
</script>
