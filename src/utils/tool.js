

//阿里上传命名
export const objToArr = (str)=>{
    if(str!="" && str && str!='{}'&& str!=null){
        str = str.substring(1,str.length-1).split(',');
        var arr= [{name: '', value: ''}]
        for(var i=0;i<str.length;i++ ){
            str[i] =str[i].split(':')
            var item = {
                name:str[i][0].replace("\"","").replace("\"",""),
                value:str[i][1].replace("\"","").replace("\"","")
            }
            arr.unshift(item);
        }
        return arr
    }
}
export const changeSelect = (arr)=>{
    var add = true;
    var len = arr.length;
    if(len==1 && arr[len-1].name==''){
        add = false;
    }
    if(len!=1 && arr[len-1].name==''){
        add = false;
    }
    var extendItem = {
        name:'',
        value:''
    }
    if(len>1){
        for(var i=0;i<len-1;i++){
            var name = arr[i].name

            var n = 0;
            if(name==''|| !name){
                n++
                if(n==1){
                    console.log(i)
                    this.extendFields.splice(0,1)
                }
            }

            console.log('n',n)
            for(var j=i+1; j<len;j++){
                if(arr[j].name == name){
                    arr[j].name = ''
                    add = false;
                }
            }
        }
    }
    if(add){
        arr.push(extendItem)
        return arr
    }
    if(!add){
        return arr
    }
}

//日期格式化
export const formatDate = (date, fmt)=> {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}

/**
 * 序列化请求参数
 */
const serialize = (data) => {
    let serializeData = ''
    if (typeof data === 'undefined') {
        return data
    }
    if (typeof data === 'object') {
        for (const k of Object.keys(data)) {
            serializeData += k + '=' + data[k] + '&'
        }
        serializeData = serializeData.substring(0, serializeData.length - 1)
    }
    if (typeof data === 'string') {
        serializeData = data
    }
    return serializeData
}

const tounicode = (data) => {
    if(data == '') return '请输入汉字';
    var str ='';
    for(var i=0;i<data.length;i++)
    {
        str+="\\u"+parseInt(data[i].charCodeAt(0),10).toString(16);
    }
    return str;
}

/**
 * 对外通用数据请求方法
 */
export const request = (params, callBack) => {
  const defaults = {
    method: params.method || ''
  }
  const reqOtion = Object.assign({}, defaults, params)
  reqOtion.data._perfectyang = (new Date()).getTime()
  return fetch(reqOtion).then((response) => response.json()).then((json) => {
    if (json.success == 10009) {
      sessionStorage.removeItem('currentUser')
      location.href = '/login'
    } else {
      if (callBack) {
        callBack(json)
      } else {
        return json
      }
    }
  })
}

/**
 * 设置缓存
 */
export const setCache = (options) => {
  var type = options.type || 'sessionStorage' // 缓存方式，sessionStorage或localStorage
  var key = options.key // 缓存的key
  var dataType = options.dataType || 'json' // 缓存的数据类型，string或json
  var value = options.value // 缓存的值
  var time = options.time // 缓存时间,以毫秒为单位

  if (dataType === 'json') {
    value = JSON.stringify(value)
  }else {

  }

  var cacheType // 缓存类型,sessionStorage或localStorage
  if (type === 'sessionStorage') {
    cacheType = sessionStorage
  } else if (type === 'localStorage') {
    cacheType = localStorage
  } else {
    return false
  }

  try {
    cacheType.setItem(key, value)
  } catch (e) {
    cacheType.clear()
    cacheType.setItem(key, value)
  }

  if (time) { // 如果有设置缓存时间则时间到后数据就会销毁，默认是sessionStorage或localStorage的生命周期
    var dateTime = new Date()
    var timeStamp = dateTime.getTime() + time

    try {
      sessionStorage.setItem(key + '-time', timeStamp)
    } catch (e) {
      sessionStorage.clear()
      sessionStorage.setItem(key + '-time', timeStamp)
    }
  }
}

/**
 * 获取缓存
 */
