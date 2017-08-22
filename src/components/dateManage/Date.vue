<template  :is='curremtView' keep-alive>
	<section>
		<!--工具条-->
		<div>
			<el-row>
				<el-col :span="5" >
					<el-radio-group v-model="statusList.permit" name="permit"  >
						<el-radio-button label="1" >公开</el-radio-button>
						<el-radio-button label="2" >私密</el-radio-button>
						<el-radio-button label="3" >同学</el-radio-button>
					</el-radio-group>
				</el-col>
				<el-col :span="4"  >
					<el-radio-group v-model="statusList.isTop"  name="isTop"  >
						<el-radio-button label="1" >已置顶</el-radio-button>
						<el-radio-button label="0" >未置顶</el-radio-button>
					</el-radio-group>
				</el-col>
				<el-col :span="6"  >
					<span class='el-input-group__prepend'>状态</span>
					<el-select v-model="statusList.status" class='c-select ' size="small" >
						<el-option label="请选择" value=""></el-option>
						<el-option label="待打标签" value="1"></el-option>
						<el-option label="待匹配推荐" value="2"></el-option>
						<el-option label="推荐处理中" value="3"></el-option>
						<el-option label="待派发" value="4"></el-option>
						<el-option label="待响应" value="5"></el-option>
						<el-option label="进行中" value="x"></el-option>
						<el-option label="已完成" value="18"></el-option>
						<el-option label="已失效-系统取消" value="-100"></el-option>
						<el-option label="已失效-约局人取消" value="-40"></el-option>
						<el-option label="无人响应" value="-30"></el-option>
					</el-select>
				</el-col>

				<div class="clearfix"></div>
				<el-col :span="9" style="margin-top:8px">
					<el-input placeholder="" v-model="statusList.userid" style="max-width: 288px;" size="small" class='fl'>
						<template slot="prepend">约局人id</template>
					</el-input>
				</el-col>
				<el-col :span="7" style="margin-top:4px">
					<el-input placeholder="" v-model="statusList.needAppointUserId" style="max-width: 288px;" size="small" class='fl'>
						<template slot="prepend">应局人id</template>
					</el-input>
				</el-col>
				<div class="clearfix"></div>
				<el-col :span="9" >
					<span class='el-input-group__prepend'>约局人学院</span>
					<el-select v-model="statusList.userCollegeid"
							   name='college' class='c-select'
							   placeholder="请选择商学院" size="small">
						<el-option v-for="item in commercialLists" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-col>
				<el-col :span="7">
					<span class='el-input-group__prepend'>应局人学院</span>
					<el-select v-model="statusList.needAppointUserCollegeid"
							   name='college' class='c-select'
							   placeholder="请选择商学院" size="small">
						<el-option v-for="item in commercialLists" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-col>
			</el-row>

			<el-row type="flex" justify="center">
				<el-col :span="7" v-if="$store.getters.costin_need_manager" >
					<el-button type="primary" @click="needForm = true" style="width: 50%;margin-top: 10px;">代发需求</el-button>
				</el-col>
				<el-col :span="7">
					<el-button type="primary" @click="search" style="width:50%;margin-top: 10px;">查询</el-button>
				</el-col>
			</el-row>
		</div>
		<!-- 代发需求  -->
		<el-dialog title="代发需求" v-model="needForm" >
			<el-form :model="demand" >
				<el-form-item label="权限"  :label-width="'80px'" >
					<el-radio-group v-model="demand.secondType" >
						<el-radio class="radio" :label="item.typeid" :key="item.typeid" v-for="item in needDateList.needTypes">{{item.typeName}}</el-radio>

					</el-radio-group>
				</el-form-item>
				<el-form-item label="类型" :label-width="'80px'" >
					<el-radio-group v-model="demand.permit" >
						<el-radio class="radio" :label="item.permit" :key="item.permit"
								  v-for="item in needDateList.permits " >{{item.name}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item  label="标签":label-width="'80px'"
							   v-if="demand.permit=='1'" prop="channels">
						<el-checkbox-group v-model="demand.channels"  :max="3">
						<el-checkbox :label="item.channelid" :key="item.channelid"
									 v-for="item in needDateList.channels">{{item.channelName}}</el-checkbox>
					</el-checkbox-group>
					<span style="color:red;font-size: 12px;">请至少选择一个标签，最多选择三个标签</span>
				</el-form-item>

				<el-form-item label="用户id" :label-width="'80px'" prop="userid">
					<el-input v-model="demand.userid" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="需求描述" :label-width="'80px'" prop="description">
					<el-input v-model="demand.description" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="需求id" :label-width="'80px'" prop="userid">
					<el-input v-model="demand.neeid" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="needForm = false">取 消</el-button>
				<el-button type="primary" @click.native="needFormsub">确 定</el-button>
			</div>
		</el-dialog>
		<template>
			<el-table :data="needList" highlight-current-row  style="width: 100%;">
				<el-table-column prop="userid" label="用户id" width="80" align="center" >
				</el-table-column>
				<el-table-column prop="needid" label="需求id" width="90"  align="center">
				</el-table-column>
				<!--<el-table-column prop="leanCloudId" label="聊天用户id" width="180" >-->
				<!--</el-table-column>-->
				<el-table-column prop="description" label="描述" width="350" >
				</el-table-column>
				<el-table-column prop="firstType" label="分类" width="140" align="center" >
				</el-table-column>
				<el-table-column prop="permitName" label="权限类型名称" width="140"  align="center">
				</el-table-column>
				<el-table-column prop="statusName" label="状态" width="140" align="center" >
				</el-table-column>
				<el-table-column prop="statusName" label="置顶状态" :formatter="formatTopStatus" width="140" align="center" >
				</el-table-column>
				<el-table-column fixed="right" inline-template :context="_self" label="操作" width="200" align="left">
					<span>
						<el-button  type="info" size="small" @click="getNeedDetail(row)">详情</el-button>
						<el-button  v-if="costin_need_manager" style="background: #A5A5A5" size="small" @click="needDelete(row)" >删除</el-button>
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
					:render="needlist"
					:options="filters"
					style="float:right"
			/>
		</el-col>
	</section>
</template>

<script>
    import  util from '../../common/util'
    import NProgress from 'nprogress'
    import Pagination from 'components/common/Pagination.vue'
    import { getCache,setCache,formatTimeString,containMenu } from 'utils/tool'
    import apiConfig from 'utils/apiConfig'
    import ElForm from "../../../node_modules/element-ui/packages/form/src/form";

    export default {
        components: {
            ElForm,
            Pagination
        },

        data() {
            return {
                userid:'',
                neeid:'',
                radioChange:'',
				permit:'',
				isTop:'',   //是否置顶
                secondType:'',
                channels:[],
                needList: [],
                commercialLists:[], //学院信息
                pagation: {
                    pageIndex: 1,
                    pageSize: 20,
                    totalCount: 128,
                },
                filters: {
                    pageSize: 20,
                    pageIndex:1 ,
                },
                formInline: {
                    user: ''
                },

				//状态列表
                statusList:{
                    permit:'',
                    status:'',
					demand:'',
                    userid:'',
					isTop:'',
                    userCollegeid:'',
                    needAppointUserId:'',
                    needAppointUserCollegeid:'',
                },
				//代发需求
                needForm: false,
                demand: {
                    needid:'',
                    userid: '',
                    description:'',
                    secondType:'',
                    permit:'',
                    channels:[]
                },
                needDateList:{},

            }
        },
		watch:{
            demand: {
                handler: function (val, oldVal) { },
                deep: true
            }
		},
        computed:{
            costin_need_manager(){
                return this.$store.getters.costin_need_manager
            }
		},
        mounted () {
            this.$store.dispatch('changeload', true)
			this.needlist()
			this.needDateLabel()
			this.CollegeList()

        },
        methods: {
            convertData (original) {
                this.pagation.totalCount = original.totalCount
                this.pagation.pageIndex = original.pageIndex
                this.pagation.pageSize = original.pageSize
                this.filters.pageSize = original.pageSize
                this.needList = original.pageList.map((item) => {
                    return item
                })
            },
			//置顶状态
            formatTopStatus:function(row,column){
				/*console.log(row.isTop)*/
                return row.isTop==0?'未置顶':row.isTop==1?'已置顶':'未知';
            },
			//学院列表
            CollegeList(){
				this.$ajax.get(apiConfig.commercial).then((response)=>{
					//回调成功
					/*console.log('学院列表',response.data)*/
					if(response.data.code == 1){
					    this.commercialLists = response.data.original;
					}
				})
				.catch(function(response) {
					console.log(response)
				})
			},

			//列表查询
            needlist(){
                let _this = this
                const localfilters = getCache({ key: 'filters' })
				//console.log(localfilters)
                if(localfilters){
                    this.filters=localfilters
                }
                this.$ajax.get(apiConfig.needList,Object.assign(this.filters, this.statusList)).then((response) => {
                    // 响应成功回调
                    if (response.data.code == 1) {
                        _this .convertData (response.data.original)
                        sessionStorage.removeItem('filters')
                    }  else if(response.data.code == '11001'){
                        sessionStorage.removeItem('realName')
                        this.$router.push('/login');
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },
            //性别显示转换
            formatYes:function(row,column){
                return row.checkIndustry==1?'是':row.checkIndustry==0?'否':'未知';
            },
			//状态查询
            search: function () {
                // 用户筛选的条件
                let _this = this
                this.$ajax.get(apiConfig.needList,Object.assign(this.filters, this.statusList)).then((response) => {
                    // 响应成功回调
                    //要换成未生成邀请码的status
                    if (response.data.code == 1) {
                        console.log('查询需求',response.data)
                        _this .convertData (response.data.original)

                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
            },


            getNeedDetail:function (row) {
                //this.userDetailVisible=true;
                const id =row.needid
                setCache({
                    key: 'needid',
                    value: id
                })
                setCache({
                    key: 'filters',
                    value: this.filters
                })
                this.$router.push('/dateDetail');
            },



            //删除
            needDelete:function (row) {
				const id = row.needid
				var _this=this;
				this.$prompt('删除原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showInput:true
				}).then(({ value }) => {
					NProgress.start();
					var remark = value;
                    this.$ajax.put(apiConfig.needDelete + '?' +'id'+'='+id + '&' + 'remark'+ '='+ remark )
						.then((response) => {
                        // 响应成功回调
                            NProgress.done();
                        if (response.data.code == 1) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.needlist();
                        }

                    })
                        .catch(function(response) {
                            console.log(response)
                        })

				}).catch(() => {

                });

            },
            //提交需求
            needFormsub:function(){
                if(!this.demand.secondType){
                    this.$message.error('请选择类型！');
                    return
                }
                if(!this.demand.permit){
                    this.$message.error('请选择需求权限！');
                    return
                }
				if(!this.demand.userid){
                    this.$message.error('请输入用户id！');
                    return
				}

                if(!this.demand.description){
                    this.$message.error('请输入描述！');
                    return
                }

                if(this.demand.permit==1&&this.demand.channels.length==0){
                    this.$notify({
                        title: '失败',
                        message: '请至少选择一个标签',
                        type: 'error'
                    });
                    return
				}
                    this.$ajax.post(apiConfig.demandList,this.demand).then((response)=>{
                        if(response.data.code == 1){
                            this.needForm=false;
                            console.log ('代发需求',response.data)
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            this.needlist()
                        }else{
                            this.$notify({
                                title: '失败',
                                message: response.data.msg,
                                type: 'error'
                            });
                        }
                    })
			},


			//数据请求

            needDateLabel(){
                this.$ajax.get(apiConfig.demandPre).then((response)=>{
                    if(response.data.code == 1){
//                        console.log(response.data);
                        this.needDateList = response.data.original;
                        /*console.log(this.needDateList);*/
                        /*const cityOptions = needDateList.channelName;*/
                        //console.log(cityOptions);

                    }
                })
            },


        }
    }
</script>

<style scoped>
	.toolbar .el-form-item {
		margin-bottom: 10px;
	}

	.toolbar {
		background: #fff;
		padding: 10px 10px 0px 10px;
	}
	.key-tit {
		margin-top: 10px;
		margin-bottom: 5px;
	}
	.key-content {
		padding: 10px;
		width: 50%;
		text-align: center;
		border: 1px solid #CBCBCB;
		margin-bottom: 20px;
	}
	.c-select {
		display: table-cell;
		-webkit-tap-highlight-color:transparent;
		outline: none;
		-webkit-appearance: none;
	}
	.el-input-group__prepend {
		width: 80px;
		font-size: 14px;
		padding: 0;
	}
	.el-detail-name{
		background: gainsboro;
		display: inline-block;
		width: 100px;
		line-height: 24px;
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
	.btn-recommend{
		line-height: 20px;
		display: inline-block;
		padding: 10px 22px;
		margin-right: 10px;
		margin-bottom: 10px;
	}
	.clearfix:after {
		display: table;
		clear: both;
		content: '';
	}
	.txt-detail{
		float: left;
		list-style:none;
		margin:0;
	}
	.txt-detail li{
		margin-bottom: 10px;
		font-size:16px;
		width: 450px;
	}
	.el-table .info-row {
		color: grey;
		background: gainsboro;
	}
	.demo-table-expand {
		font-size: 0;
	}
	.demo-table-expand label {
		width: 90px;
		color: #99a9bf;
	}
	.demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 25%;
	}


</style>