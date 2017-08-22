<template>
    <div class="mt40">
        <p class="back-manage" @click="backManage"><< 红人管理 </p>
        <!--  新增和修改   -->
        <div  class="star-cont-add">
            <h3 style="margin-left:20px;" class="add-enter-cont">{{starTitle}}</h3>
            <div style="clear:both"></div>
            <div>
                <el-form >
                    <el-form>
                        <el-form-item label="个人宣传图"  label-width="180px">
                            <el-input auto-complete="off" v-model="vividImg" style="width:60%"></el-input>
                        </el-form-item>
                    </el-form>
                    <span class="field-infr" >个人主要信息</span>
                    <div>
                        <el-form-item label="名字"  label-width="180px">
                            <el-input v-model="personalMain.name" auto-complete="off"  style="width:60%"></el-input>
                        </el-form-item>
                        <el-form-item label="国籍"  label-width="180px">
                            <el-input v-model="personalMain.nationality" auto-complete="off"  style="width:60%"></el-input>
                        </el-form-item>
                        <el-form-item label="公司职务" label-width="180px">
                            <el-input v-model="personalMain.companyDuties" auto-complete="off" style="width:60%"></el-input>
                        </el-form-item>
                        <el-form-item label="毕业院校"  label-width="180px">
                            <el-input v-model="personalMain.graduateSchool" auto-complete="off" style="width:60%"></el-input>
                            <p style="color:red;font-size: 12px;">学校名称请用逗号隔开</p>
                        </el-form-item>
                    </div>
                </el-form>
                <el-form>
                    <span class="field-infr" >主要经历</span>
                    <el-button type="primary" icon="plus" @click="addexperie" style="margin-top: 10px;display: inline-block"></el-button>
                    <ul class="show-content" v-if="experienForm.length>0">
                        <li v-for="(item,key) in experienForm ">{{ item }}<span class="operat-btn"><i @click ="modyExper(item,key)">修改</i>&nbsp;<i @click="deleteExper(key)">删除</i></span></li>
                    </ul>
                </el-form>
                <div>
                    <span class="field-infr" >成功案例</span>
                    <el-button type="primary" icon="plus" @click="addcompfile" style="margin-top: 10px;display: inline-block"></el-button>
                    <ul class="show-content" v-if="caseArr.length>0">
                        <li v-for="(item,key) in caseArr "><p v-for="i in item">{{i}}</p><span class="case-btn"><i @click ="modyCase(item,key)">修改</i>&nbsp;<i @click="deleteCase(key)">删除</i></span></li>
                    </ul>
                </div>
                <div>
                    <span class="field-infr" >公司动态</span>
                    <el-button type="primary" icon="plus" @click="addcompdynam(row)" style="margin-top: 10px;display: inline-block"></el-button>
                    <ul class="show-content" v-if="dynamicArr.length>0">
                        <li v-for="(item,key) in dynamicArr">
                            <p>公司id:{{companyid}}</p>
                            <p>公司标题:{{item.dynamicTilte}}</p>
                            <p>时间:{{item.dynamicTime}}</p>
                            <p>内容:{{item.dynamicContent}}</p>
                            <span class="case-btn"><i @click ="modyDynamic(item,key)">修改</i>&nbsp;<i @click="deleteDynamic(key)">删除</i></span>
                        </li>
                    </ul>
                </div>
                <div>
                    <span class="field-infr" >公司相册</span>
                    <el-button type="primary" icon="plus" @click="addcomphoto" style="margin-top: 10px;display: inline-block"></el-button>
                    <ul class="show-content" v-if="imageArr.length>0">
                        <li v-for="(item,key) in imageArr ">
                            <img :src ="item" style="width:100px; height: 80px"/>
                            <span class="case-btn"><i @click ="modyPhoto(item,key)">修改</i>&nbsp;<i @click="deletePhoto(key)">删除</i></span>
                        </li>
                    </ul>
                </div>
                <el-form>
                    <el-form-item label="公司logo"  label-width="180px">
                        <el-input auto-complete="off" v-model="companySummary.logoImg" style="width:60%"></el-input>
                    </el-form-item>
                    <el-form-item label="公司简介" label-width="180px">
                        <el-input auto-complete="off" type="textarea" v-model="companySummary.describe" style="width:60%"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer" style="margin-left:20%">
                    <el-button type="primary" @click.native="addstarSubmit" >提交</el-button>
                </div>
            </div>
        </div>
        <!--   预览详情    -->
        <div class="star-data">
            <h3 class="data-enter" @click="sectionGetdetail">点击预览红人内容详情</h3>
            <ul  class="txt-detail" style="margin-bottom:30px;" v-if="willShow">
                <p>个人信息</p>
                <li><span class='data-el-form'>姓名:</span><span class='el-detail-content'>{{ personinfr.name}}</span></li>
                <li><span class='data-el-form'>国籍:</span><span class='el-detail-content'>{{personinfr.nationality}}</span></li>
                <li><span class='data-el-form'>职位:</span><span class='el-detail-content'>{{personinfr.companyDuties }}</span></li>
                <li><span class='data-el-form'>毕业学校:</span><span class='el-detail-content'>{{personinfr.graduateSchool}}</span></li>
                <li><span class='data-el-form'>主要经历:</span><span class='el-detail-content' v-for="item in detailData.mainExperience">{{item}}</span></li>
                <li>
                    <span class='data-el-form'>成功案例:</span>
                    <p class='el-detail-content' v-for="item in detailData.successfulCase">
                        <span v-for="i in item" style="display:block; margin:8px 0;">{{i}}</span>
                    </p>
                </li>
                <li><span class='data-el-form'>公司简介:</span><span class='el-detail-content'  v-if="companySummary!=null">{{ companySummary.describe }}</span></li>
                <li ><span class='data-el-form'>公司logo:</span><img :src= "companySummary.logoImg" class="pic-detail"  v-if="companySummary!=null"/></li>
                <li><span class='data-el-form'>个人宣传图:</span><img :src= "detailData.vividImg" class="pic-detail"/></li>
                <li>
                    <span class='data-el-form'>公司相册:</span>
                    <div v-for="item in companyAlbum" style="margin-left:170px">
                        <img :src="item.imgurl" style="width: 100px; height:80px;"/>
                    </div>
                </li>
                <li>
                    <span class='data-el-form ' style="float: left">公司动态:</span>
                    <div v-for="item in companyDynamics" style="float: left">
                        <p><span>标题:</span><span>{{item.dynamicTilte}}</span></p>
                        <p><span>公司内容:</span><span>{{item.dynamicContent}}</span></p>
                        <p><span>时间:</span><span>{{item.dynamicTime}}</span></p>
                    </div>
                    <div style="clear:both"></div>
                </li>
            </ul>
        </div>
        <div style="clear: both"></div>

        <!--  主要经历添加  -->
        <el-dialog title="主要经历" :close-on-click-modal="false" v-model="ExperFormVisible">
            <el-form >
                <el-form-item label="主要经历"  label-width="180px">
                    <el-input v-model="mainExperience" auto-complete="off" style="width:60%"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="ExperFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="experienSubmit" :loading="editLoading">确 定</el-button>
            </div>
        </el-dialog>
        <!--  弹框成功案例添加  -->
        <el-dialog title="成功案例" :close-on-click-modal="false" v-model="infroFormVisible" >
            <el-form >
                <el-form-item label="标题：" label-width="180px">
                    <el-input v-model="succcaseForm.title" auto-complete="off"  style="width:60%"></el-input>
                </el-form-item>
                <el-form-item label="地点：" label-width="180px">
                    <el-input v-model="succcaseForm.place" auto-complete="off" style="width:60%"></el-input>
                </el-form-item>
                <el-form-item label="行业："  label-width="180px">
                    <el-input v-model="succcaseForm.industry" auto-complete="off" style="width:60%"></el-input>
                </el-form-item>
                <el-form-item label="亮点："  label-width="180px">
                    <el-input v-model="succcaseForm.highlight" auto-complete="off" style="width:60%"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="infroFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="caseSubmit" :loading="editLoading">确 定</el-button>
            </div>
        </el-dialog>
        <!--  弹框公司动态添加  -->
        <el-dialog title="公司动态" :close-on-click-modal="false" v-model="compdynamFormVisible" >
            <el-form>
                <el-form-item label="公司标题"  label-width="180px">
                    <el-input v-model="compdynamForm.dynamicTilte" auto-complete="off"  style="width:60%"></el-input>
                </el-form-item>
                <el-form-item label="公司内容"  label-width="180px">
                    <el-input v-model="compdynamForm.dynamicContent" auto-complete="off" style="width:60%"></el-input>
                </el-form-item>
                <el-form-item label="时间"   label-width="180px">
                    <el-input v-model="compdynamForm.dynamicTime" auto-complete="off" style="width:60%"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="compdynamFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="compdynamSubmit" :loading="editLoading">确 定</el-button>
            </div>
        </el-dialog>
        <!--  相册添加  -->
        <el-dialog title="公司相册" :close-on-click-modal="false" v-model="photoFormVisible">
            <el-form >
                <el-form-item label="图片地址" prop="imageUrl" label-width="180px">
                    <el-input v-model="imageUrl"  auto-complete="off" style="width:60%"></el-input>
                    <!-- <div style="display: flex">
                         <div style="display:  inline-block">
                             <ali-upload :url.sync="uploadUrl" :multiple="true" :id="uploadId" @aliimgurl=""></ali-upload>
                         </div>
                         <div style="display:inline-block;max-width: 400px;padding-left: 30px;">
                             <img :src="uploadUrl[uploadUrl.length-1]" alt=""
                                  style="width: 100%">
                         </div>
                     </div>-->
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="photoFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="photoSubmit" :loading="editLoading">确 定</el-button>
            </div>
        </el-dialog>
    </div>