export const getCache = (options) => {
  var key = options.key
  var type = options.type || 'sessionStorage'
  var dataType = options.dataType || 'json' // 缓存的数据类型，string或json
  var cacheType // 缓存类型,sessionStorage或localStorage
  if (type === 'sessionStorage') {
    cacheType = sessionStorage
  } else if (type === 'localStorage') {
    cacheType = localStorage
  } else {
    return false
  }

  var dateTime = new Date()
  var timeStamp = dateTime.getTime()
  var efficientTime = sessionStorage.getItem(key + '-time') || timeStamp + 1000 * 60 * 60 * 24 * 365 // 默认存储时间为1年
  var timeInterval = efficientTime - timeStamp

  if (timeInterval >= 0) {
    var value = cacheType.getItem(key)
    if (!value) {
      return false
    }
    if (dataType === 'json') {
      try {
        value = JSON.parse(cacheType.getItem(key) || null)
        if (typeof (value) === 'object' && Object.prototype.toString.call(value).toLowerCase() === '[object object]' && !value.length) {
          // value.expiredTime = new Date(parseInt(efficientTime))
        }
      } catch (e) {
        console.log(e)
      }
    }
    return value
  } else { // 已过缓存时间，让数据失效
    cacheType.removeItem(key)
    return false
  }
}

/**
 ** 加法函数，用来得到精确的加法结果
 * @author robin
 * @func
 ** @desc 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** @example 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
export const culAdd = (arg1, arg2) => {
  let r1
  let r2
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  const c = Math.abs(r1 - r2)
  const m = Math.pow(10, Math.max(r1, r2))
  if (c > 0) {
    const cm = Math.pow(10, c)
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace('.', ''))
      arg2 = Number(arg2.toString().replace('.', '')) * cm
    } else {
      arg1 = Number(arg1.toString().replace('.', '')) * cm
      arg2 = Number(arg2.toString().replace('.', ''))
    }
  } else {
    arg1 = Number(arg1.toString().replace('.', ''))
    arg2 = Number(arg2.toString().replace('.', ''))
  }
  return (arg1 + arg2) / m
}

/**
 ** 减法函数，用来得到精确的减法结果
 * @author robin
 * @func
 ** @desc 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** @example 调用：culSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
export const culSub = (arg1, arg2) => {
  let r1
  let r2
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  const m = Math.pow(10, Math.max(r1, r2)) // last modify by deeka //动态控制精度长度
  return (arg1 * m - arg2 * m) / m
}

/**
 ** 乘法函数，用来得到精确的乘法结果
 * @author robin
 * @func
 ** @desc 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 ** @example 调用：culMul(arg1,arg2)
 ** 返回值：arg1乘以 arg2的精确结果
 **/
export const culMul = (arg1, arg2) => {
  let m = 0
  const s1 = arg1.toString()
  const s2 = arg2.toString()
  try {
    if (s1.split('.')[1]) {
      m += s1.split('.')[1].length
    }
  } catch (e) {
    console.log(e)
  }
  try {
    if (s2.split('.')[1]) {
      m += s2.split('.')[1].length
    }
  } catch (e) {
    console.log(e)
  }
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}

/**
 ** 除法函数，用来得到精确的除法结果
 * @author robin
 * @func
 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 ** 调用：culDiv(arg1,arg2)
 ** 返回值：arg1除以arg2的精确结果
 **/
