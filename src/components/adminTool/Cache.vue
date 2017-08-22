    <template>
        <el-tabs style="width:100%;" type="card">
            <el-tab-pane label="数据缓存">
                <section>
                    <!--  缓存搜索keys   -->
                        <div>
                            <el-col :span="9" class='fl'>
                                <el-input type="text" placeholder="请输入keys" v-model="keysData" style="max-width:800px" size="small">
                                    <template slot="prepend">keys</template>
                                </el-input>
                            </el-col>
                            <el-row type="flex" justify="start" >
                                <el-col :span="2">
                                    <el-button type="primary" @click="searchKeys" style="width: 100%;margin-left:100% ">查询</el-button>
                                </el-col>
                            </el-row>
                        </div>
                    <div style="clear:both"></div>
                    <!--  搜索  -->
                    <div style="margin-top:20px">
                        <el-col :span="4" class='fl'>
                            <span class='el-input-group__prepend'>数据类型</span>
                            <el-select v-model="searchList.type" class='c-select funtype-select' style="max-width:500px" size="small" >
                                <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4" class='fl'>
                            <el-input type="text" placeholder="请输入用户id" v-model="searchList.userId" style="max-width:300px" size="small">
                                <template slot="prepend">用户ID</template>
                            </el-input>
                        </el-col>
                        <el-row type="flex" justify="start">
                            <el-col :span="2">
                                <el-button type="primary" @click="search" style="width:100%;margin-left:100% ">查询</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <div style="clear:both"></div>
                    <!--信息列表-->
                    <div id="vhtml" v-html="dataList" style="margin-left:30px">
                        <div>{{dataList}}</div>
                    </div>
                </section>
            </el-tab-pane>

            <el-tab-pane label="推荐任务">
                <section>
                    <el-row>
                        <el-col :span="7" class='fl' >
                            <span class='el-input-group__prepend'>状态</span>
                            <el-select v-model="searchInfro.status" class='c-select funtype-select' size="small" >
                                <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="7"  >
                            <el-input placeholder="" v-model="searchInfro.userid" style="max-width: 256px;" size="small" class='fl'>
                                <template slot="prepend">userid</template>
                            </el-input>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between">
                        <el-col :span="5">
                            <el-button type="primary" @click="searchRecommend" style="width: 60%;margin-top: 10px; margin-left:100%" >查询</el-button>
                        </el-col>
                    </el-row>
                    <!--推荐任务-->
                    <div style="margin-left:30px">
                        <div>{{remmondList}}</div>
                    </div>
                </section>
            </el-tab-pane>
            <el-tab-pane label="删除微信绑定用户">
                <section>
                    <el-col :span="7"  >
                        <el-input placeholder="" v-model="unbindUser" style="max-width: 400px;" size="small" class='fl'>
                            <template slot="prepend">userid</template>
                        </el-input>
                    </el-col>
                    <el-row type="flex" justify="space-between">
                        <el-col :span="5">
                            <el-button type="primary" @click="searchbindUser" style="width: 60%;margin-left:100%" >查询</el-button>
                        </el-col>
                    </el-row>
                </section>
            </el-tab-pane>
        </el-tabs>
    </template>

