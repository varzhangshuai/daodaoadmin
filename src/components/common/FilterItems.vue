<template>


</template>
<script>

    export default{
        mounted(){

        },
        data(){
            return{

            }
        },
        methods:{
            convertData (original) {
                this.pageList = original.pageList.map((item) => {
                    return item
                })
            },
            search: function () {
                // 用户筛选的条件
                let _this = this
                const searchList= {
                    userid:this.searchList.userid,
                    gender:this.searchList.gender,
                    statusName:this.searchList.statusName,
                    mobilePhone:this.searchList.mobilePhone,
                    nickName:this.searchList.nickName
                }
                console.log(searchList)
                this.$ajax.get('/costin/admin/user', searchList).then((response) => {
                    // 响应成功回调
                    console.log(response.data)
                    //要换成未生成邀请码的status
                    if (response.data.code == 1) {
                        _this .convertData (response.data.original)
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
                }
            }

    }
</script>
<style>


</style>