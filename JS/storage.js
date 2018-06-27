export const session = {
  set(key, value) {
    sessionStorage.setItem(key, value)
  },
  get(key) {
    return sessionStorage.getItem(key)
  },
  remove(key) {
    sessionStorage.removeItem(key)
  }
}

export const local = {
  set(key, value) {
    localStorage.setItem(key, value)
  },
  get(key) {
    return localStorage.getItem(key)
  },
  remove(key) {
    localStorage.removeItem(key)
  }
}

export const cookie = {
  // 设置cookie
  set(name, value, seconds) {
    seconds = seconds || 0 // seconds有值就直接赋值，没有为0，不设置 expires，浏览器关闭cookie失效
    let expires = ''
    if (seconds !== 0) { // 设置cookie生存时间
      let date = new Date()
      let expiresTime = new Date(date.getTime() + seconds * 1000)
      expires = '; expires=' + expiresTime.toGMTString()
    }
    document.cookie = name + '=' + value + expires
  },
  // 读取cookie
  get(name) {
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    let arr = document.cookie.match(reg)
    if (arr) {
      return unescape(arr[2])
    } else {
      return null
    }
  },
  // 清除cookie
  remove (name) {
    cookie.set(name, '', -1)
  }
}
