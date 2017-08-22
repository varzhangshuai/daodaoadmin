import axios from 'axios'
import qs from 'qs'
import NProgress from 'nprogress'
// import ElementUI from 'element-ui'
import { Message } from 'element-ui'


// 添加请求拦截器，在请求时，显示 ElementUI 的加载组件
axios.interceptors.request.use(config => {
    NProgress.start()
    return config
}, error => {
    return Promise.reject(error)
})

// 添加响应拦截器 ，请求结束后，关闭 加载组件
axios.interceptors.response.use(response =>{
    NProgress.done()
    return response
} , error => Promise.resolve(error.response))

// 封装请求数据的对象方法
class Ajax {
    static get(url,params){
        // 通过Promise完成异步操作，将数据进行初步处理输出为Json对象
        var P = new Promise(function(resolve, reject){
            axios({
                method: 'get',
                url,
                params,
                timeout: 30000
            }).then((res)=>{
                    //判断后台返回状态码，作出相应行为
                    switch(res.data.code){
                        case '11001':
                            Message({
                                title : '错误提示',
                                message : '请重新登陆',
                                type : 'error'
                            });
                            break;
                        case '10016':
                            Message({
                                title : '错误提示',
                                message : res.data.message,
                                type : 'error'
                            });
                            break;
                        default:
                            resolve(res);
                            break;
                    }
                }).catch((error)=>{
                console.log(error);
                reject(error);
            });
        });
        return P
    }
    static post(url,data){
        var P = new Promise(function(resolve, reject){
            axios({
                method: 'post',
                url,
                data: qs.stringify(data),
                //qs兼容不好
                // data,
                // transformRequest: [function (data) {
                //     let ret = ''
                //     for (let it in data) {
                //         if (typeof data[it] === 'object') {
                //             data[it] = JSON.stringify(data[it])
                //         }
                //         ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                //     }
                //     return ret
                // }],
                timeout: 30000,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            })
                .then((res)=>{
                    switch(res.data.code){
                        case '11001':
                            Message({
                                title : '错误提示',
                                message : '请重新登陆',
                                type : 'error'
                            });
                            break;
                        case '10016':
                            Message({
                                title : '错误提示',
                                message : res.data.message,
                                type : 'error'
                            });
                            break;
                        default:
                            resolve(res);
                            break;
                    }
                }).catch((error)=>{
                console.log(error)
                reject(error);
            });
        });
        return P
    }
    static delete(url){
        var P = new Promise(function(resolve, reject){
            axios({
                method: 'delete',
                url,
                timeout: 30000
            })
                .then((res)=>{
                    switch(res.data.code){
                        case '11001':
                            Message({
                                title : '错误提示',
                                message : '请重新登陆',
                                type : 'error'
                            });
                            break;
                        case '10016':
                            Message({
                                title : '错误提示',
                                message : res.data.message,
                                type : 'error'
                            });
                            break;
                        default:
                            resolve(res);
                            break;
                    }
                }).catch((error)=>{
                console.log(error)
                reject(error);
            });
        });
        return P
    }
    static put(url){
        var P = new Promise(function(resolve, reject){
            axios({
                method: 'put',
                url,
                timeout: 30000
            })
                .then((res)=>{
                    switch(res.data.code){
                        case '11001':
                            Message({
                                title : '错误提示',
                                message : '请重新登陆',
                                type : 'error'
                            });
                            break;
                        case '10016':
                            Message({
                                title : '错误提示',
                                message : res.data.message,
                                type : 'error'
                            });
                            break;
                        default:
                            resolve(res);
                            break;
                    }
                }).catch((error)=>{
                console.log(error)
                reject(error);
            });
        });
        return P
    }
}


export default Ajax;