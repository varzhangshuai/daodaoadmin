<template>
<div>
    <section>
        <!--工具条-->
        <div>
            <el-row>
                <el-col :span="7" >
                    <el-input placeholder="" v-model="searchList.userid" style="max-width:256px" size="small" class='fl'>
                        <template slot="prepend">用户ID</template>
                    </el-input>
                </el-col>
                <el-col :span="7">
                    <el-input  placeholder="" v-model="searchList.mobilePhone" style="max-width:256px" size="small" class='fl'>
                        <template slot="prepend">手机号</template>
                    </el-input>
                </el-col>
                <el-col :span="7" class='fl' >
                    <span class='el-input-group__prepend'>性别</span>
                    <el-select v-model="searchList.gender" class='c-select funtype-select' size="small" >
                        <el-option label="全部" value=""></el-option>
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="2"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="7"  >
                    <el-input placeholder="" v-model="searchList.realName" style="max-width: 256px;" size="small" class='fl'>
                        <template slot="prepend">姓名</template>
                    </el-input>
                </el-col>
                <el-col :span="7"  >
                    <el-input placeholder="" v-model="searchList.companyName" style="max-width: 256px;" size="small" class='fl'>
                        <template slot="prepend">公司</template>
                    </el-input>
                </el-col>


                <el-col :span="15" class='fl'>
                    <span class='el-input-group__prepend'>学院届别</span>
                    <el-select v-model="searchList.collegeid" name='college' class='c-select' placeholder="请选择商学院" size="small" >
                        <el-option v-for="item in commercialLists" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    <el-select v-model="searchList.majorItemid" name='major' class='c-select' placeholder="请选择攻读方向" size="small" >
                        <el-option v-for="item in onMajors" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    <el-select v-model="searchList.gradeid" name='grade' class='c-select' placeholder="请选择年级" size="small" >
                        <el-option v-for="item in onGrades" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    <el-select v-model="searchList.classesid" name='class' class='c-select' placeholder="请选择班级" size="small" >
                        <el-option v-for="item in onClasses" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-col>

                 <el-col :span="15" class='fl'>
                    <span class='el-input-group__prepend'>行业</span>
                    <el-select style="width:23% ;"  v-model="industry.labels"
                               name='labels'  placeholder="请选择行业" class='c-select'  size="small"  @change="industryOneChange()" >
                        <el-option v-for="item in industryList" :key="item.industryid" :label="item.industryName" :value="item.industryid"></el-option>
                    </el-select>
                    <el-select style="width:23% ;"  v-model="industry2"
                               name='labels'  placeholder="请选择2级行业" size="small" @change="industryTwoChange()" :disabled="selectdisTwo" class='c-select' >
                        <el-option v-for="item in industryListTwo" :key="item.industryid" :label="item.industryName" :value="item.industryid"></el-option>
                    </el-select>
                    <el-select style="width:23% ;"  v-model="industry3"
                               name='labels'  placeholder="请选择3级行业" size="small"  @change="industryThreeChange()" :disabled="selectdisThree" class='c-select' >
                        <el-option v-for="item in industryListThree" :key="item.industryid" :label="item.industryName" :value="item.industryid"></el-option>
                    </el-select>
                    <el-select style="width:23% ;"  v-model="industry4"
                               name='labels'  placeholder="请选择4级行业" size="small" :disabled="selectdisFour" class='c-select' >
                        <el-option v-for="item in industryListFour" :key="item.industryid" :label="item.industryName" :value="item.industryid"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row type="flex" justify="center">
                <el-col :span="7">
                    <el-button type="primary" @click="getsearch"
                               style="width: 60%;margin-top: 10px;">查询</el-button>
                </el-col>
            </el-row>
        </div>
        <template>
            <el-table  :data="userpageList" border highlight-current-row  style="width: 100%;">
                <el-table-column prop="userid" label="id" align="center"
                                 width="80" ></el-table-column>
                <el-table-column prop="mobilePhone" label="手机号" align="center" width="120" ></el-table-column>
                <el-table-column inline-template label="头像" align="center" width="100">
                    <div><img :src="row.headUrl" height="40" width="40"></div>
                </el-table-column>
                <el-table-column  prop="realName" label="姓名" align="center"  ></el-table-column>
                <!--<el-table-column  prop="nickName" label="花名" align="center"  ></el-table-column>-->
                <el-table-column  prop="gender" label="性别" :formatter="formatSex" align="center" width="70"  ></el-table-column>
                <el-table-column align="center" prop="regTime" label="激活时间" width="180" ></el-table-column>
                <el-table-column  prop="className" label="班级" align="left" width="150"></el-table-column>
                <el-table-column inline-template  label="行业" align="left"
                                 min-width="200" >
                    <ul v-for="item in row.industry"
                        style="padding: 0;list-style: none;">
                        <li >{{ item.name }} {{item.year}}年</li>
                    </ul>
                </el-table-column>
                <el-table-column inline-template  label="公司" align="left"
                                 min-width="200">
                    <ul v-for="item in row.company"
                        style="padding: 0;list-style: none;">
                        <li >{{ item.companyName }},{{ item.job }} </li>
                    </ul>
                </el-table-column>
            </el-table>
        </template>

        <!--分页-->
        <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
            <pagination
                    :currentpage="pagation.pageIndex"
                    :total="pagation.totalCount"
                    :pagesize="pagation.pageSize"
                    :render="getsearch"
                    :options="filters"
                    style="float:right"
            />
        </el-col>
    </section>