<script>
    import NProgress from 'nprogress'
    import Pagination from 'components/common/Pagination.vue'
    import { getCache,formatTimeString } from 'utils/tool'
    import util from '../../common/util'
    import apiConfig from 'utils/apiConfig'


    export default{
        name: 'Cache',
        data(){
            return {
                //推荐任务参数
                searchInfro:{
                    status:'',
                    userid:'',
                },
                remmondList:'',
                //推荐任务状态
                statusList:[{
                        value: '',
                        label: '选择项'
                    },{
                        value: 'userinfo',
                        label: 'ad7完善资料'
                    },{
                        value: 'label',
                        label: 'ad3生成任务'
                    }],
                //缓存数据
                dataList:'',
                /*userid:{},*/
                searchList: {
                    type: '',
                    userId: ''
                },
                //缓存数据类型
                typeList:[{
                    value: '',
                    label: '请选择'
                },{
                    value: 'new_invite',
                    label: '新的邀请（new_invite）'
                },{
                    value: 'wait_agree',
                    label: '见面邀约（wait_agree）'
                },{
                    value: 'mine_comment',
                    label: '待评价（mine_comment）'
                },{
                    value: 'push',
                    label: '道同提醒（push）'
                },{
                    value: 'visit_time',
                    label: '访问时间（visit_time）'
                },{
                    value: 'perfect_info',
                    label: 'ad7完善资料（perfect_info）'
                },{
                    value: 'rec_label',
                    label: 'ad3 打标签（rec_label）'
                },{
                    value: 'feed_hello2me',
                    label: '同学打招呼（feed_hello2me）'
                },{
                    value: 'user_schedule',
                    label: '日程（user_schedule）'
                },{
                    value: 'request_header',
                    label: '请求头部'
                },{
                    value: 'lottery_gifts',
                    label: '抽奖'
                }],
                unbindUser:'',    //删除用户微信绑定数据
                keysData:'',      //keys

            }

        },
        computed(){

        },
        mounted(){
          /* this.getDetail()*/
        },
        methods: {
            //搜索信息
           search:function(){
                //str.charAt(str.length – 1)
                var useridvalue = this.searchList.userId;
                var useridlast = useridvalue.charAt(useridvalue.length-1);
                var labelUrl = 'remind:'+ this.searchList.type+':'+'user_'+ useridlast +':'+useridvalue;
                var obj = {
                    keys:labelUrl
                }
               /*    json  格式化    */
               var JSONFormat = (function(){
                   var _toString = Object.prototype.toString;
                   function format(object, indent_count){
                       var html_fragment = '';
                       switch(_typeof(object)){
                           case 'Null' :0
                               html_fragment = _format_null(object);
                               break;
                           case 'Boolean' :
                               html_fragment = _format_boolean(object);
                               break;
                           case 'Number' :
                               html_fragment = _format_number(object);
                               break;
                           case 'String' :
                               html_fragment = _format_string(object);
                               break;
                           case 'Array' :
                               html_fragment = _format_array(object, indent_count);
                               break;
                           case 'Object' :
                               html_fragment = _format_object(object, indent_count);
                               break;
                       }
                       return html_fragment;
                   };

                   function _format_null(object){
                       return '<span class="json_null">null</span>';
                   }

                   function _format_boolean(object){
                       return '<span class="json_boolean">' + object + '</span>';
                   }

                   function _format_number(object){
                       return '<span class="json_number">' + object + '</span>';
                   }

                   function _format_string(object){
                       object = object.replace(/\</g,"<");
                       object = object.replace(/\>/g,">");
                       if(0 <= object.search(/^http/)){
                           object = '<a href="' + object + '" target="_blank" class="json_link">' + object + '</a>'
                       }
                       return '<span class="json_string">"' + object + '"</span>';
                   }

                   function _format_array(object, indent_count){
                       var tmp_array = [];
                       for(var i = 0, size = object.length; i < size; ++i){
                           tmp_array.push(indent_tab(indent_count) + format(object[i], indent_count + 1));
                       }
                       return '<span data-type="array" data-size="' + tmp_array.length + '" ><i style="cursor:pointer;" class="fa fa-minus-square-o"></i>[<br/>'
                           + tmp_array.join(',<br/>')
                           + '<br/>' + indent_tab(indent_count - 1) + ']</span>';

                   }

                   function _format_object(object, indent_count) {
                       var tmp_array = [];
                       for (var key in object) {
                           tmp_array.push(indent_tab(indent_count) + '<span class="json_key">"' + key + '"</span>:' + format(object[key], indent_count + 1));
                       }
                       return '<span  data-type="object" ><i style="cursor:pointer;" class="fa fa-minus-square-o"></i>{<br/>'
                           + tmp_array.join(',<br/>')
                           + '<br/>' + indent_tab(indent_count - 1) + '}</span>';


                   }
                   function indent_tab(indent_count){
                       return (new Array(indent_count + 1)).join('  ');
                   }

                   function _typeof(object){
                       var tf = typeof object,
                           ts = _toString.call(object);
                       return null === object ? 'Null' :
                           'undefined' == tf ? 'Undefined'   :
                               'boolean' == tf ? 'Boolean'   :
                                   'number' == tf ? 'Number'   :
                                       'string' == tf ? 'String'   :
                                           '[object Function]' == ts ? 'Function' :
                                               '[object Array]' == ts ? 'Array' :
                                                   '[object Date]' == ts ? 'Date' : 'Object';
                   };

                   function loadCssString(){
                       var style = document.createElement('style');
                       style.type = 'text/css';
                       var code = Array.prototype.slice.apply(arguments).join('');
                       try{
                           style.appendChild(document.createTextNode(code));
                       }catch(ex){
                           style.styleSheet.cssText = code;
                       }
                       document.getElementsByTagName('head')[0].appendChild(style);
                   }

                   loadCssString(
                       '.json_key{ color: #324057; margin-left:6px; font-size:17px;}',
                       '.json_null{color: #666; font-size:17px;}',
                       '.json_string{ color: #666; font-size:17px;}',
                       '.json_number{ color:#666; font-size:17px;}',
                       '.json_link{ color:#666;}',
                       '.json_array_brackets{}');


                   var _JSONFormat = function(origin_data){
                       this.data = JSON.parse(origin_data);
                   };
                   _JSONFormat.prototype = {
                       constructor : JSONFormat,
                       toString : function(){
                           return format(this.data, 1);
                       }
                   }
                   return _JSONFormat;
               })();

                this.$ajax.get(apiConfig.commonCache,obj).then((response)=>{
                    if(response.data.code==1){
                        this.dataList  = new JSONFormat(JSON.stringify(response.data.original[obj.keys]),4).toString();
                       console.log(this.dataList);
                    }else{
                        this.$message(response.data.msg);
                    }
                }).catch(function(response) {
                    console.log(response)
                    })
            },
            //缓存keys值
            searchKeys:function(){
                /*    json  格式化    */
                var JSONFormat = (function(){
                    var _toString = Object.prototype.toString;
                    function format(object, indent_count){
                        var html_fragment = '';
                        switch(_typeof(object)){
                            case 'Null' :0
                                html_fragment = _format_null(object);
                                break;
                            case 'Boolean' :
                                html_fragment = _format_boolean(object);
                                break;
                            case 'Number' :
                                html_fragment = _format_number(object);
                                break;
                            case 'String' :
                                html_fragment = _format_string(object);
                                break;
                            case 'Array' :
                                html_fragment = _format_array(object, indent_count);
                                break;
                            case 'Object' :
                                html_fragment = _format_object(object, indent_count);
                                break;
                        }
                        return html_fragment;
                    };

                    function _format_null(object){
                        return '<span class="json_null">null</span>';
                    }

                    function _format_boolean(object){
                        return '<span class="json_boolean">' + object + '</span>';
                    }

                    function _format_number(object){
                        return '<span class="json_number">' + object + '</span>';
                    }

                    function _format_string(object){
                        object = object.replace(/\</g,"<");
                        object = object.replace(/\>/g,">");
                        if(0 <= object.search(/^http/)){
                            object = '<a href="' + object + '" target="_blank" class="json_link">' + object + '</a>'
                        }
                        return '<span class="json_string">"' + object + '"</span>';
                    }

                    function _format_array(object, indent_count){
                        var tmp_array = [];
                        for(var i = 0, size = object.length; i < size; ++i){
                            tmp_array.push(indent_tab(indent_count) + format(object[i], indent_count + 1));
                        }
                        return '<span data-type="array" data-size="' + tmp_array.length + '" ><i style="cursor:pointer;" class="fa fa-minus-square-o"></i>[<br/>'
                            + tmp_array.join(',<br/>')
                            + '<br/>' + indent_tab(indent_count - 1) + ']</span>';

                    }

                    function _format_object(object, indent_count) {
                        var tmp_array = [];
                        for (var key in object) {
                            tmp_array.push(indent_tab(indent_count) + '<span class="json_key">"' + key + '"</span>:' + format(object[key], indent_count + 1));
                        }
                        return '<span  data-type="object" ><i style="cursor:pointer;" class="fa fa-minus-square-o"></i>{<br/>'
                            + tmp_array.join(',<br/>')
                            + '<br/>' + indent_tab(indent_count - 1) + '}</span>';


                    }
                    function indent_tab(indent_count){
                        return (new Array(indent_count + 1)).join('  ');
                    }

                    function _typeof(object){
                        var tf = typeof object,
                            ts = _toString.call(object);
                        return null === object ? 'Null' :
                            'undefined' == tf ? 'Undefined'   :
                                'boolean' == tf ? 'Boolean'   :
                                    'number' == tf ? 'Number'   :
                                        'string' == tf ? 'String'   :
                                            '[object Function]' == ts ? 'Function' :
                                                '[object Array]' == ts ? 'Array' :
                                                    '[object Date]' == ts ? 'Date' : 'Object';
                    };

                    function loadCssString(){
                        var style = document.createElement('style');
                        style.type = 'text/css';
                        var code = Array.prototype.slice.apply(arguments).join('');
                        try{
                            style.appendChild(document.createTextNode(code));
                        }catch(ex){
                            style.styleSheet.cssText = code;
                        }
                        document.getElementsByTagName('head')[0].appendChild(style);
                    }

                    loadCssString(
                        '.json_key{ color: #324057; margin-left:6px; font-size:17px;}',
                        '.json_null{color: #666; font-size:17px;}',
                        '.json_string{ color: #666; font-size:17px;}',
                        '.json_number{ color:#666; font-size:17px;}',
                        '.json_link{ color:#666;}',
                        '.json_array_brackets{}');


                    var _JSONFormat = function(origin_data){
                        this.data = JSON.parse(origin_data);
                    };
                    _JSONFormat.prototype = {
                        constructor : JSONFormat,
                        toString : function(){
                            return format(this.data, 1);
                        }
                    }
                    return _JSONFormat;
                })();
                console.log(this.keysData);

                var collapseData =  document.getElementsByClassName('fa-minus-square-o');
                console.log(collapseData)
                for(var i=0;i<collapseData.length;i++){
                    collapseData[i].onclick = function(){
                        alert(11);
                    }
                }
                this.$ajax.get(apiConfig.commonCache,{keys:this.keysData}).then((response)=>{
                    if(response.data.code==1){
                        this.dataList = new JSONFormat(JSON.stringify(response.data.original),4).toString();
                    }else{
                        this.$message(response.data.msg);
                    }
                }).catch(function(response) {
                    console.log(response)
                })
            },
            //推荐任务
            searchRecommend:function(){
                let _this = this;
                var postForm = {type: this.searchInfro.status,userid:this.searchInfro.userid}
                this.$ajax.get(apiConfig.jobRecommend, postForm).then((response)=>{
                    if(response.data.code==1){
                        this.remmondList = response.data.original;
                        console.log(this.remmondList)
                        _this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success'
                        });
                    }else{
                        _this.$message({
                            type: 'error',
                            message: response.data.msg
                        })
                    }
                })
            },
            //删除用户微信绑定数据
            searchbindUser:function(){
                let _this = this;
                this.$ajax.post(apiConfig.userUnbind +'?'+ 'userid'+'='+ this.unbindUser).then((response)=>{
                    if(response.data.code==1){
                        console.log(response.data.original)
                        _this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success'
                        });
                    }else{
                        _this.$message({
                            type: 'error',
                            message: response.data.msg
                        })
                    }
                })
            },


        }


    }
</script>

<style>
    .fl{
        float: left;
        margin-right: 40px;
        margin-bottom: 10px;
    }
    .el-input-group__prepend {
        width: 80px;
        font-size: 14px;
        text-align: center;
        padding: 0;
    }
    .c-select {
        display: table-cell;
    }

    .funtype-select {
        max-width: 175px;
    }

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