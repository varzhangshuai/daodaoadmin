<template>
	<section style="min-width: 1020px">
		<div class="clearfix" >
			<el-row type="flex" justify="center" v-if="$store.getters.costin_need_manager">
				<el-col :span="7">
					<el-button type="primary" @click=" reviseDetail" style="width: 60%;margin-top: 10px;">修改需求</el-button>
				</el-col>
			</el-row>

			<div class="div-bac">
				<h3>约局信息</h3>
				<div class="div1 clearfix">
					<div  class="div1-1">
						<div>
							<span class='el-detail-name'>置顶服务</span>
							<el-button  type="info" size="small" @click="needTop" v-if="this.needDetail.isTop==0">置顶</el-button>
							<el-button  size="small" @click="needTop" v-if="this.needDetail.isTop==1">取消置顶</el-button>
						</div>
						<div><span class='el-detail-name'>需求ID</span><span class='el-detail-content'>{{ needDetail.needid }}</span></div>
						<div>
							<span class='el-detail-name'>用户ID</span><span class='el-detail-content'>{{ needDetail.userid }}</span>
							<el-button type="text" @click="getRecommendsDetail(needDetail)" >查看详情</el-button>
						</div>
						<!--<div><span class='el-detail-name'>花名</span><span class='el-detail-content'>{{ needDetail.nickname }}</span></div>-->
					</div>
					<div class="div1-2" style="margin-bottom:2px ">
						<div><span class='el-detail-name'>需求状态</span><span class='el-detail-content'>{{ needDetail.statusName }}</span></div>
						<div><span class='el-detail-name'>需求类型</span><span class='el-detail-content'>{{ needDetail.firstTypeName }},{{ needDetail.secondTypeName }}</span></div>
						<div><span class='el-detail-name'>谁可以看</span ><span class='el-detail-content'>{{ needDetail.permitName }}</span></div>
					</div>

					<div class="div1-3 clearfix" style="margin-bottom: 20px">
						<div class="clearfix"><div class=' div1-3-name'>需求</div><div class='el-detail-content div1-3-con'>{{ needDetail.description }}</div></div>
					</div>

					<div class="div1-3 clearfix">
						<div class="clearfix"><div class=' div1-3-name'>频道</div><span class='el-detail-content div1-3-con' v-for="item in needDetail.channels">{{ item.name }}</span></div>
					</div>

				</div>

			</div>

			<!--history操作历史-->
			<div v-if="needDetail.history != []" class="div-bac">
				<h3>操作记录</h3>
				<div style="margin-left:20px;" >
					<el-table :data="needDetail.history" highlight-current-row   style="width: 901px">
						<el-table-column prop="oldStatusName" label="之前状态" align="center" width="200" ></el-table-column>
						<el-table-column prop="statusName" label="之后状态" align="center" width="200" ></el-table-column>
						<el-table-column prop="remark" label="操作摘要" align="center" width="300" ></el-table-column>
						<el-table-column prop="ctime" label="操作时间" align="center" width="200" ></el-table-column>
					</el-table>
				</div>
			</div>
			<!--appoints应邀对象-->
			<div v-if="needDetail.appoints != []" class="div-bac">
				<h3>应局信息</h3>
				<div style="margin-left:20px;" >
					<el-table :data="needDetail.appoints" highlight-current-row   style="width: 971px">
						<el-table-column prop="userid" label="应局用户ID" align="center" width="110" ></el-table-column>
						<el-table-column prop="userName" label="应邀用户名" align="center" width="120" ></el-table-column>
						<el-table-column prop="meetTime" label="见面时间" align="center" width="200" ></el-table-column>
						<el-table-column prop="cityName" label="见面城市" align="center" width="120" ></el-table-column>
						<el-table-column prop="addr" label="见面地点" align="center" width="300" ></el-table-column>
						<el-table-column prop="status" label="进行状态" :formatter="formatStatus"  align="center" width="120" ></el-table-column>
					</el-table>
				</div>
			</div>
		</div>
		<!--添加标签-->
		<template >
			<div class="clearfix div-bac">
				<h3>需求标签</h3>
				<div class="add-key" style="margin-left:10px;" >
					<!--v-if="needDetail.showLableButton == 1"-->
					<div>
						<div v-if="$store.getters.costin_need_recommend" class="clearfix">
							<h5 style="color: #7C7C7C">添加标签</h5>
							<ul class="add-key-item" >
									<li style="width: 50%">
										<span>公司：</span>
										<div style="display: inline-block;width:45%">
											<el-select  style="width:100% ;display: inline-block" class='c-select' v-model="company.labels" filterable remote placeholder="请输入公司名称" :remote-method="remoteMethod" :loading="keyloading">
												<el-option v-for="item in labelList" :key="item.labelid"  :label="item.name" :value="item.labelid"></el-option>
											</el-select>
										</div>
										<el-input placeholder="匹配度(默认:5)" v-model="company.weight" style="width: 25%; margin: 10px;display: inline-block" ></el-input>
										<el-button type="primary" icon="plus" @click="addcompany" style="margin-top: 10px;display: inline-block"></el-button>
										<div class="pipei-tip">
											匹配度默认为5，可选0-10的整数
										</div>
									</li>

									<li style="width: 50%">
										<span>地域：</span>
										<div style="display: inline-block;width:45% ">
											<el-select style="width: 48%" v-model="areaList.province" name='province'  placeholder="请选择省份" size="normal"  @change="provinceChange">
												<el-option v-for="item in areaLists" :key="item.id" :label="item.name" :value="item.id"></el-option>
											</el-select>
											<el-select style="width: 49%" v-model="areaList.city" name='city'  placeholder="请选择城市" size="normal" >
												<el-option v-for="item in onCity" :key="item.id" :label="item.name" :value="item.id"></el-option>
											</el-select>
										</div>
										<el-input placeholder="匹配度(默认:5)" v-model="areaList.weight" style="width: 25%; margin: 10px;display: inline-block" ></el-input>
										<el-button type="primary" icon="plus" @click="addares" style="margin-top: 10px;display: inline-block"></el-button>
										<div class="pipei-tip">
											匹配度默认为5，可选0-10的整数
										</div>
									</li>
									<li style="width: 50%">
										<span>专长：</span>
										<div style="display: inline-block;width:45% ">
											<el-select style="width:100% ;"  v-model="metier.labelid" name='labelid'  placeholder="请选择专长" size="normal" >
												<el-option v-for="item in metierList" :key="item.labelid" :label="item.name" :value="item.labelid"></el-option>
											</el-select>
										</div>
										<el-input placeholder="匹配度(默认:5)" v-model="metier.weight" style="width: 25%; margin: 10px;display: inline-block" >
										</el-input>
										<el-button type="primary" icon="plus" @click="addmetier" style="margin-top: 10px;display: inline-block"></el-button>
										<div class="pipei-tip">
											匹配度默认为5，可选0-10的整数
										</div>
									</li>
									<li style="width: 50%">
										<span>性别：</span>
										<div style="display: inline-block;width:45%">
											<el-select style="width:100% ;" v-model="sexes.labels" name='labelid'  placeholder="请选择性别" size="normal" >
												<el-option  label="男"  value="1"></el-option>
												<el-option  label="女"  value="2"></el-option>
											</el-select>
										</div>
										<el-input placeholder="匹配度(默认:5)" v-model="sexes.weight" style="width: 25%; margin: 10px;display: inline-block" >
										</el-input>
										<el-button type="primary" icon="plus" @click="addsex" style="margin-top: 10px;display: inline-block"></el-button>
										<div class="pipei-tip">
											匹配度默认为5，可选0-10的整数
										</div>
									</li>

									<li style="width: 100%">
										<span>行业：</span>
										<div style="display: inline-block;width:60%">
											<!--联动-->
											<el-select style="width:24% ;"  v-model="industry.labels" name='labels'  placeholder="请选择行业" size="normal"  @change="industryOneChange()" >
												<el-option v-for="item in industryList" :key="item.industryid" :label="item.industryName" :value="item.industryid"></el-option>
											</el-select>
											<el-select style="width:24% ;"  v-model="industry2" name='labels'  placeholder="请选择2级行业" size="normal" @change="industryTwoChange()" :disabled="selectdisTwo">
												<el-option v-for="item in industryListTwo" :key="item.industryid" :label="item.industryName" :value="item.industryid"></el-option>
											</el-select>
											<el-select style="width:24% ;"  v-model="industry3" name='labels'  placeholder="请选择3级行业" size="normal"  @change="industryThreeChange()" :disabled="selectdisThree">
												<el-option v-for="item in industryListThree" :key="item.industryid" :label="item.industryName" :value="item.industryid"></el-option>
											</el-select>
											<el-select style="width:24% ;"  v-model="industry4" name='labels'  placeholder="请选择4级行业" size="normal" :disabled="selectdisFour" >
												<el-option v-for="item in industryListFour" :key="item.industryid" :label="item.industryName" :value="item.industryid"></el-option>
											</el-select>
										</div>
										<el-input placeholder="匹配度(默认:5)" v-model="industry.weight" style="width: 25%; margin: 10px;display: inline-block" >
										</el-input>
										<el-button type="primary" icon="plus" @click="addindustry" style="margin-top: 10px;display: inline-block"></el-button>
										<div class="pipei-tip">
											匹配度默认为5，可选0-10的整数
										</div>
									</li>
								</ul>
							</div>
					</div>
					<div >
						<h5 style="color: #7C7C7C">已添加的标签</h5>
						<div>
							<el-table :data="needDetail.labels" highlight-current-row >
								<el-table-column prop="categoryName" :formatter="formatCatename" label="类型" align="center" width="240" ></el-table-column>
								<el-table-column prop="name" label="标签" align="center" width="240" ></el-table-column>
								<el-table-column prop="weight" label="匹配度" align="center" width="240" ></el-table-column>
								<el-table-column fixed="right" inline-template :context="_self" label="操作" width="120" align="center">
									<span>
										<el-button style="background: #A5A5A5" size="small" @click="labelDelete(row)" >删除</el-button>
									</span>
								</el-table-column>
							</el-table>
						</div>
					</div>
				</div>
			</div>
		</template>
		<!--匹配列表-->
		<div  class="div-bac">
			<h3>匹配列表</h3>
			<template v-if="recommendsList != []" style="margin-left:10px;" >
				<div style="margin-left:10px;" class="clearfix">
					<div  v-if="$store.getters.costin_need_recommend" style="float: left;width: 50%" >
						<!--:disabled="needDetail.status != 2"-->
						<el-button   type="info"  @click="showRecommendButton"  style="display:inline-block ;width: 44%" >开始系统匹配</el-button>
						<span style="display: inline-block;margin-left: 3%">已匹配人数：<span style="color: red">{{ matchcount }}</span> ,已派发人数：<span style="color: green">{{ distributecount }}</span> 。 </span>
					</div>
					<div  v-if="$store.getters.costin_need_recommend" style="float: left;width: 50%"  >
						<el-input placeholder="请输入匹配内容" v-model="needMatch"  style="display:inline-block;width: 30%"></el-input>
						<el-button type="info" @click="matchButton" style="display:inline-block;width: 30%" :disabled="needDetail.showMatchButton == 0" >人工匹配</el-button>
					</div>
					<div style="float:left; margin: 30px 10px 5px; ">
						<el-button size="small" type="success" style="padding: 8px 35px" :disabled="multipleSelection.length > 0 ? false : true"  @click.native="allDistribute(index-1)" >批量派发</el-button>
					</div>
					<el-table  :data="recommendsList" highlight-current-row  style="width: 100%;margin-left: 10px;table-layout: fixed "  @selection-change="handleSelectionChange" :row-class-name="tableRowClassName">
						<el-table-column align="center" type="selection" width="55"></el-table-column>
						<el-table-column prop="userid" label="推荐用户id" align="center" width="120" ></el-table-column>
						<el-table-column prop="realName" label="姓名" align="center" width="120" ></el-table-column>
						<el-table-column prop="weight" label="权重" width="100" align="center" ></el-table-column>
						<el-table-column align="center" prop="statusName" label="状态" width="180" ></el-table-column>
						<el-table-column align="center" prop="type" label="类型" :formatter="formatType" width="180" ></el-table-column>
						<el-table-column align="center" prop="recommendType" label="匹配方式" :formatter="formatRecommendType" width="180" ></el-table-column>
						<!--<el-table-column align="center" prop="statusName" label="派发时间" width="180" ></el-table-column>-->
						<el-table-column  prop="remark" label="分值(匹配度x权重)" width="300" >
						</el-table-column>
						<el-table-column fixed="right" inline-template :context="_self" label="操作" width="200">
							<span>
								<el-button v-if="row.status == '1'" type="info" size="small" @click="distributeButton(row)">派发</el-button>
								<el-button v-if="row.status == '2'" type="info" size="small" :disabled="true">已派发</el-button>
								<el-button  type="info" size="small" @click="getRecommendsDetail(row)">详情</el-button>
							</span>
						</el-table-column>
					</el-table>
				</div>
			</template>

		</div>
		<!--详情-->
		<el-dialog :title="recommendDetailTitle" v-model="recommendDetailVisible" :close-on-click-modal="false" >
			<h2>
				<img :src="recommendDetail.headUrl" class="headImg"  />
			</h2>
			<ul class="txt-detail">
				<li><span class='el-detail-name'>用户ID</span><span class='el-detail-content'>{{ recommendDetail.userid }}</span></li>
				<li><span class='el-detail-name'>手机号</span><span class='el-detail-content'>{{ recommendDetail.mobilePhone }}</span></li>
				<!--<li><span class='el-detail-name'>花名</span><span class='el-detail-content'>{{ recommendDetail.nickName }}</span></li>-->
				<li><span class='el-detail-name'>姓名</span><span class='el-detail-content'>{{ recommendDetail.realName  }}</span></li>
				<li><span class='el-detail-name'>类型名</span><span class='el-detail-content'>{{ recommendDetail.typeName }}</span></li>
				<li><span class='el-detail-name'>性别</span><span class='el-detail-content'>{{ recommendDetail.gender == '1' ? '男' : '女' }}</span></li>
				<li><span class='el-detail-name'>学院届别</span ><span class='el-detail-content'>{{ recommendDetail.className }}</span></li>
				<li><span class='el-detail-name'>状态名</span><span class='el-detail-content'>{{ recommendDetail.statusName }}</span></li>
				<li><span class='el-detail-name'>发需求数</span><span class='el-detail-content'>{{ recommendDetail.needCount }}</span></li>
				<li><span class='el-detail-name'>应局数</span><span class='el-detail-content'>{{ recommendDetail.appointCount }}</span></li>
				<li><span class='el-detail-name'>活跃指数</span><span class='el-detail-content'>{{ recommendDetail.active }}</span></li>
				<li><span class='el-detail-name'>完整度</span ><span class='el-detail-content'>{{ recommendDetail.integrity }}</span></li>
				<li><span class='el-detail-name'>评价评分</span><span class='el-detail-content'>{{ recommendDetail.commentScore }}</span></li>
				<li><span class='el-detail-name'>评价数量</span><span class='el-detail-content'>{{ recommendDetail.commentCount }}</span></li>
				<li><span class='el-detail-name'>最近登录时间</span><span class='el-detail-content'>{{ recommendDetail.loginTime }}</span></li>
				<li><span class='el-detail-name'>注册时间</span><span class='el-detail-content'>{{ recommendDetail.registerTime }}</span></li>
			</ul>
			<div class="clearfix">
				<ul class="detaile-chesses" >
					<li class="detaile-chesses-name">频道列表</li>
				</ul>
				<ul v-for="item in chessesList" class="detaile-chesses">
					<li v-text="item.name"></li>
				</ul>
			</div >
			<div class="clearfix">
				<ul class="detaile-chesses " >
					<li class="detaile-chesses-name">行业信息</li>
				</ul>
				<ul v-for="item in recommendDetail.induestries" class="detaile-chesses">
					<li >
						<div>行业： {{ item.name }} </div>
						<div>工作年限： {{ item.year }} </div>
					</li>
				</ul>
			</div>
			<div class="clearfix">
				<ul class="detaile-chesses " >
					<li class="detaile-chesses-name">公司信息</li>
				</ul>

				<ul v-for="item in recommendDetail.companies" class="detaile-chesses">
					<li >
						<div>公司： {{ item.companyName }} </div>
						<div>职务： {{ item.job }} </div>
						<div>所在地： {{ item.provinceName }} {{item.cityName}} </div>
					</li>
				</ul>
			</div>
			<div v-if="otherImpress" class="clearfix">
				<ul class="detaile-chesses " >
					<li class="detaile-chesses-name">{{otherImpress.typeName || '他人印象' }}</li>
				</ul>
				<ul v-for="item in otherImpress.labels" class="detaile-chesses">
					<li v-text="item.labelName"></li>
				</ul>
			</div>
			<div v-if="personalLabels" class="clearfix" >
				<ul class="detaile-chesses " >
					<li class="detaile-chesses-name">{{personalLabels.typeName || '个人标签' }}</li>
				</ul>
				<ul v-for="item in personalLabels.labels" class="detaile-chesses">
					<li v-text="item.labelName"></li>
				</ul>
			</div>
			<div v-if="systemLabels" class="clearfix" >
				<ul class="detaile-chesses " >
					<li class="detaile-chesses-name">{{systemLabels.typeName || '系统标签' }}</li>
				</ul>
				<ul v-for="item in systemLabels.labels" class="detaile-chesses">
					<li v-text="item.labelName"></li>
				</ul>
			</div>
		</el-dialog>
		<!-- 代发需求  -->
		<el-dialog title="修改需求" v-model="reviseDetailShow" >
			<el-form :model="demand" >
				<el-form-item label="权限"  :label-width="'80px'" >
					<el-radio-group v-model="demand.secondType" >
						<el-radio class="radio" :label="item.typeid" :key="item.permit" v-for="item in needDateList.needTypes">{{item.typeName}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="类型" :label-width="'80px'" >
					<el-radio-group v-model="demand.permit" >
						<el-radio class="radio" :label="item.permit" :key="item.permit" v-for="item in needDateList.permits ">{{item.name}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item  label="标签" :label-width="'80px'"
							   v-if="demand.permit=='1'" prop="channels">
					<el-checkbox-group v-model="demand.channels" :min="1" :max="3">
						<el-checkbox :label="item.channelid" :key="item.channelid" v-for="item in needDateList.channels">{{item.channelName}}</el-checkbox>
					</el-checkbox-group>
					<span style="color:red;font-size: 12px;">请至少选择一个标签，最多选择三个标签</span>
				</el-form-item>
				<!--<el-form-item label="用户id" :label-width="'80px'" prop="userid">-->
					<!--<el-input v-model="demand.userid" auto-complete="off"></el-input>-->
				<!--</el-form-item>-->
				<el-form-item label="需求描述" :label-width="'80px'" prop="description">
					<el-input v-model="demand.description" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item v-show="false" label="需求id" :label-width="'80px'" prop="userid">
					<el-input v-model="demand.neeid" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="needForm = false">取 消</el-button>
				<el-button type="primary" @click.native="needFormsub">确 定</el-button>
			</div>
		</el-dialog>

	</section>
</template>
<script>
    import util from '../../common/util'
    import NProgress from 'nprogress'
    import Pagination from 'components/common/Pagination.vue'
    import { getCache, setCache, formatTimeString,containMenu } from 'utils/tool'
    import apiConfig from 'utils/apiConfig'
	import area from 'utils/area'

    export default{
        data(){
            return {

                //详情
                needDetail: {},
                chessesList: [],//棋子列表

                //添加标签
                labelCategorys: [],//标签类型
                labelList: [],//标签列表
                recommendsList: [],

                //推荐remark
                recommendRemark: [],

                company: {
                    labels: '',
                    weight: ''
                },
                industry: {
                    labels: '',
                    weight: '',
                },
                industry2: '',
                industry3: '',
                industry4: '',
                selectdisTwo: true,
                selectdisThree: true,
                selectdisFour: true,

                objtest: [],
                sexes: {
                    labels: '',
                    weight: ''
                },
                //全部标签
                metierList: [],
                //thepostList:[],
                //firmstrengthList:[],
                //专长
                metier: {
                    labelid: '',
                    weight: ''
                },
                thepost: {
                    labelid: '',
                    weight: ''
                },
                firmstrength: {
                    labelid: '',
                    weight: ''
                },
                //地区
                areaList: {
                    province: '',
                    city: '',
                    weight: ''
                },
                areaLists: [],
                keyloading: false,
                //添加行业

                industryList: [],
                //性别
                //人工匹配
                needMatch: '',
                //勾选框
                multipleSelection: [],
                // userDetail:{},
                recommendDetailTitle: '推荐用户详情',
                recommendDetailVisible: false,
                recommendDetail: {},
                otherImpress: {},
                personalLabels: {},
                systemLabels: {},
                //已匹配人数
                matchcount: '0',
                distributecount: '0',

                //代发需求
                reviseDetailShow: false,
                demand: {
                    needid:'',
                    userid: '',
                    description:'',
                    secondType:'',
                    permit:'',
                    channels:[]
                },
                needDateList:{}
            }

		},
        computed:{
            onCity(){
                if(!this.areaLists)
                    return
                for (var item of this.areaLists) {
                    if (this.areaList.province == item.id) {
                        return item.children
                    }
                }
            },
            industryListTwo(){
               if(this.industryList==[])
                   return
				for (var item of this.industryList){
                   if(this.industry.labels==item.industryid){
                       return item.children
				   }
				}
			},
            industryListThree(){
                if(!this.industryListTwo)
                    return
                for (var item of this.industryListTwo){
                    if(this.industry2==item.industryid){
                        //this.selectdisThree = false
                        return item.children
                    }
                }
            },
            industryListFour(){
                if(!this.industryListThree)
                    return
                for (var item of this.industryListThree){
                    if(this.industry3==item.industryid){
                       // this.selectdisFour = false
                        return item.children
                    }
                }
            }

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
            industryListThree:{
                handler(obj){
                    if(obj){
                        if(obj.length==0){
                            return
                        }
                        this.selectdisThree = false
                    }else {
                        this.selectdisThree = true
                    }
                },
                deep: true
            },
            industryListFour:{
                handler(obj){
                    if(obj){
						if(obj.length==0){
                            return
						}
                        this.selectdisFour = false
                    }else {
                        this.selectdisFour = true
                    }
                },
                deep: true
            },
		},

        mounted () {
            this.$store.dispatch('changeload', true)
            this.getNeedDetail();
            this.needDateLabel()
        },
		methods:{

            convertData (original) {
                this.needDetail = original;
				this.recommendsList = original.recommends;
				for(var i=0;i<this.recommendsList.length;i++ ){
                   this.recommendRemark = this.recommendsList[i].remark

				}
				//去掉了showbutton的判断
//                showLableButton == 1
                    this.labelCategory()
                    this.getAreaList()
                    this.industrylist()
                    this.getAllLabels()


				if(this.recommendsList){
                    this.matchcount = this.recommendsList.length
                    this.distributecount = this.querymatch(this.recommendsList,{ status:2 }).length
				}


            },
            querymatch:function (collection,source) {
                //collection代表被测试的对象数组，source为被测试的属性值对（or对象）。
                //使用Object.keys()方法获取这个对象的所有属性，并返回为一个数组。
                var sourceKeys = Object.keys(source);

                //使用filter()方法过滤出符合条件的数组对象。
                return collection.filter(function(obj){
                    //遍历source的所有属性
                    for(var i=0;i<sourceKeys.length;i++){
                        //如果obj中不存在那些属性，或属性不匹配，则返回false，即为不符合条件。
                        if(!obj.hasOwnProperty(sourceKeys[i]) || obj[sourceKeys[i]]!==source[sourceKeys[i]]){
                            return false;
                        }
                    }
                    return true;
                });
            },
            getNeedDetail:function(row){
                var id
                if (row){
                    id= row.needid
                }else{
                    id= getCache({ key: 'needid' });
				}

                this.$ajax.get(apiConfig.needDetail,{id:id}).then((response) => {
                    // 响应成功回调
                    if (response.data.code == 1) {
//                        console.log('刷新详情页',response.data)
                        this.convertData (response.data.original)

                    }else if(response.data.code == "11001"){
						sessionStorage.removeItem('realName')
						this.$router.push('/login');
					}
                })
					.catch(function(response) {
                        console.log(response)
                    })
            },

            //约局对象状态
            formatStatus:function(row,column){
                return row.status==6?'应邀人已阅读'
                    :row.status==5?'已派发'
                    :row.status==7?'已感兴趣'
                    :row.status==8?'已发邀请函'
                    :row.status==9?'待见面'
                    :row.status==15?'双方未评'
                    :row.status==16?'发起人评价'
                    :row.status==17?'应邀人评价'
                    :row.status==-15?'未赴约'
                    :'未知';
            },
			//获取全部标签
            getAllLabels:function () {
                this.$ajax.get(apiConfig.labelAll).then((response)=>{
                    if (response.data.code == 1) {
                        this.metierList = response.data.original[0].labels

                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },

            //标签类型
            labelCategory:function () {
                this.$ajax.get(apiConfig.category).then((response) => {
                    // 响应成功回调
                   // console.log('labelCategorys',response.data)
                    if (response.data.code == 1) {
                        this.labelCategorys = response.data.original
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },
            //标签搜索
            remoteMethod(query) {
				if(query !== ''){
                    setTimeout(() => {
                        this.loading = false;
                        const obj={category:2,name:query};
                        this.$ajax.get(apiConfig.labelSearch,obj).then((response)=>{
                            if (response.data.code == 1) {
                                this.keyloading = false;
                                var labelLists= response.data.original;
//                                console.log(labelLists)
                                this.labelList = labelLists;
                            }
                        })
					}, 200);
				}else{

                    this.labelList = []
                }
            },
            //省市列表
            getAreaList:function () {
                console.log(area);
                this.areaLists = area.allArea
            },
            //行业
            industrylist: function () {
                this.$ajax.get(apiConfig.industry).then((response) => {
                    // 响应成功回调
                    console.log(response.data)
                    if (response.data.code == 1) {
                        this.industryList = response.data.original
                    }
                })
            },
			//selectchange
            industryOneChange:function (item) {
                this.industry2='';
                this.industry3='';
				this.industry4='';
            },
            industryTwoChange:function (item) {
                this.industry3='';
                this.industry4='';
            },
            industryThreeChange:function (item) {
                this.industry4='';
            },



			addcompany:function(){
                if(!this.company.labels){
                    this.$message.error('请输入公司！');
				}else{
                    if(!this.company.weight){
                        this.company.weight = 5
                    }
                    this.$ajax.post(apiConfig.addLabel+'?'+'label_'+ this.company.labels +'='+ this.company.weight ,{ id:this.needDetail.needid,category:2} ).then((response) => {
                        if (response.data.code == 1) {
                            this.getNeedDetail(this.needDetail);
                            this.$message({
                                message: '添加公司成功！',
                                type: 'success'
                            });

                        }else{
                            this.$message({
                                showClose: true,
                                message: response.data.msg,
                                type: 'warning'
                            });
                        }
                        this.company = {  labels:'', weight:'' };
                    })
				}
			},
			addares(){
                if( !this.areaList.province  ){
                    this.$message.error('请选择地域！');
                }else{
                    var label = 'label_';
                    if(this.areaList.city){
                        label+=this.areaList.city
                    }else if(!this.areaList.city && this.areaList.province){
                        label+=this.areaList.province;
                    }
                    if(!this.areaList.weight){
                        this.areaList.weight = 5
                        label+=('='+this.areaList.weight)
                    }

                    this.$ajax.post(apiConfig.addLabel+'?'+label ,{ id:this.needDetail.needid,category:1} ).then((response) => {
                        if (response.data.code == 1) {
                            this.getNeedDetail(this.needDetail);
                            this.$message({
                                message: '添加地域成功！',
                                type: 'success'
                            });
                        }else{
                            this.$message({
                                showClose: true,
                                message: response.data.msg,
                                type: 'warning'
                            });
                        }
                        this.areaList = { province:'', city:'', weight:''  };
                    })
				}
			},
			//provinceChange
            provinceChange:function(){
			    this.areaList.city='';
			},

            addindustry(){
                if(!this.industry.labels){
                    this.$message.error('请选择行业！');
                }else{
                    if(!this.industry.weight){
                        this.industry.weight = 5
                    }
                    var label= this.industry.labels

                    if(this.industry4){
                        label=this.industry4

					}else if(this.industry3){
                        label=this.industry3

					}else if(this.industry2){
                        label=this.industry2
                    }
                    this.$ajax.post(apiConfig.addLabel+'?'+'label_'+ label +'='+ this.industry.weight ,{ id:this.needDetail.needid,category:4} ).then((response) => {
					    console.log('label',label)
                        if (response.data.code == 1) {
                            this.getNeedDetail(this.needDetail);
                            this.$message({
                                message: '添加行业成功！',
                                type: 'success'
                            });
                            console.log('行业sucess',response.data);
                            this.industry= {  labels:'', weight:'' };
                            this.industry2= {  labels:''};
                            this.industry3= {  labels:'' };
                            this.industry4= {  labels:'' };
                        }
                    })
                }
            },
            addmetier(){
                if(!this.metier.labelid){
                    this.$message.error('请选择专长！');
                }else{
                    if(!this.metier.weight){
                        this.metier.weight = 5
                    }
                    this.$ajax.post(apiConfig.addLabel+'?'+'label_'+ this.metier.labelid +'='+ this.metier.weight ,{ id:this.needDetail.needid,category:3} ).then((response) => {
                        if (response.data.code == 1) {
                            this.getNeedDetail(this.needDetail);
                            this.$message({
                                message: '添加专长成功！',
                                type: 'success'
                            });

                        }else{
                            this.$message({
                                message: response.data.msg,
                                type: 'warning'
                            });
						}
						this.metier={ labelid:'', weight:'' };
                    })
                }
            },
            addthepost(){
                if(!this.thepost.labelid){
                    this.$message.error('请选择职务！');
                }else{
                    if(!this.thepost.weight){
                        this.thepost.weight = 0
                    }
                    this.$ajax.post(apiConfig.addLabel+'?'+'label_'+ this.thepost.labelid +'='+ this.thepost.weight ,{ id:this.needDetail.needid,category:3} ).then((response) => {
                        if (response.data.code == 1) {
                            this.getNeedDetail(this.needDetail);
                            this.$message({
                                message: '添加专长成功！',
                                type: 'success'
                            });
                            console.log('专长sucess',response.data);

                        }else{
                            this.$message({
                                message: response.data.msg,
                                type: 'warning'
                            });
                        }
                        this.thepost={ labelid:'', weight:'' };
                    })
                }
            },

            addmetier(){
                if(!this.metier.labelid){
                    this.$message.error('请选择专长！');
                }else{
                    if(!this.metier.weight){
                        this.metier.weight = 5
                    }
                    this.$ajax.post(apiConfig.addLabel+'?'+'label_'+ this.metier.labelid +'='+ this.metier.weight ,{ id:this.needDetail.needid,category:3} ).then((response) => {
                        if (response.data.code == 1) {
                            this.getNeedDetail(this.needDetail);
                            this.$message({
                                message: '添加专长成功！',
                                type: 'success'
                            });

                        }else{
                            this.$message({
                                message: response.data.msg,
                                type: 'warning'
                            });
                        }
                        this.metier={ labelid:'', weight:'' };
                    })
                }
            },

            addsex(){
                if(!this.sexes.labels){
                    this.$message.error('请选择性别！');
                }else{
                    if(!this.sexes.weight){
                        this.sexes.weight = 5
                    }
                    this.$ajax.post(apiConfig.addLabel+'?'+'label_'+ this.sexes.labels +'='+ this.sexes.weight ,{ id:this.needDetail.needid,category:5} ).then((response) => {
                        if (response.data.code == 1) {
                            this.getNeedDetail(this.needDetail);
                            this.$message({
                                message: '添加性别成功！',
                                type: 'success'
                            });

                        }else{
                            this.$message({
                                message: response.data.msg,
                                type: 'warning'
                            });
                        }
                        this.sexes={  labels:'', weight:'' };

                    })
                }
            },
            formatCatename:function(row,column){
                return row.categoryName=='标签'?'专长':row.categoryName;
            },

			//判断推荐类型
            formatType:function (row,column){
                return row.type==1?'系统匹配':row.type==2?'人工匹配':row.type==3?'系统开放匹配':'未知类型';
			},
            formatRecommendType:function (row,column) {
                return 	row.recommendType==1?'专才':row.recommendType==2?'通才':row.recommendType==3?'超级连接点':'未知匹配方式';

            },

            //推荐匹配
            showRecommendButton: function () {
                const ids = this.needDetail.needid
                this.$ajax.post(apiConfig.recommend,{ ids:ids }).then((response) => {
                    // 响应成功回调
                    if(response.data.code==1){
                        this.$message({
                            showClose: true,
                            message: '匹配处理中……',
                        });
                        //推荐完成后刷新页面 间隔3s
						//clearInterval setInterval 里的函数是全局作用域 window 而vue是组件内的作用域
                        var self=this
						if(self.recommendsList.length===0){
                            var i=10;
                            var recommendRefsh = setInterval(function(){
                                self.$message({
                                    showClose: true,
                                    message: '匹配处理中……',
                                });
                                var id = ids;
                                console.log(i);

                                i--;

                                if(i==0){
                                    clearInterval(recommendRefsh)
                                    self.$message({
                                        showClose: true,
                                        message: '匹配超时，请联系工作人员',
                                        type: 'success',
                                        duration:3000
                                    });

                                }
                                self.$ajax.get(apiConfig.needDetail,{id:id}).then((response) => {
                                    // 响应成功回调
                                    if (response.data.code == 1) {
                                        console.log('推荐列表刷新详情页',response.data.original.recommends)
                                        self.recommendsList = response.data.original.recommends

										//状态不为3
                                        if(response.data.original.status == 3){
                                            if(self.recommendsList.length!==0){
                                                clearInterval(recommendRefsh)
                                                self.$message({
                                                    showClose: true,
                                                    message: '匹配成功！',
                                                    type: 'success',
                                                    duration:3000
                                                });
                                            }
                                        }else{
                                            clearInterval(recommendRefsh)
                                            self.$message({
                                                showClose: true,
                                                message: '匹配完成！',
                                                type: 'success',
                                                duration:3000
                                            });
										}

                                    }
                                })
                                    .catch(function(response) {
                                        console.log(response)
                                    })
                            },3000)
						}
                    }else{
                        this.$message({
                            showClose: true,
                            message: response.data.msg,
                            type: 'warning'
                        });
					}

                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },


            //派发
            distributeButton:function (row) {
                const { id,recomendids }={
                    id:this.needDetail.needid,
                    recomendids:row.userid
                }
                this.$ajax.post(apiConfig.distribute,{ id,recomendids }).then((response) => {
                    if(response.data.code == 1){
                        // 响应成功回调
                        this.$notify({
                            title: '成功',
                            message: '派发成功',
                            type: 'success'
                        });
                        this.getNeedDetail(this.needDetail);
                    }

                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },


            //派发成功颜色背景
            tableRowClassName(row) {
                if (row.status == 2) {
                    return 'info-row';
                }
                return '';
            },
            //勾选框
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
			//批量派发
            allDistribute (code) {
                const idArr = []
                this.multipleSelection.map((item) => {
                    idArr.push(item.userid)
                })
                const { id,recomendids }={ id:this.needDetail.needid, recomendids: idArr.join(',') }
                this.$ajax.post(apiConfig.distribute,{ id,recomendids }).then((response) => {
                    if(response.data.code == 1){
                        // 响应成功回调
                        this.$notify({
                            title: '成功',
                            message: '派发成功',
                            type: 'success'
                        });
                        this.getNeedDetail(this.needDetail);
                    }
                })
            },
			//人工匹配
            matchButton :function () {
                const { id,userids }={
                    id:this.needDetail.needid,
                    userids:this.needMatch
                }

                this.$ajax.post(apiConfig.match,{ id,userids }).then((response) => {
                    // 响应成功回调
                    if(response.data.code==1){
                        this.$notify({
                            title: '成功',
                            message: '人工匹配发功成功',
                            type: 'success'
                        });
                        this.needMatch=""
                        this.getNeedDetail(this.needDetail)
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },

			//推荐人详情
            getRecommendsDetail:function (row) {
                this.recommendDetailVisible=true;
                const  userid = row.userid || this.needDetail.userid
                this.$ajax.get(apiConfig.detail,{ userid:userid }).then((response) => {
                    // 响应成功回调
                    if (response.data.code == 1) {
                        console.log('推荐用户详情页',response.data)
                        this.recommendDetail = response.data.original

                        //棋子列表去掉前三个
                        var chesses = response.data.original.chesses
                        if(chesses){
                            chesses.splice(0,3)
                            this.chessesList = chesses
                        }

                        //标签列表
                        var labels = response.data.original.labels
						for(var i=0;i<labels.length;i++){
                            if(labels[i].typeName=="他人印象"){
                                this.otherImpress = labels[i];

							}else if(labels[i].typeName=="个人标签"){
								this.personalLabels = labels[i]
							}else if(labels[i].typeName=="系统标签"){
                                this.systemLabels = labels[i]
                            }
						}

                    }else{
                        this.$notify({
                            title: '失败',
                            message: response.data.msg,
                            type: 'error'
                        });
                    }
                }) .catch(function(response) {
                        console.log(response)
                    })
            },

            //删除标签
            labelDelete:function (row) {
                var deleteObj = {
                    needid:this.needDetail.needid,
                    labelid:row.labelid,
					category:row.categoryid
				}
				console.log('deleteObj',deleteObj)
				this.$ajax.post(apiConfig.deleteLabel,deleteObj).then((response) => {
                    console.log('deleteLabel',response.data)
                    // 响应成功回调
                    if(response.data.code==1){
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getNeedDetail(this.needDetail)
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })

            },

			//修改需求
            //修改
            reviseDetail:function () {

                this.reviseDetailShow=true
                this.demand= {
                    needid:this.needDetail.needid,
                    userid: this.needDetail.userid,
                    description:this.needDetail.description,
                    secondType:this.needDetail.firstTypeid,
                    permit:this.needDetail.permit,
                    channels:this.needDetail.channels.map((item)=>{
                        return item.channelid
					})
                }
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
                if(!this.demand.needid){
                    this.$message.error('缺少需求id，请联系开发人员');
                    return
                }
                if(this.demand.permit==1&&this.demand.channels.length==0){
                    this.$notify({
                        title: '失败',
                        message: '请至少选择一个标签',
                        type: 'error'
                    });
                    return
                }else if(this.demand.permit==1&&this.demand.channels.length>3){
                    this.$notify({
                        title: '失败',
                        message: '最多选择三个标签',
                        type: 'error'
                    });
                    return
				}

                this.$ajax.post(apiConfig.demandList,this.demand).then((response)=>{
                    if(response.data.code == 1){
                        this.reviseDetailShow=false;
                        this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success'
                        });
                        this.getNeedDetail();
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
                    }
                })
            },
            //置顶服务
            needTop:function (){
                var needid = {needid:this.needDetail.needid}
                console.log(needid)
                //取消置顶
                if(this.needDetail.isTop==1){
                    this.$ajax.post(apiConfig.needTop,needid).then((response)=>{
                        if (response.data.code==1){
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            this.getNeedDetail();
                        }else if(response.data.code==10001){
                            this.$notify({
                                title: '失败',
                                message: response.data.msg,
                                type:'warning'
                            });
                        }
                    }).catch(function(response) {
                        console.log(response)
                    })
                }else if(this.needDetail.isTop==0){
                    //置顶
                    this.$ajax.post(apiConfig.needTop,needid).then((response)=>{
                        if (response.data.code==1){
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            this.getNeedDetail();
                        }else if(response.data.code==10001){
                            this.$notify({
                                title: '失败',
                                message: response.data.msg,
                                type: 'warning'
                            });
                        }

                    }).catch(function(response) {
                        console.log(response)
                    })
                }

            },


        }
    }

</script>
<style>
	.headImg{
		width: 100px;
		position: absolute;
		right: 24px;
		top: 53px;}
	.key-content {
		padding: 10px;
		width: 50%;
		text-align: center;
		border: 1px solid #CBCBCB;
		margin-bottom: 20px;
	}
	.c-select {
		display: table-cell;
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
		margin-bottom: 20px;
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
	.date-detail{
		float: left;
		list-style:none;
		margin:0;
		width: 100%;
	}
	.date-detail li{
		float: left;
		margin-bottom: 10px;
		font-size:16px;
		width: 50%;
	}
	.date-detail-description li{
		width: 100%;
	}
	.el-table .info-row {
		color: grey;
		background: gainsboro;
	}

	.div1{
		width: 100%;
		margin: 30px;
	}
	.div1-1{
		width: 50%;
		float: left;
	}
	.div1-2{
		width: 50%;
		float: left;
	}
	.div1-3{
		float: left;
		width: 90%;

	}
	.div1-3-name{
		float: left;
		background: gainsboro;
		display: inline-block;
		width: 100px;
		line-height: 24px;
		color: #000000;
		padding: 3px 10px ;
	}
	.div1-3-con{
		/*display: inline-block;*/
		/*float: left;*/
	}

	.add-key{
		margin: 10px;
	}
	.add-key-item{
		list-style: none;

	}
	.add-key-item li{
		float: left;
	}
	.div-bac{
		background: #F2F2F2;
		padding: 10px 10px;
		margin: 10px 0;
	}
	.chesses-ul{
		list-style: none;
		display: inline-block;
	}
	.chesses-ul li{
		background: dimgray;
		padding: 3px 10px ;
		float: left;
		color: #f1f2f7;
	}
	.table-column{
		word-wrap:break-word;
		/*color: red;*/
	}
	.pipei-tip{
		font-size: 12px;
		height: 12px;
		margin-top: -10px;
		float: right;
		margin-right: 50px;
		color:cornflowerblue;
	}
</style>
