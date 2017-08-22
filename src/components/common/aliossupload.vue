<template>
    <div>
        <div class="oss_file">
            <input  type="file" :id="id" :multiple="multiple" @change="doUpload"/>
        </div>

    </div>
</template>
<script>
    import tool from 'utils/tool'

    export default{
        props:{
            multiple:{
                type: Boolean,
                twoWay:false
            },
            id:{
                type: String,
                twoWay:false
            },
            url:{
                type: Array,
                twoWay:true
            }
        },
        data(){
            return{
                region:'oss-cn-shanghai',
                bucket:'daodao-upload',
            };
        },
        methods:{
            doUpload(){
                const _this = this;
                    const client = new OSS.Wrapper({
                        region:_this.region,
                        accessKeyId:'LTAIQXyCzQ8P9jEC',
                        accessKeySecret: 'XUt1mgNViGNq2hPGISX8klqreWgxEb',
//                        stsToken: result.data.token.SecurityToken,
                        bucket:_this.bucket
                    })
                    const files = document.getElementById(_this.id);
                    if(files.files){
                        const fileLen = document.getElementById(_this.id).files

                        for (let i = 0; i < fileLen.length; i++) {
                            const file = fileLen[i];
                            var val = file.name
                            var suffix = val.substr(val.indexOf("."));
                            var obj = _this.timestamp();
                            const storeAs = "user/apply/"+obj+suffix;

                            client.multipartUpload(storeAs, file, {

                            }).then((results) => {
                                var imgUrl = 'http://img.daodaoclub.com/' + results.name ;
                                _this.url.push(imgUrl);
                            }).catch((err) => {
                                console.log(err);
                            });
                        }
                        this.$emit('aliimgurl',_this.url)
                    }
            },
             timestamp:function(){
                var time = new Date();
                var y = time.getFullYear();
                var m = time.getMonth()+1;
                var d = time.getDate();
                var h = time.getHours();
                var mm = time.getMinutes();
                var s = time.getSeconds();
                return ""+y+this.add0(m)+"/"+this.add0(d)+this.add0(h)+this.add0(mm)+this.add0(s);
            },

           add0(m){
                return m<10?'0'+m : m;
            }

        }
    };
</script>
<style type="text/css">
    .oss_file {
        height: 40px;
        width: 100px;
        background: url("../../assets/imgChose.png");
        text-align: center;
        color: white;
    }
    .oss_file  input {
        right: 0;
        top: 0;
        opacity: 0;
        filter: alpha(opacity=0);
        cursor: pointer;
        width: 100%;
        height: 100%;
    }

</style>