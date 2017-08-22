    <template>
        <div>
          <el-table :data="configData" highlight-current-row >
                <el-table-column align="right" prop="title" label="title" width="250"></el-table-column>
                <el-table-column align="left" prop="key" label="key" width="250" ></el-table-column>
               <el-table-column align="center" inline-template label="value " width="300" >
                    <span >
                        <el-input auto-complete="off" v-model="row.value" v-if="row.key!=='android_upgrade' && row.key!=='ios_upgrade'"></el-input>
                        <el-radio-group v-model="row.value" v-if="row.key=='android_upgrade'|| row.key=='ios_upgrade'">
                            <el-radio-button label="0">不处理</el-radio-button>
                            <el-radio-button label="1">提醒升级</el-radio-button>
                            <el-radio-button label="2">强制升级</el-radio-button>
                        </el-radio-group>
                    </span>
                </el-table-column>
                <el-table-column inline-template :context="_self" align="center"  label="操作" width='180'>
                    <span>
                         <el-button  type="info" size="small" @click="saveInfro(row)" >保存</el-button>
                    </span>
                </el-table-column>
            </el-table>

        </div>

    </template>

<script>
    import  NProgress from 'nprogress'
    import  Pagination from 'components/common/Pagination.vue'
    import {getCache,formatTimeString} from 'utils/tool'
    import util from '../../common/util'
    import apiConfig from 'utils/apiConfig'
    import area from 'utils/area'

    export default{
        components: {
            Pagination
        },
        data(){
            return {
                configData:[],
                value:'',
                radio:'',
            }

        },

        mounted(){
            this.configList();
        },
        methods: {
            configList(){
                this.$ajax.get(apiConfig.commonConfig).then((response)=>{
                    if(response.data.code ==1){
                        this.configData = response.data.original;

                    }else if(response.data.code == 10005) {
                        this.$message({
                            title: '失败',
                            type: 'error',
                            message: response.data.msg,
                        });
                    }

                })
            },
            saveInfro:function (row) {
                if(row.value==''){
                    this.$message.error('value值不能为空！');
                    return
                }
                if(row.key==''){
                    this.$message.error('key值不能为空！');
                    return
                }
                if(row.type!=='int'){
                    console.log(row.type)
                    this.$message.error('要求为int类型！');
                    return
                }
               var params = {
                   key:row.key,
                   value:row.value,
               }
                let _this = this;
               this.$ajax.post(apiConfig.commonConfig,params).then((response)=>{
                    if (response.data.code==1){
                        _this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success'
                        });
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

    .fl{
        float: left;
        margin-right: 40px;
        margin-bottom: 10px;
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