import axios from 'axios'
import Vue from 'vue'
import router from '../router'
import store from '../store/Store'

let bus = new Vue()

// axios.defaults.timeout = 5000

let normalAxios = axios.create() // 普通 axios
let greedAxios = axios.create() // 贪婪型 axios，当前 URL 存在正在进行的请求时，abort 掉前面的请求，以最后一次为准
let cancel
let promiseArr = {}
const CancelToken = axios.CancelToken

// 普通请求拦截器
normalAxios.interceptors.request.use(
  config => {
    let token = store.state.token
    if (token) {
      config.headers.Authorization = `${token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

normalAxios.interceptors.response.use(
  response => {
    return response
  },
  err => {
    if (err.response) {
      switch (err.response.status) {
        case 401 :
          store.dispatch('logout')
          router.replace({
            path: '/login'
          })
      }
    }
    return Promise.reject(err)
  })

// 贪婪型请求拦截器
// 当前 URL 存在正在进行的请求时，abort 掉前面的请求，以最后一次为准
greedAxios.interceptors.request.use(
  config => {
    let token = store.state.token
    if (token) {
      config.headers.Authorization = `${token}`
    }
    if (promiseArr[config.url]) {
      promiseArr[config.url]('greed request abort')
      promiseArr[config.url] = cancel
    } else {
      promiseArr[config.url] = cancel
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

greedAxios.interceptors.response.use(
  response => {
    return response
  },
  err => {
    if (err.response) {
      switch (err.response.status) {
        case 401 :
          store.dispatch('logout')
          router.replace({
            path: '/login'
          })
      }
    }
    return Promise.reject(err)
  })

// 判断元素类型
function toType (obj) {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase()
}

// 参数过滤函数
function filterNull (o) {
  if (toType(o) === 'file') {
    return o
  }
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}

function apiAxios ({method, url, params, config, axiosType}) {
  if (params) {
    params = filterNull(params)
  }
  let axiosObj = axiosType === 'greed' ? greedAxios : normalAxios
  let initConfig = {
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    withCredentials: false,
    cancelToken: new CancelToken(c => {
      if (axiosType === 'greed') {
        cancel = c
      }
    })
  }
  let axiosConfig
  if (config && toType(config) === 'object') {
    axiosConfig = Object.assign(initConfig, config)
  } else {
    axiosConfig = initConfig
  }
  return axiosObj(axiosConfig)
    .then(function (res) {
      if (res.data.code === 0) {
        return Promise.resolve(res.data)
      } else {
        bus.$message.error(res.data.message)
        return Promise.reject(res.data)
      }
    })
    .catch(function (err) {
      console.log(err)
      if (!err.code && err.constructor.name !== 'Cancel') {
        bus.$message.error('请求失败')
      }
      return Promise.reject(err)
    })
}

export default {
  get: function (url, params, config) {
    return apiAxios({method: 'GET', url, params, config})
  },
  greedGet: function(url, params, config) {
    return apiAxios({method: 'GET', url, params, config, axiosType: 'greed'})
  },
  post: function (url, params, config) {
    return apiAxios({method: 'POST', url, params, config})
  },
  put: function (url, params, config) {
    return apiAxios({method: 'PUT', url, params, config})
  },
  delete: function (url, params, config) {
    return apiAxios({method: 'DELETE', url, params, config})
  }
}
