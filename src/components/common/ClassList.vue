<template>
    <div>
        <el-col :span="9" class='fl'>
            <span class='el-input-group__prepend'>学院届别</span>
            <el-select v-model="params.collegeid" name='college' class='c-select' placeholder="请选择商学院" size="small" >
                <el-option v-for="item in commercialLists" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="params.majorItemid" name='major' class='c-select' placeholder="请选择攻读方向" size="small" >
                <el-option v-for="item in onMajors" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="params.gradeid" name='grade' class='c-select' placeholder="请选择年级" size="small" >
                <el-option v-for="item in onGrades" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="params.classesid" name='class' class='c-select' placeholder="请选择班级" size="small" >
                <el-option v-for="item in onClasses" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-col>
    </div>
</template>
<script>
    export default {
        props:{
            param: {
                type: Object,
                required: false,
                default: function(a) {
                    return {}
                },
            }
        },
        data(){
            const params = Object.assign({
                collegeid: '',
                majorItemid: '',
                gradeid: '',
                classesid: ''
            }, this.param)
            return {
                params: params,
                //学院列表
                commercialLists: [],
            }
        },
        computed:{
            onMajors(){
                if(!this.commercialLists )
                    return

                for (const item of this.commercialLists) {
                    if (this.params.collegeid == item.id) {
                        return item.majors
                    }
                }
            },
            onGrades(){
                if( !this.onMajors)
                    return
                for (const item of this.onMajors) {
                    if (this.params.majorItemid == item.id) {
                        return item.grades
                    }
                }
            },
            onClasses(){
                if(!this.onMajors || !this.onGrades)
                    return
                for (const item of this.onGrades) {
                    console.log(item)
                    if (this.params.gradeid == item.id) {
                        return item.classes
                    }
                }
            }
        },
        methods:{
            //商学院列表
            classList:function () {
                let _this = this
                this.$ajax.get('/costin/admin/commercial/list').then((response) => {
                    // 响应成功回调
                    console.log(response.data)
                    if (response.data.code == 1) {
                        this.commercialData (response.data.original);
                        console.log(this.commercialLists)
                    }
                })
                    .catch(function(response) {
                        console.log(response)
                    })
            },
            commercialData :function (data) {
                this.commercialLists = data
            }
        }
    }
</script>
<style>
    .fl{
        float: left;
        margin-right: 40px;
        margin-bottom: 10px;
    }
</style>