export const culDiv = (arg1, arg2) => {
  let t1 = 0
  let t2 = 0
  try {
    t1 = arg1.toString().split('.')[1].length
  } catch (e) {
    console.log(e)
  }
  try {
    t2 = arg2.toString().split('.')[1].length
  } catch (e) {
    console.log(e)
  }
  const r1 = Number(arg1.toString().replace('.', ''))
  const r2 = Number(arg2.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}

export const getCurrentTime = () => {
  const addZero = (s) => {
    return s < 10 ? '0' + s : s
  }
  const now = new Date()
  const year = now.getFullYear()
  const month = addZero(Number(now.getMonth() + 1))
  const day = addZero(Number(now.getDate()))
  const hour = addZero(Number(now.getHours()))
  const minute = addZero(Number(now.getMinutes()))
  const second = addZero(Number(now.getSeconds()))
  const getTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  return new Date(getTime).getTime() // 毫秒数，转换时要*1000
}
// 距离周
export const distanceWeekTime = () => {
  const currentDate = getCurrentTime()
  const after7Date = currentDate - 7 * 24 * 3600 * 1000
  return new Date(after7Date).getTime()
}
// 距离月
export const distanceMonthTime = () => {
  const addZero = (s) => {
    return s < 10 ? '0' + s : s
  }
  const time = new Date()
  const currentDate = formatTimeString(time.valueOf()) // 显示yyyy-MM-dd HH:mm:ss
  const currentMonth = time.getMonth()
  const addZeroCurrentMonthNew = addZero(time.getMonth())
  const addZeroCurrentMonthOld = addZero(time.getMonth() + 1)
  const currentYear = time.getFullYear()
  let beforeMonthDate
  if (currentMonth === 0) { // 当前月是一月份时，跨年计算
    beforeMonthDate = currentDate.replace(currentYear, currentYear - 1)
  } else {
    beforeMonthDate = currentDate.replace(('-' + addZeroCurrentMonthOld), '-' + addZeroCurrentMonthNew)
  }
  return beforeMonthDate
}
// 距离年
export const distanceYearTime = () => {
  const currentDateTime = getCurrentTime()
  const year = new Date().getFullYear()
  const currentDateString = formatTimeString(currentDateTime)
  return currentDateString.replace(year, year - 1)
}
/**
 * 时间格式化
 * @func
 * @param  {Number} time   时间戳
 * @param  {string} format 时间格式
 */
export const formatTimeString = (time, format = 'yyyy-MM-dd HH:mm:ss') => {
  if (isNaN(time)) { // 非时间戳格式，本来就已经是字符串格式了
    return time
  }
  const t = new Date(Number(time))
  const tf = (i) => (i < 10 ? '0' : '') + i
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (a) => {
    let val
    switch (a) {
      case 'yyyy':
        val = tf(t.getFullYear())
        break
      case 'MM':
        val = tf(t.getMonth() + 1)
        break
      case 'mm':
        val = tf(t.getMinutes())
        break
      case 'dd':
        val = tf(t.getDate())
        break
      case 'HH':
        val = tf(t.getHours())
        break
      case 'ss':
        val = tf(t.getSeconds())
        break
      default:
        break
    }
    return val
  })
}
// 数组去重
export const unique = (arr) => {
  const result = []
  const json = {};
  for (var i = 0, len = arr.length; i < len; i++) {
    if (!json[arr[i]]) {
      json[arr[i]] = 1
      result.push(arr[i]) // 返回没被删除的元素
    }
  }
  return result
}
// 判断数组元素是否重复
export const isRepeat = (arr) => {  // arr是否有重复元素
  const hash = {}
  for (var i in arr) {
      if (hash[arr[i]]) return true
      hash[arr[i]] = true
  }
  return false
}
// 生成随机数
export const randombetween = (min, max) => {
  return min + (Math.random() * (max - min + 1))
}
// 操作cookie
const setCookie = (cname, cvalue, exdays) => {
  const d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  const expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + '; ' + expires
}
const getCookie = function(cname) {
  var name = cname + '=';
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
      var c = ca[i]
      while (c.charAt(0) == ' ') c = c.substring(1);
      if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
  }
  return ''
}
export const Cookie = {
  setCookie,
  getCookie
}
// 深度拷贝对象
export const cloneObj = (obj) => {
  var o = obj.constructor == Object ? new obj.constructor() : new obj.constructor(obj.valueOf())
  for (var key in obj) {
    if (o[key] != obj[key]) {
      if (typeof (obj[key]) == 'object') {
        o[key] = cloneObj(obj[key])
      } else {
        o[key] = obj[key];
      }
    }
  }
  return o
}


//是否包含此权限
export const containMenu = (item,arr)=> {
    if(!arr){
        arr=getCache({key:'authlist'})
    }
    for(var i in arr){
        if(arr[i].code==item){
            return false
        }
    }
    return true
}
export const containButton = (item,arr)=> {
    if(!arr){
        arr=getCache({key:'authlist'})
    }
    for(var i in arr){
        if(arr[i].code==item){
            return true
        }
    }
    return false
}
