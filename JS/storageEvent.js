import {local, session} from './storage'

window.addEventListener('storage', function (event) {
  if (event.key === 'gss') {
    // 已存在的标签页会收到这个事件
    localStorage.setItem('ses', JSON.stringify(sessionStorage))
    localStorage.removeItem('ses')
  } else if (event.key === 'ses' && !session.get('USER_TOKEN')) {
    // 新开启的标签页会收到这个事件
    let data = JSON.parse(event.newValue)
    for (let key in data) {
      sessionStorage.setItem(key, data[key])
    }
  }
})

// 从其他页面获取 token，若没有获取到，则重新判断登陆
local.set('gss', Date.now())
