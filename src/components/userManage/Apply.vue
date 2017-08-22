<template>
    <div>
        <!--图片弹窗-->
        <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc" style="z-index:10"></big-img>
        <div>
            <el-row style="margin: 10px ">
                <el-col :span="12" >
                    <el-radio-group v-model="searchList.status" name="status" @change="applylist" >
                        <el-radio-button label="1" >待审核</el-radio-button>
                        <el-radio-button label="20" >审核通过</el-radio-button>
                        <el-radio-button label="-10" >已取消</el-radio-button>
                        <el-radio-button label="-20" >审核未通过</el-radio-button>
                    </el-radio-group>
                </el-col>
            </el-row>
        </div>
        <template>
            <el-table :data="applyList"  highlight-current-row  style="width: 100%;">
                <el-table-column prop="realName" label="姓名" align="center" width="120"></el-table-column>
                <el-table-column prop="mobilePhone" label="手机号" align="center" width="120"></el-table-column>
                <el-table-column prop="className" label="班级" align="center" width="90"></el-table-column>
                <el-table-column prop="companyName" label="公司" align="center" width="120"></el-table-column>
                <el-table-column prop="job" label="职位" align="center" width="90"></el-table-column>
                <el-table-column prop="city" label="城市" align="center" width="120"></el-table-column>
                <el-table-column prop="gender" label="性别" :formatter="formatSex" align="center" width="70" ></el-table-column>
                <el-table-column prop="status"  align="center" label="状态" width="120"  :formatter="formatStatus"></el-table-column>
                <el-table-column prop="reterence" label="证明人" align="center" width="160"></el-table-column>
                <el-table-column inline-template label="证件图片" align="center" width="140" >
                    <div>
                        <img v-if="row.paperOne && row.paperOne!=''" :src="row.paperOne" @click="clickImg($event)" width="160" height="160">
                        <img v-if="row.paperTwo && row.paperTwo!=''" :src="row.paperTwo" @click="clickImg($event)"  width="200" height="160">
                    </div>
                </el-table-column>
                <el-table-column prop="reason" label="原因" align="center" width="120"></el-table-column>
                <el-table-column v-if="searchList.status==1" fixed="right" inline-template :context="_self" label="操作" width="300">
                            <span>
                                <el-button   type="info" size="small"  @click="applyHistory(row)">历史申请</el-button>
                                <el-button v-if="$store.getters.costin_register_apply" type="success" size="small"  @click="agreeApply(row)">审核通过</el-button>
                                <el-button v-if="$store.getters.costin_register_apply" type="danger" size="small"  @click="disagreeApply(row)">审核不通过</el-button>
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
                    :render="applylist"
                    :options="filters"
                    style="float:right"
            />
        </el-col>
    </div>

</template>
<script>
    import NProgress from 'nprogress'
    import Pagination from 'components/common/Pagination.vue'
    import BigImg from 'components/common/BigImg.vue'
    import { getCache,containMenu } from 'utils/tool'
    import util from '../../common/util'
    import apiConfig from 'utils/apiConfig'

    export default{
        components: {
            Pagination,
            'big-img':BigImg
        },
        data(){
            return{
                pagation: {
                    pageIndex: 1,
                    pageSize: 20,
                    totalCount: 128,
                },
                filters: {
                    pageSize: 20,
                    pageIndex: 1,
                },
                applyList:[],
                searchList:{
                    status:'1'
                },

                rightWidth:this.$store.getters.costin_register_apply?280:100,

                //查看大图
                showImg:false,
                imgSrc: '',

            }
        },
        mounted () {
            const realName = getCache({ key: 'realName' });
            this.applylist()
        },
        methods:{
            handleRemove(tab) {
                console.log('remove');
            },
            handleClick(tab) {

            },
            convertData(original) {
                this.pagation.totalCount = original.totalCount
                this.pagation.pageIndex = original.pageIndex
                this.pagation.pageSize = original.pageSize
                this.filters.pageSize = original.pageSize
                this.applyList = original.pageList.map((item) => {
                    var paper = item.paper;
                    if(paper!=''){
                        var idx = paper.indexOf(",");
                        if (idx == -1){
                            item.paperOne = paper
                        }else{
                            paper=paper.split(',');
                            item.paperOne = paper[0]
                            item.paperTwo = paper[1]
                            console.log('1==>item',item)
                        }
                        return item
                    }else {
                        return item
                    }
                })
            },
            //请求列表
            applylist:function(){
                let _this = this
                const req = {}
                for (const key of Object.keys(this.filters)) {
                    if (this.filters[key]) {
                        req[key] = this.filters[key]
                    }
                }
                const obj = Object.assign(req,this.searchList );

                this.$ajax.get(apiConfig.apply,obj).then((response) => {
                    //要换成未生成邀请码的status
                    if (response.data.code == 1) {
                        _this .convertData (response.data.original)
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },
            //性别显示转换
            formatSex:function(row,column){
                return row.gender==1?'男':row.gender==2?'女':'未知';
            },
            formatStatus:function (row,colum) {
                return row.status==1?'待审核':row.status==20?'审核通过':row.status=='-10'?'已取消':row.status=='-20'?'审核未通过':"";
            },

            agreeApply:function (row) {
                var applyid = {applyid:row.applyid}
                this.$ajax.post(apiConfig.agreeApply, applyid).then((response) => {
                    // 响应成功回调
                    if (response.data.code == 1) {
                        this.$notify({
                            title: '成功',
                            message: '审核通过',
                            type: 'success'
                        });
                        this.applylist()
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },
            disagreeApply:function (row) {
                var applyid = row.applyid
                this.$prompt('不通过原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showInput:true
                }).then(({ value }) => {
                    var reason = value
                    this.$ajax.delete(apiConfig.disagreeApply + '?' +'applyid'+'='+applyid + '&' + 'reason'+ '='+ reason ).then((response) => {
                        if (response.data.code == 1) {
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            this.applylist();
                        }
                    })
                        .catch(function(response) {
                            console.log(response)
                        })

                }).catch(() => {

                });
            },
            //历史申请
            applyHistory:function (row) {
                let _this = this
                var applyid = { applyid:row.applyid }
                this.$ajax.get(apiConfig.apply,applyid).then((response) => {
                    //要换成未生成邀请码的status
                    if (response.data.code == 1) {
                        _this .convertData (response.data.original)
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },

            //图片放大
            clickImg(e) {
                this.showImg = true;
                // 获取当前图片地址
                this.imgSrc = e.currentTarget.src;
            },
            viewImg(){
                this.showImg = false;
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