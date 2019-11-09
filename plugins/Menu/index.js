import Main from './src/main.js'
import './src/default-menu.css'

Main.install = function (Vue, option) {
  Vue.prototype.$menu = Main
}

export default Main