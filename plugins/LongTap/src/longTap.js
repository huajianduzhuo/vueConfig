let r = null, // setTimeout 标志
    cr = null // 改变长按元素样式的定时器
let startX = 0, // touchstart 时手指的位置，用于 touchmove 时判断手指是否移动
    startY = 0
let firstTouch = false

export default {
  inserted (el, binding, vNode) {
    let delayTime = 1200
    let disX = 10,
        disY = 10
    let value = binding.value
    /** 
     * 可通过传入对象字面量的方式，指定长按时间：v-longtap = "{time: 2000}"
     * 时间必须超过 500ms
     */
    if (value && value.time && Number.isInteger(value.time) && value.time >= 500) {
      delayTime = value.time
    }
    /** 
     * 可通过传入对象字面量的方式，指定手指移动间隔：v-longtap = "{disX: 10, disY: 10}"
     * 如果某一个值为负数，则不判断那个方向
     */
    if (value && value.disX && Number.isInteger(value.disX)) {
      disX = value.disX
    }
    if (value && value.disY && Number.isInteger(value.disY)) {
      disY = value.disY
    }
    /** 
     * 给元素绑定 touchstart 事件
     * 添加一个延迟函数，delayTime 后执行长按回调函数
     * 如果正存在一个长按事件，则本次不执行（最下面为 document 绑定 click 事件，用于取消一次已经触发的长按事件）
     */
    el.addEventListener('touchstart', event => {
      firstTouch = true
      /** 
       * touchend 时延迟删除元素样式
       * 防止多次点击样式延迟删除导致长按时样式被删除
       */
      if (cr) {
        clearTimeout(cr)
        cr = null
      }
      addActiveClass(el, true)
      let touch = event.changedTouches[0]
      startX = touch.clientX
      startY = touch.clientY
      // settimeout 函数
      r = setTimeout(() => {
        r = null
        /** 
         * 如果绑定的值是函数，则执行
         * v-longtap = "cb"
         * v-longtap = "{handler: cb}"
         * 不能是：v-longtap = "cb()"，这种形式绑定时就会执行 cb
         */
        if (typeof value === 'function') {
          value(event, el, vNode)
          event.preventDefault()
          return
        } else if (value && value.handler && typeof value.handler === 'function') {
          value.handler(event, el, vNode)
          event.preventDefault()
          return
        }
      }, delayTime)
      touch = null
    }, false)
    /** 
     * 给元素绑定 touchmove 事件
     * 若手指移动超过 10 像素，则不是长按事件，取消 timeout
     */
    el.addEventListener('touchmove', event => {
      let touch = event.changedTouches[0]
      let diffX = Math.abs(touch.clientX - startX)
      let diffY = Math.abs(touch.clientY - startY)
      if ((disX > 0 && diffX > disX) || (disY > 0 && diffY > disY)) {
        firstTouch && addActiveClass(el, false)
        if (r) {
          clearTimeout(r)
          r = null
        }
        firstTouch = false
      }
      touch = null
    }, false)
    /** 
     * 给元素绑定 touchend 事件
     * 手指离开时，如果时间没有超过 delayTime，则不是长按事件，取消 timeout
     */
    el.addEventListener('touchend', event => {
      firstTouch = false
      cr = setTimeout(() => {
        addActiveClass(el, false)
      }, 100)
      if (r) {
        clearTimeout(r)
        r = null
      }
    }, false)
  }
}

function addActiveClass(el, opt) {
  let cns = el.className.split(' ')
  let index = cns.indexOf('longtap-active')
  if (opt) {
    if (index === -1) {
      el.style.transition = 'all 0.3s'
      cns.push('longtap-active')
      el.className = cns.join(' ')
    }
  } else {
    if (index > -1) {
      cns.splice(index, 1)
      el.className = cns.join(' ')
      el.style.transition = 'all 0s'
    }
  }
}