</div>
</template>
<script>
    import NProgress from 'nprogress'
    import Pagination from 'components/common/Pagination.vue'
    import { getCache,formatTimeString } from 'utils/tool'
    import util from '../../common/util'
    import apiConfig from 'utils/apiConfig'

    export default{
        components: {
            Pagination
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
                userpageList:[],
                //查询区
                searchList:{
                    userid:'',
                    gender:'',
                    realName:'',
                    mobilePhone:'',
                    collegeid:'',
                    majorItemid:'',
                    gradeid:'',
                    classesid:'',
                    companyName:'',
                    industryid:''
                },

                //学院列表
                commercialLists: [],
                industryList:[],
                //行业
                industry:{
                    labels:'',
                },
                industry2:'',
                industry3:'',
                industry4:'',
                selectdisTwo:true,
                selectdisThree:true,
                selectdisFour:true,
            }
        },
        computed:{
            onMajors(){
                if(!this.commercialLists )
                    return
                for (const item of this.commercialLists) {
                    if (this.searchList.collegeid == item.id) {
                        return item.majors
                    }
                }
            },
            onGrades(){
                if( !this.onMajors)
                    return
                for (const item of this.onMajors) {
                    if (this.searchList.majorItemid == item.id) {
                        return item.grades
                    }
                }
            },
            onClasses(){
                if(!this.onMajors || !this.onGrades)
                    return
                for (const item of this.onGrades) {
                    if (this.searchList.gradeid == item.id) {
                        return item.classes
                    }
                }
            },

            //行业计算
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
            }
        },

        mounted () {
            this.getList()
            this.industrylist()
            const realName = getCache({ key: 'realName' })
        },

        methods:{
            //导航切换
            handleRemove(tab) {
                console.log('remove');
            },
            handleClick(tab) {

            },
            convertData (original) {
                this.pagation.totalCount = original.totalCount
                this.pagation.pageIndex = original.pageIndex
                this.pagation.pageSize = original.pageSize
                this.filters.pageSize = original.pageSize
                this.userpageList = original.pageList
            },
            //性别显示转换
            formatSex:function(row,column){
                return row.gender==1?'男':row.gender==2?'女':'未知';
            },
            //search查询
            getsearch: function () {
                // 用户筛选的条件
                var label= this.industry.labels
                if(this.industry4){
                    label=this.industry4

                }else if(this.industry3){
                    label=this.industry3

                }else if(this.industry2){
                    label=this.industry2
                }

                this.searchList.industryid = label;
                this.$ajax.get(apiConfig.search,Object.assign(this.filters, this.searchList)).then((response) => {
                    // 响应成功回调
                    console.log(response.data)
                    //要换成未生成邀请码的status
                    if (response.data.code == 1) {
                        this .convertData (response.data.original)
                    }  else {
                        if(response.data.msg==''){
                            sessionStorage.removeItem('realName')
                            this.$router.push('/login');
                        }
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },
            //商学院列表
            getList:function () {
                this.$ajax.get(apiConfig.commercial).then((response) => {
                    // 响应成功回调
                    if (response.data.code == 1) {
                        this.commercialLists =response.data.original;
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },
            //行业
            industrylist: function () {
                this.$ajax.get(apiConfig.industry).then((response) => {
                    // 响应成功回调
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
            }


        }

    }
</script>