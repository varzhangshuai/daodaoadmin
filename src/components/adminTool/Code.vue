<template>
    <el-tabs style="width:100%;" type="card" @tab-click="handleClick" @tab-remove="handleRemove">
        <el-tab-pane label="用户列表">
            <div>
                <el-row @keyup.enter="codeSearch">
                    <el-col :span="7"  >
                        <el-input  placeholder="" v-model="codeList.phone" style="max-width:256px" size="small" class='fl'  >
                            <template slot="prepend">手机号</template>
                        </el-input>
                    </el-col>
                    <el-col :span="7" class='fl' >
                        <span class='el-input-group__prepend'>状态</span>
                        <el-select v-model="codeList.status" class='c-select funtype-select' size="small" >
                            <el-option label="全部" value=""></el-option>
                            <el-option label="可使用" value="1"></el-option>
                            <el-option label="不可使用" value="2"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="left">
                    <el-col :span="7">
                        <el-button type="primary" @click="codeSearch" style="width:30%;margin:10px 0 20px 60%">查询</el-button>
                    </el-col>
                </el-row>
            </div>
            <template>
                <el-table  :data="codeLists" highlight-current-row  style="width: 100%;">
                    <el-table-column prop="phone" label="手机号" align="center" width="150" ></el-table-column>
                    <el-table-column  prop="code" label="验证码" align="center" width="120" ></el-table-column>
                    <el-table-column  prop="availTime" label="有效时间" align="center" width="120" :formatter="formatTime"></el-table-column>
                    <el-table-column  prop="status" label="状态"  align="center" width="100"  :formatter="formatStatus"></el-table-column>
                    <el-table-column  prop="type" label="短信类型" width="200" align="center" :formatter="formatType" ></el-table-column>
                    <el-table-column  prop="ip" label="IP地址" width="200" align="center" ></el-table-column>
                </el-table>
            </template>
        </el-tab-pane>
    </el-tabs>


</template>
<script>
    import apiConfig from 'utils/apiConfig'
    export default {
        data(){
            return {
                markEnter: 1, // 防止多次enter
                codeList:{
                    phone:'',
                    status:'1'
                },
                codeLists:[]
            }
        },
        mounted () {
            document.addEventListener('keyup', this.listenEnter)
        },
        methods:{
            //导航切换
            handleRemove(tab) {
                console.log('remove');
            },
            handleClick(tab) {

            },
            listenEnter (e) {
                if (e.keyCode === 13 && this.markEnter === 1 && this.codeList.phone ) {
                    this.markEnter = 2
                    this.codeSearch()
                }
            },
            codeSearch:function () {
                    let _this = this
                    console.log(this.codeList)

                    this.$ajax.get(apiConfig.code,this.codeList).then((response) => {
                        // 响应成功回调
                        this.markEnter = 1
                        if (response.data.code == 1) {
                            console.log('短信码查询',response.data)
                            _this.codeLists = response.data.original
                        } else if(response.data.code == "11001"){
                            sessionStorage.removeItem('realName')
                            this.$router.push('/login');
                        }

                    })
                        .catch(function(response) {
                            console.log(response)
                        })
            },
            formatTime:function(row,column){
                return new Date(parseInt(row.availTime) ).toLocaleString().replace(/年|月/g, '-').replace(/日/g, ' ');
            },
            formatStatus:function(row,column){
                return row.status==1?'新':row.status==2?'通过':row.status==-1?'失败':row.status==-2?'过期':'未知';
            },
            formatType:function(row,column){
                return row.status==1?'可使用':row.status==2?'不可使用':'未知';
            },
            
        },
        destroyed () {
            document.removeEventListener('keyup', this.listenEnter)
        }
    }
</script>