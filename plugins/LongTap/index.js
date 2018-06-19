import LongTap from './src/longTap'

LongTap.install = function (Vue, option) {
  /** 
   * 添加 longtap 指令
   * 注意：绑定的值如果是函数，则不能直接调用，否则绑定指令时该回调直接执行
   *    不能是：v-longtap="callback()"，而应该是：v-longtap="callback"
   */
  Vue.directive('longtap', LongTap)
}

export default LongTap