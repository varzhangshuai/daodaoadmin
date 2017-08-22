<template>
    <div>

        <el-row class="warp" style="float: left">
            <!--
            Form 组件提供了表单验证的功能，只需要通过 rule 属性传入约定的验证规则，并 Form-Item 的 prop 属性设置为需校验的字段名即可。具体可以参考官网：http://element.eleme.io/#/zh-CN/component/form
            -->
            <el-col :span="16" class="warp-main">
                <el-form ref="infoForm" :model="infoForm" :rules="rules" label-width="60px">
                    <el-form-item label="公司" prop="companyName">
                        <el-input v-model="infoForm.companyName"></el-input>
                    </el-form-item>
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="infoForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="图片" prop="img">
                        <el-input v-model="infoForm.img"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input v-model="infoForm.description"></el-input>
                    </el-form-item>
                    <!--使用编辑器
                    -->
                    <el-form-item label="详细">
                        <div class="edit_container">
                            <quill-editor v-model="infoForm.contentHtml"
                                          ref="myQuillEditor"
                                          class="editer"
                                          :options="editorOption"
                                          @ready="onEditorReady($event)">
                            </quill-editor>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">确认提交</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col  :span="7">
                <div class="phone">
                    <div v-html="infoForm.contentHtml"></div>
                </div>
            </el-col>
        </el-row>

    </div>
</template>


<script>
    import { quillEditor } from 'vue-quill-editor' //调用编辑器
    import { getCache } from 'utils/tool'
    import apiConfig from 'utils/apiConfig'
    export default {
        components: {
//使用编辑器
            quillEditor
        },
        data() {
            return {
                infoForm: {
                    companyName: '',
                    title: '',
                    img:'',
                    description:'',
                    contentHtml:''
                },
                //表单验证
                rules: {
                    companyName: [
                        {required: true, message: '请输入公司名称', trigger: 'blur'}
                    ],
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur'}
                    ],
                    contentHtml: [
                        {required: true, message: '请输入详细内容', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '请输入描述', trigger: 'blur'}
                    ],
                    img: [
                        {required: true, message: '请输入图片链接', trigger: 'blur'}
                    ],
                },
                detailObj:{},
                editorOption: {},
            }
        },
        computed: {
            wechatArticleid(){
                return getCache({key: 'wechatArticleid'})
            },
            editor() {
                return this.$refs.myQuillEditor.quill
            }
        },
        mounted() {
            //初始化
            this.getContent()
        },
        methods: {
            onEditorReady(editor) {

            },
            onSubmit() {
                //提交
                this.$refs.infoForm.validate((valid) => {
                    let _this = this;
                    if(valid) {
                       var data =this.infoForm;
                        data.state = 1; //审核成功
                        _this.$ajax.post(apiConfig.articleAudit,data).then((response) => {
                            if (response.data.code == 1) {
                                _this.$notify({
                                    title: '成功',
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$store.dispatch('changeArticleStatus', '2');
                                this.$router.push('/artcleList');
                            } else if (response.data.code == "11001") {
                                sessionStorage.removeItem('realName')
                                this.$router.push('/login');
                            } else {
                                _this.$message({
                                    type: 'error',
                                    message: response.data.msg
                                })

                            }
                        }).catch((response) => {
                            console.log(response)
                        });
                    }
                });
            },
            getContent(){
                this.$ajax.post(apiConfig.articleDetail, {wechatArticleid:this.wechatArticleid}).then((response) => {
                    //console.log('获取列表',response.data);
                    if (response.data.code == 1){
                        var info = response.data.original
                        if(info==null){
                            this.$message('暂无数据');
                        }
                        this.infoForm=info;
                    }else{
                        this.$message(response.data.msg);
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            }
        },

    }

</script>
<style>
    .phone{
        width: 375px;
        height: 603px;
        border: 4px solid black;
        border-radius: 4px;
        overflow-y: auto;
        margin-left: 10px;
    }
</style>