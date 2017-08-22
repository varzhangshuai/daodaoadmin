<template>
	<div>
		<p class="back-manage" @click="backUserlist"><< 用户列表 </p>
		<h2 style="margin-top:30px">
			<img :src="userDetail.headUrl" class="detail-Img" v-if="userDetail.headUrl!=''"/>
		</h2>
		<ul class="txt-detail" style="width: 95%">
			<li><span class='detail-name'>用户ID</span><span class='el-detail-content'>{{ userDetail.userid }}</span></li>
			<li><span class='detail-name'>手机号</span><span class='el-detail-content'>{{ userDetail.mobilePhone }}</span></li>
			<li><span class='detail-name'>姓名</span><span class='el-detail-content'>{{ userDetail.realName  }}</span></li>
			<li><span class='detail-name'>类型名</span><span class='el-detail-content'>{{ userDetail.typeName }}</span></li>
			<li><span class='detail-name'>性别</span><span class='el-detail-content'>{{ userDetail.gender == '1' ? '男' : '女' }}</span></li>
			<li><span class='detail-name'>学院届别</span ><span class='el-detail-content'>{{ userDetail.className }}</span></li>
			<li><span class='detail-name'>状态名</span><span class='el-detail-content'>{{ userDetail.statusName }}</span></li>
			<li><span class='detail-name'>发需求数</span><span class='el-detail-content'>{{ userDetail.needCount }}</span></li>
			<li><span class='detail-name'>应局数</span><span class='el-detail-content'>{{ userDetail.appointCount }}</span></li>
			<li><span class='detail-name'>活跃指数</span><span class='el-detail-content'>{{ userDetail.active }}</span></li>
			<li><span class='detail-name'>完整度</span ><span class='el-detail-content'>{{ userDetail.integrity }}</span></li>
			<li><span class='detail-name'>评价评分</span><span class='el-detail-content'>{{ userDetail.commentScore }}</span></li>
			<li><span class='detail-name'>评价数量</span><span class='el-detail-content'>{{ userDetail.commentCount }}</span></li>
			<li><span class='detail-name'>最近登录时间</span><span class='el-detail-content'>{{ userDetail.loginTime }}</span></li>
			<li><span class='detail-name'>注册时间</span><span class='el-detail-content'>{{ userDetail.registerTime }}</span></li>
		</ul>

		<div class="clearfix" style="padding: 20px 0">
			<div class="clearfix" style="border: 1px dashed #cccccc; width:45%; margin-left: 2%; float:left;">
				<p class="tab-head-list">行业信息关联列表</p>
				<el-table  :data="induestries" border highlight-current-row  style="width:89%; margin:3% 5%">
					<el-table-column prop="name" label="行业" align="center" width="370" ></el-table-column>
					<el-table-column prop="year" label="工作年限" align="center" width="140" ></el-table-column>
					<el-table-column  inline-template :context="_self" label="操作" width="140">
						<span>
							<el-button size="small" @click="removeInduestry(row)" style="border: none; color: #20a0ff">删除</el-button>
						</span>
					</el-table-column>
				</el-table>
				<div style="margin: 20px 0 20px 36px">
					<el-button @click="industryInfrAdd">新增行业关联信息</el-button>
				</div>
			</div>
			<div class="clearfix" style="border: 1px dashed #cccccc; width:45%; margin-left: 2%; float:left;">
				<p class="tab-head-list" >用户公司关联列表</p>
				<el-table  :data="companies" border highlight-current-row  style="width:90%; margin:3% 5%">
					<el-table-column prop="companyName" label="公司" align="center" width="320" ></el-table-column>
					<el-table-column prop="job" label="职务" align="center" width="145" ></el-table-column>
					<el-table-column prop="cityName" label="所在地" align="center" width="145" ></el-table-column>
					<el-table-column  inline-template :context="_self" label="操作" width="115">
						<span>
							<el-button  size="small" @click="removeCompany(row)" style="border: none;color:#20a0ff">删除</el-button>
						</span>
					</el-table-column>
				</el-table>
				<div style="margin: 20px 0 20px 40px">
					<el-button @click="companyInfrAdd">新增公司关联信息</el-button>
				</div>
			</div>
		</div>


		<div v-if="chessesList" class="clearfix" style="width: 100%;">
			<ul class="detaile-chesses " >
				<li class="chesses-name">频道列表</li>
			</ul>
			<ul v-for="item in chessesList" class="detaile-chesses">
				<li v-text="item.name"></li>
			</ul>
		</div >
		<div v-if="otherImpress" class="clearfix">
			<ul class="detaile-chesses " >
				<li class="chesses-name">{{otherImpress.typeName || '他人印象' }}</li>
			</ul>
			<ul v-for="item in otherImpress.labels" class="detaile-chesses">
				<li v-text="item.labelName"></li>
			</ul>
		</div>
		<div v-if="personalLabels" class="clearfix" >
			<ul class="detaile-chesses " >
				<li class="chesses-name">{{personalLabels.typeName || '个人标签' }}</li>
			</ul>
			<ul v-for="item in personalLabels.labels" class="detaile-chesses">
				<li v-text="item.labelName"></li>
			</ul>
		</div>
		<div v-if="systemLabels" class="clearfix" >
			<ul class="detaile-chesses " >
				<li class="chesses-name">{{systemLabels.typeName || '系统标签' }}</li>
			</ul>
			<ul v-for="item in systemLabels.labels" class="detaile-chesses">
				<li v-text="item.labelName"></li>
			</ul>
		</div>
		<!--   添加行业信息   -->
		<el-dialog title="增加行业信息关联" :close-on-click-modal="false" v-model="industryFormVisible" >
				<el-form >
				<el-form-item label="用户id" label-width="80px">
					<el-input v-model="industry.userid" auto-complete="off" style="width:37%" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="工作年限：" label-width="180px" style="margin-left: -90px">
					<el-input v-model="industry.year" auto-complete="off" style="width:37%"></el-input>
				</el-form-item>
				<span class='el-input-group__prepend' style="width:17%">行业</span>
				<el-select style="width:40% ;"  v-model="industry.labels"
						   name='labels'  placeholder="请选择行业" class='c-select'  size="small"  @change="industryOneChange()" >
					<el-option v-for="item in industryList" :key="item.industryid" :label="item.industryName" :value="item.industryid"></el-option>
				</el-select>
				<el-select style="width:40% ;"  v-model="industry2"
						   name='labels'  placeholder="请选择2级行业" size="small" :disabled="selectdisTwo" class='c-select' >
					<el-option v-for="item in industryListTwo" :key="item.industryid" :label="item.industryName" :value="item.industryid"></el-option>
				</el-select>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="industryFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="industrySubmit" :loading="editLoading">确 定</el-button>
			</div>
        </el-dialog>
		<!--   添加公司信息   -->
		<el-dialog title="增加公司关联信息" :close-on-click-modal="false" v-model="companyFormVisible">
			<el-form >
				<el-form-item label="用户id" label-width="80px">
					<el-input v-model="company.userid" auto-complete="off" style="width:50%" :disabled="true"></el-input>
				</el-form-item>
				<span style="margin:0 25px">公司</span>
				<el-select  style="width:46% ;display: inline-block" class='c-select' v-model="company.labels" filterable remote placeholder="请输入公司名称" :remote-method="remoteMethod" >
					<el-option v-for="item in labelList" :key="item.labelid"  :label="item.name" :value="item.labelid"></el-option>
				</el-select>
				<el-button type="primary" icon="plus" @click="addcompany" style="margin-top: 10px;display: inline-block"></el-button>
				<div class="clearfix"></div>
				<span style="margin:10px 10px;">职务标签</span>
				<el-select  style="width:46% ;display: inline-block;margin-top: 20px " class='c-select' v-model="company.jobLabelid" placeholder="请输入职务标签">
					<el-option v-for="item in jobLabeType" :key="item.value"  :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-form-item label="职位" label-width="80px" style="margin:20px 0px;">
					<el-input v-model="company.job" auto-complete="off" style="width:50%; " placeholder="请输入职位"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="companyFormVisible = false">取消</el-button>
				<el-button type="primary" @click="companySubmit" :loading="editLoading">确 定</el-button>
			</div>
		</el-dialog>
		<!--  添加公司 -->
		<el-dialog title="添加公司" :close-on-click-modal="false" v-model="companyListVisible">
			<el-form>
				<el-form-item label="公司名称" label-width="80px" style="margin:20px 0px;">
					<el-input v-model="compList.name" auto-complete="off" style="width:50%;" placeholder="请输入公司名称"></el-input>
				</el-form-item>
				<el-form-item label="公司简称" label-width="80px" style="margin:20px 0px;">
					<el-input v-model="compList.shortName" auto-complete="off" style="width:50%;" placeholder="请输入公司简称"></el-input>
				</el-form-item>
				<div>
					<span style="margin:0 4px">请选择省市</span>
					<el-select style="width:25%" v-model="compList.provinceid" name='province'  placeholder="请选择省份" size="normal"  @change="provinceChange">
						<el-option v-for="item in areaLists" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
					<el-select style="width: 25%" v-model="compList.cityid" name='city'  placeholder="请选择城市" size="normal" >
						<el-option v-for="item in onCity" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</div>
				<span style="margin:10px 10px;">公司标签</span>
				<el-select  style="width:46% ;display: inline-block;margin-top: 20px " class='c-select' v-model="compList.strengthLabelid" placeholder="请输入公司标签">
					<el-option v-for="item in typeName" :key="item.value"  :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="companyListVisible = false">取消</el-button>
				<el-button type="primary" @click="compListSubmit" :loading="editLoading">确 定</el-button>
			</div>
		</el-dialog>
	</div>