</template>
<script>
    import Pagination from 'components/common/Pagination.vue'
    import { formatTimeString,getCache,setCache,objToArr,changeSelect } from 'utils/tool'
    import util from '../../common/util'
    import apiConfig from 'utils/apiConfig'
    import BigImg from 'components/common/BigImg.vue'
    import aliUpload from 'components/common/aliossupload.vue'
    import qs from 'qs'
    import ElForm from "../../../node_modules/element-ui/packages/form/src/form";
    export default{
        components: {
            ElForm,
            'big-img': BigImg,
            aliUpload
        },
        data(){
            return {
                infroFormVisible: false,   //成功案例信息不显示
                ExperFormVisible: false,
                compdynamFormVisible: false,
                photoFormVisible: false,    //相册信息不显示
                personalMain: {              //个人主要信息
                    name: '',
                    nationality: '',
                    companyDuties: '',
                    graduateSchool: '',
                },
                //experience 个人经历
                imageUrl: '',//图片链接
                imageArr: [],  //图片数组
                experienForm: [], //个人经历的数组
                isMody: '',  //是否是修改
                isCase: '',
                isImg: '',
                isDynamic: '',
                caseArr: [],  //成功案例的数组
                succcaseForm: {
                    title: '',
                    place: '',
                    industry: '',
                    highlight: '',
                },
                mainExperience: '',
                dynamicArr: [],//公司动态的数组
                compdynamForm: {
                    companyid: '',
                    dynamicTilte: '',
                    dynamicTime: '',
                    dynamicContent: '',
                },
                vividImg: '',   //个人宣传图
                addStarForm: {},  //提交表单对象
                companySummary: {
                    logoImg: '',      //公司logo
                    describe: '',    //公司简介
                },
                dynamicTilte: '',
                dynamicContent: '',
                dynamicTime: '',
                companyAlbum: [],
                imgurl: [],
                detailData: { },  //红人详情
                //红人详情是否显示
                willShow: false,
                personinfr: {
                    name: '',
                    nationality: '',
                    companyDuties: '',
                    graduateSchool: '',
                },
                starTitle:'修改红人内容详情',

            }
        },
        mounted () {
            this.modifyStar();
        },
        computed: {
            objectid(){
                return getCache({key: 'objectid'})
            },
            companyid(){
                return getCache({key: 'companyid'})
            },
        },
        methods: {
            //主要经历
            addexperie: function () {
                this.ExperFormVisible = true;
                this.mainExperience = "";
            },
            experienSubmit: function () {
                if (this.isMody === '') {
                    var experienitem = this.mainExperience;
                    this.experienForm.push(experienitem);
                } else {
                    var key = this.isMody;
                    this.experienForm[key] = this.mainExperience;
                    this.isMody = '';
                }
                this.ExperFormVisible = false;
            },
            //修改主要经历
            modyExper: function (item, key) {
                this.ExperFormVisible = true;
                this.mainExperience = item;
                this.isMody = key;
            },
            //删除主要经历
            deleteExper: function (key) {
                var _this = this;
                this.confirm('删除', function () {
                    _this.experienForm.splice(key, 1);
                });
            },
            //成功案例
            addcompfile: function () {
                this.infroFormVisible = true;
                this.succcaseForm = { }
            },
            caseSubmit: function () {
                if (this.isCase === '') {
                    var caseItem = this.succcaseForm;
                    var arr = [];
                    arr = [caseItem.title, "地点:" + caseItem.place, "行业 :" + caseItem.industry, "亮点:" + caseItem.highlight];
                    this.caseArr.push(arr);
                } else {
                    var key = this.isCase;
                    var caseItem = this.succcaseForm;
                    var casevaluArr = [caseItem.title, "地点:" + caseItem.place, "行业 :" + caseItem.industry, "亮点:" + caseItem.highlight];
                    this.caseArr[key] = casevaluArr;
                    this.isCase = '';
                }
                this.infroFormVisible = false;
            },
            //删除成功案例
            deleteCase: function (key) {
                var _this = this;
                this.confirm('删除', function () {
                    _this.caseArr.splice(key, 1);
                });
            },

            //修改成功案例
            modyCase: function (item, key) {
                this.infroFormVisible = true;
                this.succcaseForm.title = item[0]
                this.succcaseForm.place = item[1].split(':')[1]
                this.succcaseForm.industry = item[2].split(':')[1]
                this.succcaseForm.highlight = item[3].split(':')[1]
                this.isCase = key;
            },
            //公司动态
            addcompdynam: function () {
                this.compdynamFormVisible = true;
                this.compdynamForm =  {
                    companyid: '',
                    dynamicTilte: '',
                    dynamicTime: '',
                    dynamicContent: '',
                };
            },
            compdynamSubmit: function () {
                if (this.isDynamic === '') {
                    var dynamicobj = {
                        companyid: this.companyid,
                        dynamicTilte: this.compdynamForm.dynamicTilte,
                        dynamicTime: this.compdynamForm.dynamicTime,
                        dynamicContent: this.compdynamForm.dynamicContent,
                    };
                    this.dynamicArr.push(dynamicobj);
                } else {
                    var key = this.isDynamic;
                    var dynamicobj = {
                        companyid: this.companyid,
                        dynamicTilte: this.compdynamForm.dynamicTilte,
                        dynamicTime: this.compdynamForm.dynamicTime,
                        dynamicContent: this.compdynamForm.dynamicContent,
                    };
                    this.dynamicArr[key] = dynamicobj;
                }
                this.compdynamFormVisible = false;

            },

            // 修改公司动态
            modyDynamic: function (item, key) {
                this.compdynamFormVisible = true;
                this.compdynamForm={
                    companyid:item.companyid,
                    dynamicTilte: item.dynamicTilte,
                    dynamicContent: item.dynamicContent,
                    dynamicTime: item.dynamicTime,
                }
                this.isDynamic = key;
            },
            //删除公司动态
            deleteDynamic: function (key) {
                var _this = this;
                this.confirm('删除', function () {
                    _this.dynamicArr.splice(key, 1);
                });

            },

            //公司相册
            addcomphoto: function () {
                this.photoFormVisible = true;
                this.imageUrl="";
            },
            //提交图片
            photoSubmit: function () {
                if (this.imageUrl == "") {
                    this.$message({
                        message: '图片链接不能为空',
                        type: 'warning'
                    });
                    return
                } else {
                    if (this.isImg === '') {
                        /*var imgSrting = this.imageArr.join(',')*/
                        this.imageArr.push(this.imageUrl);
                    } else {
                        var key = this.isImg;
                        this.imageArr[key] = this.imageUrl
                        this.isImg = '';
                    }
                    this.photoFormVisible = false;
                }
            },
            //修改图片
            modyPhoto: function (item, key) {
                this.photoFormVisible = true;
                this.imageUrl = item;
                this.isImg = key;
            },
            //删除图片
            deletePhoto: function (key) {
                var _this = this;
                this.confirm('删除', function () {
                    _this.imageArr.splice(key, 1);
                });
            },
            //提交添加红人内容
            addstarSubmit: function () {
                let _this = this;
                if(!this.vividImg){
                    this.$message.error('个人宣传图不能为空！');
                    return
                }if(!this.personalMain.name){
                    this.$message.error('名字不能为空！');
                    return
                }if(!this.personalMain.nationality){
                    this.$message.error('国籍不能为空！');
                    return
                }if(!this.personalMain.companyDuties){
                    this.$message.error('公司职务不能为空！');
                    return
                }if(!this.personalMain.graduateSchool){
                    this.$message.error('毕业院校不能为空！');
                    return
                }if(this.experienForm == ""){
                    this.$message.error('主要经历不能为空！');
                    return
                }if(!this.companySummary.logoImg){
                    this.$message.error('公司logo不能为空！');
                    return
                }if(!this.companySummary.describe){
                    this.$message.error('公司简介不能为空！');
                    return
                }
                var companyid = this.companyid;
                var objectid = this.objectid;
                var imgurls  = this.imageArr.join(",");
                var graduateSchool = this.personalMain.graduateSchool;
                this.personalMain.graduateSchool = graduateSchool.replace(/，/ig,',');
                var data = {
                    personalMain: _this.personalMain,
                    mainExperience: _this.experienForm,
                    successfulCase: _this.caseArr,
                    companyDynamics: _this.dynamicArr,
                    vividImg: _this.vividImg,
                    companySummary:_this.companySummary,
                    imgurls: imgurls,
                    companyid: companyid,
                    type: 1,
                    objectid: objectid,
                }
                _this.$ajax.post(apiConfig.sectionEditor,data).then((response) => {
                    if (response.data.code == 1) {
                        _this.$notify({
                            title: '成功',
                            message: '提交成功',
                            type: 'success'
                        });
                        this.$router.push('/starManage');
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
            },
            //点击修改红人内容
            //显示信息
            modifyStar() {
                var objectid = this.objectid;
                this.$ajax.get(apiConfig.sectionGetDetail, {celebrityid: objectid}).then((response) => {
                    if (response.data.code == 1) {
                        this.detailData = response.data.original;
                        this.personalMain = this.detailData.personalMain;       //基本信息
                        this.experienForm = this.detailData.mainExperience;    //个人经历
                        this.caseArr = this.detailData.successfulCase;   //成功案例
                        this.dynamicArr = this.detailData.companyDynamics;   //公司动态
                        this.companyAlbum = this.detailData.companyAlbum;   //公司相册
                        this.companySummary = this.detailData.companySummary;   //简介   相册
                        var values = [];
                        for(var i = 0, len = this.companyAlbum.length; i < len; i++){
                            var key = this.companyAlbum[i];  //获取当前索引的 key 值
                            this.imageArr = key.imgurl.split(',');
                        }
                        this.vividImg = this.detailData.vividImg;
                    }else if(response.data.code == 10011){
                        this.starTitle='新增红人内容详情';
                    }

                }).catch(function (response) {
                    console.log(response)
                })

            },

            //点击显示红人详情页
            sectionGetdetail: function () {
                if (this.willShow == false) {
                    this.willShow = true;
                }
               /* this.detaFormVisible = false;
                this.starFormVisible = true;*/
                var objectid = this.objectid;
                this.$ajax.get(apiConfig.sectionGetDetail, {celebrityid: objectid}).then((response) => {
                    if (response.data.code == 1) {
                        this.detailData = response.data.original;
                        this.personinfr = this.detailData.personalMain;
                        this.companySummary = this.detailData.companySummary;
                        this.companyDynamics = this.detailData.companyDynamics;
                        this.companyAlbum = this.detailData.companyAlbum;
                    }
                }).catch(function (response) {
                    console.log(response)
                })
            },
            //返回
            backManage:function(){
                this.$router.push('/starManage');
            },

            //删除提示封装
            confirm: function (data, callback) {
                this.$confirm('是否' + data + '该文件?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then((res) => {
                    this.$message({
                        type: 'success',
                        message: data + '成功!'

                    });
                    callback();
                }).catch((error) => {
                    this.$message({
                        type: 'info',
                        message: '已取消' + data
                    });
                });
            }

        }
    }
</script>
<style>
    .field-infr{
        width: 110px;
        display: inline-block;
        text-align: right;
        vertical-align: middle;
        font-size: 14px;
        color: #48576a;
        line-height: 1;
        padding: 20px 0;
        box-sizing: border-box;
        margin: 0 8px 0 60px;
    }
    .operat-btn{ float: right; clear: both; }
    .case-btn i{font-style: normal; color: #1d90e6; cursor: pointer;}
    .operat-btn i{font-style: normal; color: #1d90e6; cursor: pointer;}
    .operat-btn i:hover{color: #4db3ff; text-decoration:underline;}
    .show-content{
        border:1px dashed #ccc;
        width:50%;
        margin-left:183px;
        padding:10px ;
    }
    .show-content li{margin:3px 0;}
    class-a{
        width: 60px;
        height: 40px;
    }
    class-b{
        width: 480px;
        height: 320px;
    }
    .data-el-form{
        display: inline-block;
        width: 150px;
        line-height: 24px;
        color: #333333;
        padding:6px 10px;
    }
    .add-enter-cont{ float: left;cursor: pointer}
    .data-enter{text-align: center; cursor: pointer;}
    .star-data{float:right;  width: 50%;}
    .star-cont-add{float: left; width: 50%;}
    .back-manage{ font-size: 14px; color:#666; cursor: pointer; margin-left:10px;}
    .back-manage:hover{color:#4db3ff;}
</style>