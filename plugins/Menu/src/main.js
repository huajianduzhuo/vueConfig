import Vue from 'vue'
import Menu from './menu'
const MenuContructor = Vue.extend(Menu)

const Main = function (event, el, data) {
  event = event || window.event
  if (el && el.nodeName) {
    // 具有触发显示菜单的元素
    const elRect = el.getBoundingClientRect()
    const docH = document.documentElement.clientHeight
    const isOnTop = elRect.top >= docH / 5
    const menuLeft = elRect.left + el.offsetWidth / 2
    const menuTop = isOnTop ? elRect.top - 6 : elRect.top + el.offsetHeight + 6
    data = typeof data === 'object' ? data : {}
    const vm = new MenuContructor({data: {event, el, isOnTop, menuLeft, menuTop, ...data}}).$mount()
    document.body.appendChild(vm.$el)
  } else {
    console.error('require a dom element')
  }
}

export default Main

document.body.onselectstart=document.body.oncontextmenu=function(){ return false} 