</template>
<script>
    import NProgress from 'nprogress'
    import Pagination from 'components/common/Pagination.vue'
    import { setCache,getCache,formatTimeString } from 'utils/tool'
    import util from '../../common/util'
	import apiConfig from 'utils/apiConfig'
    import area from 'utils/area'

    export default {
        components: {
            Pagination
        },
        data() {
            return {
                userDetail:{},
                industryFormVisible:false,
                companyFormVisible:false,
                companyListVisible:false,
                headUrl:'',
				//行业
                industry:{
                    labels:'',
                    year:'',
                    userid:'',
				},
                industryList:[],
                industry2:'',
                selectdisTwo:true,
				//公司
                company:{
                    userid:'',
					labels:'',
                    jobLabelid:'',
                    job:'',
				},
                labelList:[],
                jobLabeType:[{
                    value: '',
                    label: '请选择'
                },{
                    value: 1,
                    label: "创始人/合伙人"
                },{
                    value: 2,
                    label: "董事长/董事"
                },{
                    value: 3,
                    label: "总经理/CEO"
                },{
                    value: 4,
                    label: "副总经理"
                },{
                    value: 5,
                    label: "总监"
                },{
                    value: 6,
                    label: "专业顾问"
                },],
				//公司
                compList:{
                    name:'',
                    shortName:'',
                    provinceid:'',
                    cityid:'',
                    strengthLabelid:'',
				},
                areaLists: [],  //省数组
				//公司标签
                typeName:[{
                    value: '',
                    label: '请选择'
                },{
                    value: 7,
                    label: "世界500强"
                },{
                    value:8,
                    label: "中国500强"
                },{
                    value: 9,
                    label: "上市公司"
                },{
                    value: 10,
                    label: "行业龙头"
                },{
                    value: 11,
                    label: "普通企业"
                }],
                //详情面数据
                chessesList:[],//棋子列表

                otherImpress:{},//他人印象
                personalLabels:{},//个人标签
                systemLabels:{},//系统标签
                editLoading:false,
                btnEditText:'提 交',
                induestries:[],
                companies:[],
            };
        },
        computed: {
            userid(){
                return getCache({key: 'userid'})
            },
            //行业计算
            industryListTwo(){
                if(this.industryList==[])
                    return
                for (var item of this.industryList){
                    if(this.industry.labels == item.industryid){
                        return item.children
                    }
                }
            },
			//省市
            onCity(){
               if(!this.areaLists)
                    return
                for (var item of this.areaLists) {
                    if (this.compList.provinceid == item.id) {
                        return item.children
                    }
                }
            },
        },
        watch:{
            industryListTwo:{
                handler(obj){
                    if(obj){
                        if(obj.length==0){
                            return
                        }
                        this.selectdisTwo = false
                    }else {
                        this.selectdisTwo = true
                    }
                },
                deep: true
            },

        },
        mounted () {
		this.detailList();
		this.getindustryList();
		this.getAreaList();
        },
        methods: {
            //返回用户列表
            backUserlist:function () {
               /* this.$router.push('/user');*/history.back()
            },
            //详情
            detailData (original) {
                this.userDetail = original
                //棋子列表去掉前三个
                this.induestries = this.userDetail.induestries;
                this.companies = this.userDetail.companies;
                var chesses = original.chesses
                if(chesses){
                    chesses.splice(0,3)
                    this.chessesList = chesses
                }
                //标签列表
                var labels = original.labels
                if(labels){
                    for(var i=0;i<labels.length;i++){
                        if(labels[i].typeName=="他人印象"){
                            this.otherImpress = labels[i];
                        }else if(labels[i].typeName=="个人标签"){
                            this.personalLabels = labels[i]
                        } else if(labels[i].typeName=="系统标签"){
                            this.systemLabels = labels[i]
                        }

                    }
                }
            },
			//获取详情信息
			detailList(){
                let _this = this;
                _this.$ajax.get(apiConfig.detail,{ userid:this.userid} ).then((response) => {
                    // 响应成功回调
                    if (response.data.code == 1) {
                        console.log('详情页',response.data)
                        this.detailData(response.data.original);

                    }
                })
				.catch(function(response) {
					console.log(response)
				})
			},
			//新增行业信息
            industryInfrAdd:function () {
				this.industryFormVisible = true;
                this.industry = {
                    labels:'',
					year:'',
					userid:this.userid,
                }
            },
			//行业列表
            getindustryList:function(value){
			    this.$ajax.get(apiConfig.industry ).then((response) => {
					if (response.data.code ==1){
						console.log(response.data.original);
						this.industryList = response.data.original;

					}
				})
					.catch(function(response) {
                    console.log(response)
                })
			},
           industryOneChange:function(item){
                this.industry2 = '';
			},

            //提交行业信息
            industrySubmit:function () {
               //提醒判断
                var reg = /^\+?[1-9][0-9]*$/;
                if(!this.industry.year){
                    this.$message.error('工作年限不能为空！');
                    return
				}else if(!reg.test(this.industry.year)){
                    this.$message.error('请输入正整数！');
                    return
				}
				if(!this.industry.labels){
                    this.$message.error('行业不能为空！');
                    return
				}
				var industry = {
                    userid:this.userid,
                    year:this.industry.year,
                    industryid:this.industry2,
				}
				this.$ajax.post(apiConfig.industryUserAdd,industry).then((response)=>{
                    let _this = this
                    console.log(response.data);
                    if(response.data.code == 1){
                        console.log(response.data);
                        _this.industryFormVisible = false;
                        _this.$notify({
                            title: '成功',
                            message: '提交成功',
                            type: 'success'
                        });
                        this.detailList();
                    }
				})
            },
			//删除行业信息
            removeInduestry:function(row){
                this.$confirm('确认删除该用户关联行业信息吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    var id = row.id;
                    let _this = this;
                    this.$http.post(apiConfig.industryUserRemove,{id:id}).then((response)=>{
                        if(response.data.code == 1){
                            _this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            this.detailList();
                        }
                    })
                        .catch(function(response) {
                            console.log(response)
                        })
				})

			},
			//显示弹框
            companyInfrAdd:function () {
				this.companyFormVisible = true;
                this.company = {
                    userid:'',
                    labels:'',
                    jobLabelid:'',
                    job:'',
				};
				this.company.userid = this.userid
            },
            //标签搜索
            remoteMethod(query) {
                if(query !== ''){
                    setTimeout(() => {
                        const obj={category:2,name:query};
                        this.$ajax.get(apiConfig.labelSearch,obj).then((response)=>{
                            if (response.data.code == 1) {
                                var labelLists= response.data.original;
                                this.labelList = labelLists;
                            }
                        })
                    }, 200);
                }else{
                    this.labelList = []
                }
            },
            //提交公司信息
            companySubmit:function () {
                if(!this.company.labels){
                    this.$message.error('公司不能为空！');
                    return
				}
                if(!this.company.jobLabelid){
                    this.$message.error('职务标签不能为空！');
                    return
                }
                if(!this.company.job){
                    this.$message.error('职位不能为空！');
                    return
                }
                let _this = this
                this.$ajax.post(apiConfig.usercompanyAdd,_this.company).then((response)=>{
                    console.log(response.data);
                    if(response.data.code == 1){
                        console.log(response.data);
                        _this.companyFormVisible = false;
                        _this.$notify({
                            title: '成功',
                            message: '提交成功',
                            type: 'success'
                        });
                        this.detailList();
                    }
                })
            },
			//删除公司信息关联
            removeCompany:function (row) {
                var usercompanyid = row.userCompanyId;
                let _this = this;
                this.$confirm('确认删除该用户关联行业信息吗?', '提示', {
                }).then(() => {
                    this.$http.post(apiConfig.usercompanyRemove,{usercompanyid:usercompanyid}).then((response)=>{
                        if(response.data.code == 1){
                            _this.$notify({
                                title: '成功',
                                message: '提交成功',
                                type: 'success'
                            });
                            this.detailList();
						}
					})
						.catch(function(response) {
                        console.log(response)
                    })
				})

            },
			//添加公司
            addcompany:function () {
                this.companyListVisible = true
            },
			//省市列表
            getAreaList:function () {
                console.log(area);
                this.areaLists = area.allArea
            },
            provinceChange:function(){
                this.compList.city='';
            },
            //提交公司
            compListSubmit:function () {
                if(!this.compList.name){
                    this.$message.error('公司名称不能为空！');
                    return
				}
                if(!this.compList.shortName){
                    this.$message.error('公司简称不能为空！');
                    return
                }
                if(!this.compList.provinceid){
                    this.$message.error('省市不能为空！');
                    return
                }
                if(!this.compList.strengthLabelid){
                    this.$message.error('公司标签不能为空！');
                    return
                }

                this.$ajax.post(apiConfig.companyAdd,this.compList).then((response)=>{
                    let _this = this
                    console.log(response.data);
                    if(response.data.code == 1){
                        console.log(response.data);
                        _this.companyListVisible = false;
                        _this.$notify({
                            title: '成功',
                            message: '提交成功',
                            type: 'success'
                        });
                    }
                })
            },


		},

    };
</script>
<style>
	ul{
		list-style: none;
	}
	.tab-head-list{text-align: center; font-size: 18px}
	.detail-Img{
		position: absolute;
		right:6%;
		top: 5%;
		width: 150px;
		height: 150px;
		margin: 30px;
		border-radius: 50%;
		overflow:hidden;
		cursor: pointer;
	}
	.detail-name{
		display: inline-block;
		width: 100px;
		line-height:26px;
		color: #000000;
		padding: 3px 10px ;
	}
	.el-detail-content{
		display: inline-block;
		margin-left: 6px;
		font-size:14px;
		padding: 0;
		vertical-align: middle;
		color: gray;
	}
	.fl{
		float: left;
		margin-right: 40px;
		margin-bottom: 10px;
	}
	.c-select {
		display: table-cell;
	}
	.clearfix:after {
		display: table;
		clear: both;
		content: '';
	}
	.detaile-chesses li{
		border: 1px solid gainsboro;
		padding: 3px 10px ;
		float: left;
		color: black;
	}
		.chesses-name {
		padding: 3px 10px ;
		color: #000000;
		line-height: 24px;
	}

</style>