<template>
    <div>
        <div style="margin: 10px" v-if="$store.getters.costin_sms_manager">
            <el-button type="primary" @click="dialogVisible = true">邀请用户(未激活)</el-button>
            <el-button type="primary" @click="dialogVisibleActive = true">向已激活用户群发短信</el-button>
        </div>

        <el-dialog title="发送短信" :visible.sync="dialogVisible">
            <el-form :model="msgData">
                <el-form-item label="届别" :label-width="formLabelWidth">
                    <el-select v-model="msgData.gradeid" placeholder="请选择届别" @change="gradeChange(msgData.gradeid)">
                        <el-option v-if="item.gradeid" v-for="item in totalList" :key="item.gradeid" :label="item.className" :value="item.gradeid" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="已激活人数" :label-width="formLabelWidth">
                    <el-input v-model="msgData.num" auto-complete="off"></el-input>
                    <span style="font-size: 12px">文案：您的长江同期同学已有${sum}人登陆道道发布需求，与校友达成合作。道道是为长江同学提供的商业对接平台，诚邀您登陆体验与校友实时互动。</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sendMsg">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="发送短信" :visible.sync="dialogVisibleActive">
            <el-form >
                <el-form-item label="请输入模板ID" :label-width="formLabelWidth">
                    <el-input v-model="smsData" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleActive = false">取 消</el-button>
                <el-button type="primary" @click="sendMsgActive">确 定</el-button>
            </div>
        </el-dialog>
        <template>
            <el-table  :data="totalList" border highlight-current-row >
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
                msgData:{
                    gradeid:'',
                    num:''
                },
                dialogVisible:false,
                dialogVisibleActive:false,
                smsData:'',
                formLabelWidth: '120px',
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
            },
            sendMsg(){
                var form = this.msgData;
                if(!form.gradeid){
                    this.$message({
                        message: '请选择届别',
                        type: 'warning'
                    })
                    return
                }
                if(!form.num){
                    this.$message({
                        message: '请输入人数',
                        type: 'warning'
                    })
                    return
                }
                this.$confirm('确定发送短信?', '提示', {
                    //type: 'warning'
                }).then(()=>{
                    this.$ajax.post(apiConfig.totalSendmsg,form).then((res)=>{
                        this.dialogVisible = false
                        if(res.data.code==1){
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                        }else{
                            this.$message({
                                message: res.data.msg
                            });
                        }
                    })
                }).catch((res)=>{
                    console.log(res)
                })

            },
            gradeChange(item){
                this.totalList.map((i)=>{
                    if(i.gradeid===item){
                        return  this.msgData.num = i.activatedCount
                    }
                })
            },
            sendMsgActive(){
                if(this.smsData==''){
                    this.$message({
                        message: '请输入文案',
                        type: 'warning'
                    })
                    return
                }

//                var form = new URLSearchParams();
                var form = {
                    sms:this.smsData
                }
                this.$confirm('确定发送短信?', '提示', {
                    //type: 'warning'
                }).then(()=>{
                        this.$ajax.post(apiConfig.totalSendmsged,form).then((res)=>{
                            this.dialogVisibleActive = false
                            if(res.data.code==1){
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                            }else{
                                this.$message({
                                    message: res.data.msg
                                });
                            }
                        })
                    }
                ).catch((res)=>{
                    console.log(res)
                })

            }
        }
    }
</script>